#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import pkg from "package.json";

import prompts from "prompts";
import { addCommandLineArguments, programSchema, createPrompts, ProgramOption } from "~/parameters";
import generatePluginFiles from "~/generatePluginFiles";
import { IS_PRODUCTION, TARGET_BASE, TEMPLATE_BASE } from "~/constants";
import { createSpinner, error, renderCliInfo, renderGoodbye, renderMasthead, warn } from "~/vanity";
import { promiseWithSpinner } from "./helpers";
import { program } from "commander";

program.version(pkg.version);
const lookup = addCommandLineArguments(program, programSchema);

const parsedOpts = program.parse().opts();

const options = programSchema.reduce<Record<string, ProgramOption>>((acc, s) => {
  const opt = parsedOpts?.[lookup[s.key]];
  acc[s.key] = {
    value: opt ?? (s.initial ?? null),
    wasSet: !!opt,
  }

  return acc;
}, {});

const positionalArgs = programSchema.filter(s => s.arg && s.arg.type === "argument");
for (const [i, arg] of positionalArgs.entries()) {
  if (!program.args[i]) continue;

  const passed = !!arg.validate ? arg.validate(program.args[i]) : true;
  if (typeof passed === "string") {
    program.error(`${passed}: ${program.args[i]}`);
  } else if (passed === false) {
    program.help();
  }

  options[arg.key].value = program.args[i];
  options[arg.key].wasSet = true;
};

if (!options["interactive"].value) {
  prompts.override(
    Object.fromEntries(
      Object.entries(options)
        .filter(o => o[1].wasSet)
        .map(o => [o[0], o[1].value])
    )
  );
}

renderMasthead();
renderCliInfo();
console.log();

const dotnetCommands = [
  'dotnet new solution',
  'dotnet sln add src',
  'dotnet build',
];

const gitCommands = [
  "git init",
  "git add .",
];

async function execShellCommand(command: string, targetPath: string) {
  const startTime = performance.now();
  const spinner = createSpinner(`Running '${command}'...`).start();

  await promiseWithSpinner((resolve, reject) => {
    exec(command, { cwd: targetPath }).on('close', code => {
      if (code === 0) {
        const elapsed = Math.trunc(Math.abs(performance.now() - startTime));
        return resolve(`Ran '${command}' in ${elapsed}ms`);
      }

      return reject(`Could not run command '${command}'`);
    });
  }, spinner, { persistOnFail: false })
    .catch(e => {
      throw e;
    });
}

const generateProject = new Promise<void>(async (resolve, reject) => {
  let cancelled = false;
  function onCancel() {
    cancelled = true;
    return false;
  }

  const interactivePrompts = createPrompts(programSchema, options);
  const answers = await prompts(interactivePrompts, { onCancel });
  if (cancelled) {
    warn("Cancelled making a CounterStrikeSharp plugin.");
    return resolve();
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

  if (answers.setupUsingDotnetCli) {
    try {
      for (const command of dotnetCommands) {
        await execShellCommand(command, targetPath);
      }
    } catch (e) {
      return reject(e);
    }
  }

  if (answers.initGitRepo) {
    try {
      for (const command of gitCommands) {
        await execShellCommand(command, targetPath);
      }
    } catch (e) {
      return reject(e);
    }
  }

  console.timeEnd("Done in");
  return resolve();
});

generateProject
  .catch(err => {
    err instanceof Error ? error(err.message) : error(err);
    if (!IS_PRODUCTION) console.error(err);
  })
  .finally(() => renderGoodbye());
