import YAML from 'yaml';
import {Logger} from './logger';

const simplifyRam = (input: string): string => {
  const units = 'kmgtp';
  const inNum = parseInt(input.match(/^\d+/)?.shift() || '0');
  const inUnit = input.toLowerCase().match(/\D+$/)?.shift()?.trim();
  let num = inNum;
  let unit = inUnit;
  if (!inNum || !inUnit) {
    return input;
  }
  let unitIndex = units.indexOf(inUnit[0]);
  if (unitIndex === -1) {
    return input;
  }
  const divisor = inUnit.endsWith('i') ? 1000 : 1024;

  while (num % divisor === 0) {
    unitIndex++;
    num /= divisor;
  }
  unit =
    units[unitIndex].toUpperCase() +
    (inUnit.length > 1 ? inUnit.substr(1) : '');

  return num + unit;
};

const cleanElem = (log: (s: string) => void) => (elem: any, path: string) => {
  if (
    (/\/(creationtimestamp|subresources|webhooks)$/.test(path) &&
      elem.value === null) ||
    (/\/(subresources|labels|annotations|status|ports)$/.test(path) &&
      (elem.value === null ||
        elem.value.items == null ||
        elem.value.items.length === 0))
  ) {
    log(`${path}\t\t: Removed`);
    return true;
  }

  if (elem.value.type === 'PLAIN') {
    if (path.endsWith('/limits/cpu') || path.endsWith('/requests/cpu')) {
      if (typeof elem.value.value === 'number') {
        elem.value.value = elem.value.value.toString();
      } else {
        const newVal = elem.value.value.replace(/000m/, '');
        if (elem.value.value !== newVal) {
          log(`${path}\t\t: Changed from "${elem.value.value}" to "${newVal}"`);
          elem.value.value = newVal;
        }
      }
    }
    if (path.endsWith('/limits/memory') || path.endsWith('/requests/memory')) {
      const newVal = simplifyRam(elem.value.value);
      if (elem.value.value !== newVal) {
        log(`${path}\t\t: Changed from "${elem.value.value}" to "${newVal}"`);
        elem.value.value = newVal;
      }
    }
  }
  return false;
};

const descendInToProps = (
  func: (elem: any, path: string) => boolean,
  elem: any,
  path: string,
  parentNode: any
) => {
  if (!elem) {
    return;
  }
  let curPath = path;
  if (elem.key && elem.key.value) {
    curPath = path + '/' + elem.key.value;
    const remove = func(elem, curPath.toLowerCase().trim());
    if (remove) {
      parentNode.delete(elem.key.value);
      return;
    }
  }
  const children = elem.items || (elem.value && elem.value.items);
  if (children) {
    children.map((e: any) => descendInToProps(func, e, curPath, elem.value));
  }
};

export const removeKustomizeValues = (
  docs: YAML.Document[],
  logger: Logger | undefined
): YAML.Document[] =>
  docs.filter(d => {
    const toRemove =
      d.get('apiVersion') === 'kustomize.config.k8s.io/v1' &&
      d.get('kind') === 'Values';
    if (toRemove) {
      logger?.log(
        `Removing ${d.getIn(['metadata', 'namespace'])}/${d.getIn([
          'metadata',
          'name'
        ])}`
      );
    }
    return !toRemove;
  });

const disjunctiveIntersectSecrets = (x: SecretMeta[], y: SecretMeta[]) =>
  x.filter(
    s => !!!y.find(a => a.namespace === s.namespace && a.name === s.name)
  );

export const checkSecrets = (
  docs: YAML.Document[],
  allowedSecrets: SecretMeta[],
  logger: Logger | undefined
) => {
  const secrets = docs
    .filter(d => d.get('kind') === 'Secret')
    .map(s => s.get('metadata'))
    .map(m => ({name: m.get('name'), namespace: m.get('namespace')}));
  if (secrets.length > allowedSecrets.length) {
    throw new Error(
      `Found ${secrets.length} secrets but only ${allowedSecrets.length} are allowed`
    );
  }
  logger?.log(
    'Found secrets: ' + secrets.map(s => s.namespace + '/' + s.name).join(', ')
  );
  logger?.log(
    "Didn't find allowed secrets: " +
      disjunctiveIntersectSecrets(allowedSecrets, secrets)
        .map(s => s.namespace + '/' + s.name)
        .join(', ')
  );

  const invalidSecrets = disjunctiveIntersectSecrets(secrets, allowedSecrets);
  if (invalidSecrets.length > 0) {
    throw new Error(
      `Invalid secrets: ${invalidSecrets
        .map(s => s.namespace + '/' + s.name)
        .join(', ')}`
    );
  }
};

export const cleanUpYaml = (
  doc: YAML.Document,
  logger?: Logger
): {doc: YAML.Document; modified: boolean} => {
  let modified = false;
  descendInToProps(
    cleanElem(s => {
      modified = true;
      logger?.log(s);
    }),
    doc.contents,
    '',
    doc
  );
  return {doc, modified};
};

export const customValidation = (
  input: string,
  customValidation: {regex: RegExp; expected: boolean; message: string}[],
  logger: Logger | undefined
): string[] => {
  logger?.log(JSON.stringify(customValidation, null, 2));
  return customValidation
    .filter(v => {
      const m = v.regex.exec(input);
      const fail = !!m !== v.expected;
      logger?.log(
        `${v.regex.source}	:${m ? 'Matched' : 'Not matched'}	${
          fail ? 'Fail ' : 'Pass'
        } "${m && m!}"`
      );
      return fail;
    })
    .map(v => v.message);
};

type SecretMeta = {
  namespace: string;
  name: string;
};
