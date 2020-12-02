import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import tmp = require('tmp');
import YAML from 'yaml';
import kustomize from './kustomize';
import {getBinPath} from './utils';
import {buildTestLogger, Logger} from './logger';
import {createKustomizeFolder, defaultKustomizeArgs} from './setup';

describe('kustomize', () => {
  let tmpDir: string, kPath: string | undefined;
  let cleanup: (() => void)[] = [];
  const cleanUpGetName = (
    toCleanup: tmp.FileResult | tmp.DirResult
  ): string => {
    cleanup.push(toCleanup.removeCallback);
    return toCleanup.name;
  };

  let logger: Logger, loggerErrors: (string | Error)[];
  beforeEach(() => {
    loggerErrors = [];
    logger = buildTestLogger([], [], loggerErrors);
  });
  afterAll(() => cleanup.forEach(f => f()));

  beforeAll(async () => {
    await createKustomizeFolder();
    tmpDir = cleanUpGetName(tmp.dirSync({unsafeCleanup: true}));
    kPath = await getBinPath('kustomize');
    if (!kPath) {
      downloadKustomizeBin(tmpDir);
      kPath = path.join(tmpDir, 'kustomize');
    }
    createTestData(tmpDir);
  });

  test('throws on error', async () => {
    const handleError = (p: any) => {
      expect(p).toBeDefined();
      expect(loggerErrors).not.toHaveLength(0);
    };
    await kustomize(
      tmpDir,
      [],
      logger,
      defaultKustomizeArgs,
      'dukhsdkjsdhkj'
    ).catch(handleError);
    await kustomize(
      'this is invalid',
      [],
      logger,
      defaultKustomizeArgs,
      kPath
    ).catch(handleError);
    await kustomize(
      cleanUpGetName(tmp.dirSync({unsafeCleanup: true})),
      [],
      logger,
      defaultKustomizeArgs,
      kPath
    ).catch(handleError);
    await kustomize(
      tmpDir,
      ['/IDontExist'],
      logger,
      defaultKustomizeArgs,
      kPath
    ).catch(handleError);
    expect.assertions(8);
  });
  test('outputs yaml', async () => {
    const output = await kustomize(
      tmpDir,
      [],
      logger,
      defaultKustomizeArgs,
      kPath
    );
    expect(output.map(d => d.toJSON())).toEqual([
      YAML.parseDocument(getNsYaml('a')).toJSON(),
      YAML.parseDocument(getNsYaml('b')).toJSON()
    ]);
    expect(loggerErrors).toHaveLength(0);
  });
  test('outputs extra resources', async () => {
    const extraResourcePath = cleanUpGetName(tmp.fileSync({postfix: '.yaml'}));
    fs.writeFileSync(extraResourcePath, getNsYaml('c'));
    const output = await kustomize(
      tmpDir,
      [extraResourcePath],
      logger,
      defaultKustomizeArgs,
      kPath
    );
    expect(output.map(d => d.toJSON())).toEqual([
      YAML.parseDocument(getNsYaml('a')).toJSON(),
      YAML.parseDocument(getNsYaml('b')).toJSON(),
      YAML.parseDocument(getNsYaml('c')).toJSON()
    ]);
    expect(loggerErrors).toHaveLength(0);
  });
});

const downloadKustomizeBin = (dir: string) => {
  const url =
    'https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv3.5.4/kustomize_v3.5.4_linux_amd64.tar.gz';
  execSync(`curl -Lo ${dir}/kustomize.tgz '${url}'`);
  execSync(`tar xzf ${dir}/kustomize.tgz -C ${dir}`);
};

function createTestData(dir: string, names: string[] = ['a', 'b']) {
  fs.writeFileSync(
    path.join(dir, '/kustomization.yaml'),
    `resources:\n${names.map(n => `  - ${n}.yaml`).join('\n')}`
  );
  names.forEach(n =>
    fs.writeFileSync(path.join(dir, `${n}.yaml`), getNsYaml(n))
  );
}

function getNsYaml(name: string) {
  return `
apiVersion: v1
kind: Namespace
metadata:
  name: ${name}
`.trim();
}
