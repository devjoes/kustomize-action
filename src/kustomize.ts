import {execFile} from 'child_process';
import fs from 'fs';
import path from 'path';
import tmp from 'tmp';
import YAML from 'yaml';
import {Logger} from './logger';

const runKustomize = async (
  rootPath: string,
  logger: Logger,
  kustomizeArgs: string,
  binPath?: string
) =>
  new Promise<{stdOut: string; stdErr: string}>((res, rej) => {
    const args = ['build', rootPath, ...kustomizeArgs.split(/\ +/g)];
    logger.log('Running: ' + [binPath || 'kustomize', ...args].join(' '));
    execFile(binPath || 'kustomize', args, (err, stdOut, stdErr) => {
      if (stdErr && stdErr.length) {
        logger.error(stdErr);
      }
      if (err) {
        logger.error(err);
        return rej({err, stdOut, stdErr});
      }
      res({stdOut, stdErr});
    });
  });

const prepDirectory = async (
  rootPath: string,
  extraResources: string[] = []
): Promise<{dir: string; cleanUp: () => void}> => {
  await validatePaths(rootPath, extraResources);
  const {dir, cleanUp} = await new Promise<{dir: string; cleanUp: () => void}>(
    (res, rej) =>
      tmp.dir({unsafeCleanup: true}, (err, dir, cleanUp) =>
        err ? rej(err) : res({dir, cleanUp})
      )
  );

  await Promise.all([
    ...referenceFiles(dir, rootPath, extraResources),
    createKustomization(dir, extraResources)
  ]);
  return {dir, cleanUp};
};

const validatePaths = async (rootPath: string, extraResources: string[]) => {
  const stats = await fs.promises.stat(rootPath);
  if (!stats.isDirectory()) {
    throw new Error(rootPath + ' is not a directory');
  }
  await Promise.all(
    extraResources.map(p =>
      fs.promises.stat(p).then(stats => {
        if (stats.isDirectory()) {
          throw new Error(p + ' is a directory');
        }
      })
    )
  );
};

const referenceFiles = (
  dir: string,
  rootPath: string,
  extraResources: string[]
) =>
  extraResources
    .map(p => fs.promises.copyFile(p, path.join(dir, path.basename(p))))
    .concat(fs.promises.symlink(rootPath, path.join(dir, 'root')));

const createKustomization = (dir: string, extraResources: string[]) =>
  fs.promises.writeFile(
    path.join(dir, 'kustomization.yaml'),
    `
bases:
- root
resources:
${extraResources.map(p => '- ' + path.basename(p)).join('\n')}
`
  );

export default async (
  path: string,
  extraResources: string[] = [],
  logger: Logger,
  kustomizeArgs: string,
  binPath?: string
): Promise<YAML.Document.Parsed[]> => {
  const {dir: tmpPath, cleanUp} = await prepDirectory(path, extraResources);
  const {stdOut, stdErr} = await runKustomize(
    tmpPath,
    logger,
    kustomizeArgs,
    binPath
  );
  if (stdErr != '') {
    throw new Error(stdErr);
  }
  cleanUp();
  return YAML.parseAllDocuments(stdOut, {prettyErrors: true});
};
