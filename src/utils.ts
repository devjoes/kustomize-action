import fs from 'fs';
import path, {ParsedPath} from 'path';

export const resolveEnvVars = (str: string | undefined) =>
  str
    ? str.replace(
        /(?<!\\)\$([A-Z_]+[A-Z0-9_]*)|(?<!\\)\${([A-Z0-9_]*)}/gi,
        (_, a, b) => process.env[a || b] || ''
      )
    : '';

export const getBinPath = (bin: string): Promise<string | undefined> =>
  new Promise<string | undefined>(res => {
    const possPaths = (process.env.PATH || '')
      .replace(/["]+/g, '')
      .split(path.delimiter)
      .map(p =>
        (process.env.PATHEXT || '')
          .split(path.delimiter)
          .map(ext => path.join(p, bin + ext))
      );

    const paths = ([] as string[]).concat(...possPaths);
    let pathCount = paths.length;
    paths.map(p =>
      fs.exists(p, (exists: boolean) => {
        pathCount--;
        if (exists) {
          return res(p);
        }
        if (pathCount === 0) {
          res(undefined);
        }
      })
    );
  });

export const getWorkspaceRoot = () => {
  const getParentGitDir = (parsed: ParsedPath): string | undefined =>
    fs.existsSync(path.join(parsed.dir, parsed.name, '.git'))
      ? path.join(parsed.dir, parsed.name)
      : (parsed.dir !== parsed.root &&
          getParentGitDir(path.parse(parsed.dir))) ||
        undefined;

  return (
    process.env['GITHUB_WORKSPACE'] ||
    getParentGitDir(path.parse(mockedCwd())) ||
    mockedCwd()
  );
};

let curDirName = __dirname;
export const mockedCwd = (newDir?: string): string => {
  if (newDir) {
    curDirName = newDir;
  }
  return curDirName;
};

export const makeBox = (
  title: string,
  minLen = 40,
  maxLen = 80,
  xPadding = 3,
  yPadding = 1
) => {
  const tl = '\u2554',
    h = '\u2550',
    tr = '\u2557',
    v = '\u2551',
    bl = '\u255A',
    br = '\u255D';
  const wrap = (s: string, w: number) =>
    s.split(/\s+/g).reduce((a: string[], i: string) => {
      if (a.length === 0 || a[a.length - 1].length + i.length + 1 > w) {
        a.push('');
      }
      a[a.length - 1] += i + ' ';
      return a;
    }, []);
  const range = (n: number) => Array.from(Array(n).keys());
  const lines = wrap(title, maxLen);
  const width = lines.reduce((a, i) => (i.length > a ? i.length : a), minLen);

  const top = tl.padEnd(width + xPadding * 2, h) + tr;
  const empty = v.padEnd(width + xPadding * 2, ' ') + v;
  const text = lines.map(
    line =>
      v.padEnd(xPadding, ' ') +
      (''.padEnd(Math.floor(width - line.length) / 2) + line).padEnd(
        width,
        ' '
      ) +
      ''.padEnd(xPadding, ' ') +
      v
  );
  const bottom = bl.padEnd(width + xPadding * 2, h) + br;

  return [
    top,
    ...range(yPadding).map(_ => empty),
    ...text,
    ...range(yPadding).map(_ => empty),
    bottom
  ].join('\n');
};
