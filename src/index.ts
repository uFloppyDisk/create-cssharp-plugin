#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import pkg from "package.json";

import prompts from "prompts";
import parameters from "~/parameters";
import generatePluginFiles from "~/generatePluginFiles";
import { IS_PRODUCTION, TARGET_BASE, TEMPLATE_BASE } from "~/constants";
import { createSpinner, error, renderCliInfo, renderGoodbye, renderMasthead, warn } from "~/vanity";

renderMasthead();
renderCliInfo();
console.log();

const generateProject = new Promise(async (resolve, reject) => {
  let cancelled = false;
  function onCancel() {
    cancelled = true;
    return false;
  }

  const answers = await prompts(parameters, { onCancel });
  if (cancelled) {
    warn("Cancelled making a CounterStrikeSharp plugin.");
    return resolve(true);
  }

  console.time("Done in");
  const targetPath = path.resolve(TARGET_BASE, answers.containingDirectoryName);
  const pluginName = answers.pluginName ?? path.parse(answers.containingDirectoryName).base;

  if (fs.existsSync(targetPath)) {
    return reject(`Path ${targetPath} already exists!`);
  }

  const templatePath = path.join(TEMPLATE_BASE, 'standard-plugin');
  const transforms = {
    "CLI_VERSION": pkg.version,
    "PLUGIN_NAME": pluginName,
    "PLUGIN_AUTHOR": answers.pluginAuthor,
    "PLUGIN_DESCRIPTION": answers.pluginDescription,
    "PLUGIN_VERSION": answers.pluginVersion,
  }

  fs.mkdirSync(targetPath, { recursive: true });
  generatePluginFiles(templatePath, targetPath, transforms);

  const dotnetCommands = [
    'dotnet new solution',
    'dotnet sln add src',
    'dotnet build',
  ];

  if (answers.setupUsingDotnetCli) {
    for (const command of dotnetCommands) {
      const startTime = performance.now();
      const spinner = createSpinner(`Running '${command}'...`).start();

      const doneOrError = await new Promise<string>((resolve, reject) => {
        exec(command, { cwd: targetPath }).on('close', code => {
          if (code === 0) return resolve('done');
          return reject(`Could not run command '${command}'`);
        });
      }).catch(e => {
        spinner.fail(`Command '${command}' failed!`);
        return e;
      });

      if (doneOrError !== 'done') {
        error(doneOrError);
        return resolve(true);
      }

      const elapsed = Math.trunc(Math.abs(performance.now() - startTime));
      spinner.succeed(`Ran '${command}' in ${elapsed}ms`);
    }
  }

  console.timeEnd("Done in");
  return resolve(true);
});

generateProject
  .catch(err => {
    error(err.message)
    if (!IS_PRODUCTION) console.error(err);
  })
  .finally(() => renderGoodbye());
