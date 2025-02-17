#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import prompts from "prompts";
import parameters from "~/parameters";
import generatePluginFiles from "~/generatePluginFiles";
import { IS_PRODUCTION, TARGET_BASE, TEMPLATE_BASE } from "~/constants";
import { error, renderGoodbye, renderMasthead, warn } from "~/vanity";

renderMasthead();

const generateProject = new Promise(async (resolve, reject) => {
  let cancelled = false;
  function onCancel() {
    warn("Cancelled making a CounterStrike Sharp plugin.");
    cancelled = true;
    return false;
  }

  const answers = await prompts(parameters, { onCancel });
  if (cancelled) return resolve(true);

  console.time("Done in");
  const targetPath = path.join(TARGET_BASE, answers.containingDirectoryName);

  const pluginName = (() => {
    if (!answers.pluginSameName) {
      return answers.pluginName;
    }

    return answers.containingDirectoryName;
  })();

  if (fs.existsSync(targetPath)) {
    return reject(`Path ${targetPath} already exists!`);
  }

  const templatePath = path.join(TEMPLATE_BASE, 'standard-plugin');
  const transforms = {
    "PLUGIN_NAME": pluginName,
    "PLUGIN_AUTHOR": answers.pluginAuthor,
    "PLUGIN_DESCRIPTION": answers.pluginDescription,
    "PLUGIN_VERSION": answers.pluginVersion,
  }

  generatePluginFiles(templatePath, targetPath, transforms);

  const dotnetCommands = [
    'dotnet new solution',
    'dotnet sln add src',
    'dotnet build',
  ]

  if (answers.setupUsingDotnetCli) {
    for (const command of dotnetCommands) {
      console.time(command);
      execSync(command, { cwd: targetPath });
      console.timeEnd(command);
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
