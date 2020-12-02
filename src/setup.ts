import {getBinPath, getWorkspaceRoot, resolveEnvVars} from './utils';
import * as core from '@actions/core';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import {OutputAction, parseActions} from './outputs';
import {Logger} from './logger';

export const validateEnvironment = async (
  required: string[] = ['kustomize', 'kubeval', 'helm'],
  logger: Logger | undefined
): Promise<unknown> =>
  Promise.all(
    required
      .map(
        b =>
          new Promise((res, rej) => {
            getBinPath(b).then(path => {
              if (path) {
                logger?.log('Found ' + b + ' at ' + path);
                res(undefined);
              } else {
                rej(b + ' is required');
              }
            });
          })
      )
      .concat(createKustomizeFolder())
  );
export const createKustomizeFolder = () =>
  new Promise<void>(r => {
    let dir;
    if (process.env['KUSTOMIZE_PLUGIN_HOME']) {
      dir = process.env['KUSTOMIZE_PLUGIN_HOME'];
    } else if (process.env['XDG_CONFIG_HOME']) {
      dir = path.join(process.env['XDG_CONFIG_HOME'], 'kustomize', 'plugin');
    } else {
      dir = path.join(process.env['HOME']!, 'kustomize', 'plugin');
    }
    fs.promises.mkdir(dir, {recursive: true}).finally(r);
  });

export type Settings = {
  kustomizePath: string;
  allowedSecrets: {namespace: string; name: string}[];
  verbose: boolean;
  outputActions: OutputAction[];
  extraResources: string[];
  customValidation: {regex: RegExp; expected: boolean; message: string}[];
  requiredBins: string[];
  kustomizeArgs: string;
  validateWithKubeVal: boolean;
};

export const parseAllowedSecrets = (secretString: string) =>
  secretString
    .split(/,/g)
    .map(s => s.trim().toLowerCase())
    .filter(i => i.indexOf('/') > -1)
    .map(i => ({namespace: i.split(/\//)[0], name: i.split(/\//)[1]}));

export const parseCustomValidation = (customValidation: string | undefined) =>
  customValidation
    ? customValidation
        .split(/(?<!\\)\n/g)
        .map(i => i.split(/\|/g))
        .map(i => {
          if (i.length >= 3) {
            const parseRx = (str: string) => {
              const rx = /(^[^\/].*[^\/]$)|^\/(.*)\/([igmsuy]*)$/; // Parse "this" "/this/" or "/this/ig"
              const match = rx.exec(str);
              if (!match) {
                throw new Error('Invalid regex: ' + str);
              }
              return match[1]
                ? new RegExp(match[1])
                : new RegExp(match[2], match[3]);
            };

            return {
              message: i.shift()!,
              expected: i.shift()!.toLowerCase() === 'true',
              regex: parseRx(i.join('|'))
            };
          }
          throw new Error(
            'Invalid custom validation rule "' + i + '": ' + JSON.stringify(i)
          );
        })
    : [];

export const getSettings = (isAction: boolean): Settings => {
  if (!isAction) {
    dotenv.config();
  }
  const getRequiredFromEnv = (name: string) => {
    const val = process.env[name];
    if (val === undefined) {
      throw new Error(`${name} is required`);
    }
    return val;
  };
  const getFromEnv = (name: string) => process.env[name];
  const getSetting = (
    actionSettingName: string,
    envVarName: string,
    required = false
  ) =>
    isAction
      ? core.getInput(actionSettingName, {required: required})
      : (required ? getRequiredFromEnv : getFromEnv)(envVarName);

  const kustomizePath = getSetting('kustomize-path', 'KUSTOMIZE_PATH', true);
  const outputActions = getSetting('output-actions', 'OUTPUT_ACTIONS', true);
  const extraResources = getSetting('extra-resources', 'EXTRA_RESOURCES');
  const customValidation = getSetting(
    'custom-validation-rules',
    'CUSTOM_VALIDATION_RULES',
    false
  );
  const allowedSecrets = getSetting('allowed-secrets', 'ALLOWED_SECRETS');
  const requiredBins = getSetting('required-bins', 'REQUIRED_BINS');
  const verbose = getSetting('verbose', 'VERBOSE');
  const validateWithKubeVal = getSetting(
    'validate-with-kubeval',
    'VALIDATE_WITH_KUBEVAL'
  );
  const kustomizeArgs = getSetting('kustomize-args', 'KUSTOMIZE_ARGS');

  const workspaceDir = getWorkspaceRoot();
  const getPath = (p: string) =>
    path.isAbsolute(p) ? p : path.join(workspaceDir, p);

  const defaultActions = `[
      { type: "LoggerOutputAction", logErrors: true, logYaml: false },
      {
        type: "VariableOutputAction",
        outputVariableName: "output",
        errorsVariableName: "errors",
      }
    ]
    `;
  return {
    kustomizePath: getPath(resolveEnvVars(kustomizePath || '.')),
    outputActions: parseActions(outputActions || defaultActions),
    extraResources: extraResources
      ? resolveEnvVars(extraResources)
          .split(',')
          .map(s => s.trim())
          .map(getPath)
      : [],
    customValidation: parseCustomValidation(customValidation),
    allowedSecrets: parseAllowedSecrets(resolveEnvVars(allowedSecrets || '')),
    verbose: resolveEnvVars(verbose || '').toLowerCase() === 'true',
    requiredBins: requiredBins
      ? resolveEnvVars(requiredBins)
          .split(/,/g)
          .map(s => s.trim())
      : ['kustomize', 'kubeval', 'helm'],
    kustomizeArgs: resolveEnvVars(kustomizeArgs || defaultKustomizeArgs),
    validateWithKubeVal:
      resolveEnvVars(validateWithKubeVal || '').toLowerCase() === 'true'
  };
};

const statFile = async (p: fs.PathLike) =>
  fs.promises.stat(p).then(r => {
    if (!r.isFile()) {
      throw new Error(p + ' is not a file');
    }
  });

const statDir = async (p: fs.PathLike) =>
  fs.promises.stat(p).then(r => {
    if (!r.isDirectory()) {
      throw new Error(p + ' is not a directory');
    }
  });

export const validateSettings = (settings: Settings) =>
  Promise.all([
    statDir(settings.kustomizePath).then(() =>
      statFile(path.join(settings.kustomizePath, 'kustomization.yaml'))
    ),
    ...(settings.extraResources || []).map(statFile)
  ]);
export const defaultKustomizeArgs = '--enable_alpha_plugins';
