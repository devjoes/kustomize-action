import * as core from '@actions/core';
import YAML from 'yaml';
import {buildActionLogger, buildConsoleLogger, Logger} from './logger';
import kustomize from './kustomize';
import {
  checkSecrets,
  cleanUpYaml,
  customValidation,
  removeKustomizeValues
} from './cleanYaml';
import validateYaml from './validation';
import {
  getSettings,
  Settings,
  validateEnvironment,
  validateSettings
} from './setup';
import {runActions} from './outputs';
import {makeBox} from './utils';

const main = async () => {
  const isAction = !!process.env.GITHUB_EVENT_NAME;
  const logger = isAction ? buildActionLogger() : buildConsoleLogger();
  if (!isAction) {
    logger.warn(
      'Not running as action because GITHUB_WORKFLOW env var is not set'
    );
  }
  try {
    const settings = getSettings(isAction);
    output(logger, settings.verbose, 'Parsing and validating settings');
    if (settings.verbose) {
      console.log(YAML.stringify(settings));
    }
    await validateSettings(settings);
    output(
      logger,
      settings.verbose,
      'Validating environment (binaries, plugin path etc)'
    );
    await validateEnvironment(
      settings.requiredBins,
      settings.verbose ? logger : undefined
    );
    const {yaml, errors} = await getYaml(settings, logger);
    if (settings.outputActions && settings.outputActions.length) {
      output(logger, settings.verbose, 'Running output actions');
      await runActions(yaml, errors, settings, logger);
    }
    if (errors.length) {
      throw new Error('Invalid yaml:\n' + errors.join('\n'));
    }
    logger.log('Finished');
  } catch (error) {
    console.log(error);
    logger.error(error.message);
    if (isAction) {
      core.setFailed(error.message || 'Failed');
    } else {
      process.exit(1);
    }
  }
};

const output = (logger: Logger, verbose: boolean, msg: string) => {
  if (!verbose) {
    logger.log(msg);
    return;
  }
  logger.log('\n\n' + makeBox(msg));
};

const getYaml = async (settings: Settings, logger: Logger) => {
  output(logger, settings.verbose, 'Running kustomize');
  const resources = await kustomize(
    settings.kustomizePath,
    settings.extraResources,
    logger,
    settings.verbose
  );
  output(logger, settings.verbose, 'Removing superfluous kustomize resources');
  const docs = removeKustomizeValues(
    resources,
    settings.verbose ? logger : undefined
  );
  output(logger, settings.verbose, 'Cleaning up YAML');
  const {cleanedDocs, modified} = docs.reduce(
    (a, d) => {
      const {doc, modified} = cleanUpYaml(
        d,
        settings.verbose ? logger : undefined
      );
      a.cleanedDocs.push(doc);
      a.modified = a.modified || modified;
      return a;
    },
    {cleanedDocs: <YAML.Document[]>[], modified: false}
  );
  if (!modified && settings.verbose) {
    logger.log('No changes required');
  }
  output(logger, settings.verbose, 'Checking for unencrypted secrets');
  checkSecrets(cleanedDocs, settings.allowedSecrets, logger);
  const yaml = cleanedDocs.join(''); // The docs retain their --- when parsed
  output(logger, settings.verbose, 'Validating YAML');
  let errors = await validateYaml(yaml, logger);
  if (settings.customValidation.length) {
    output(logger, settings.verbose, 'Running customValidation tests');
    errors = errors.concat(
      customValidation(
        yaml,
        settings.customValidation,
        settings.verbose ? logger : undefined
      )
    );
  }

  return {yaml, errors: <string[]>errors.filter(e => e !== undefined)};
};

main();
