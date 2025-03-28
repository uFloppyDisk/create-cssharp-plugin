import { PromptObject } from "prompts";
import { program as commanderProgram } from "commander";
import {
  validateNonEmptyString,
  validatePathDoesNotExist,
  validateStringIsNotPath,
  Validation,
  validationBuilder
} from "./validations";
import { Argument, Option } from "commander";

export type ProgramOption<T = any> = { value: T, wasSet: boolean };
type PromptOptions<T extends string = string> = Omit<PromptObject<T>, "name">;
type CommandLineArgument = {
  type: "argument";
  name?: string;
  factory: (obj: Argument, schema: ProgramSchema) => void;
} | {
  type: "option";
  flags: Option["flags"];
  factory?: (obj: Option, schema: ProgramSchema) => void;
}
type ProgramSchema = {
  key: string;
  description?: string;
  initial?: PromptObject["initial"];
  validate?: Validation;
  arg?: CommandLineArgument;
  prompt?: <T extends string = string>() => PromptOptions<T>;
}
export const programSchema: ProgramSchema[] = [
  {
    key: "containingDirectoryName",
    description:
      "Project name used as the project directory and plugin namespace. Accepts a path relative to current working directory.",
    validate: validationBuilder([
      validateNonEmptyString('Your project directory must have a name!'),
      validatePathDoesNotExist(`A directory with that name already exists!`),
    ]),
    arg: {
      type: "argument",
      name: "projectDirectory",
      factory(obj) {
        obj.argOptional();
      },
    },
    prompt: () => ({
      type: 'text',
      message: 'What do you want to name the project directory?',
    }),
  },
  {
    key: "pluginSameName",
    initial: true,
    arg: {
      type: "option",
      flags: "--pluginSameName",
      factory(obj) {
        obj.hidden = true;
      },
    },
    prompt: () => ({
      type: 'toggle',
      message: 'Do you want your plugin to have the same name as your project directory?',
      active: 'yes',
      inactive: 'no',
    }),
  },
  {
    key: "pluginName",
    description: "Use this option to set a different name for your plugin's namespace.",
    validate: validationBuilder([
      validateNonEmptyString('Your plugin must have a name!'),
      validateStringIsNotPath('Your plugin name cannot be a path!'),
    ]),
    arg: {
      type: "option",
      flags: "-p, --pluginName <name>",
      factory(obj) {
        obj.implies({ pluginSameName: false });
      },
    },
    prompt: () => ({
      type: (_, values) => values.pluginSameName === false ? 'text' : null,
      message: 'What do you want to name your plugin?',
    }),
  },
  {
    key: "pluginAuthor",
    initial: '',
    arg: {
      type: "option",
      flags: "-a, --pluginAuthor <name>",
    },
    prompt: () => ({
      type: 'text',
      message: 'Plugin author',
    }),
  },
  {
    key: "noPluginAuthor",
    description: "Skip prompting for plugin author.",
    initial: false,
    arg: {
      type: "option",
      flags: "-A, --noPluginAuthor",
      factory(obj) {
        obj.implies({ pluginAuthor: '' })
      },
    },
  },
  {
    key: 'pluginDescription',
    initial: '',
    arg: {
      type: "option",
      flags: "-d, --pluginDescription <description>",
    },
    prompt: () => ({
      type: 'text',
      message: 'Plugin description',
    }),
  },
  {
    key: "noPluginAuthor",
    description: "Skip prompting for plugin description.",
    initial: false,
    arg: {
      type: "option",
      flags: "-D, --noPluginDescription",
      factory(obj) {
        obj.implies({ pluginDescription: '' })
      },
    },
  },
  {
    key: 'pluginVersion',
    description: "Defaults to '0.0.1'",
    initial: '0.0.1',
    arg: {
      type: "option",
      flags: "-v, --initialVersion <version>",
    },
    prompt: () => ({
      type: 'text',
      message: 'Initial version',
    }),
  },
  {
    key: 'initGitRepo',
    initial: true,
    prompt: () => ({
      type: 'toggle',
      message: 'Initialize a git repository?',
      active: 'yes',
      inactive: 'no',
    }),
  },
  {
    key: 'setupUsingDotnetCli',
    initial: true,
    prompt: () => ({
      type: 'toggle',
      message: 'Setup plugin using dotnet?',
      active: 'yes',
      inactive: 'no',
      onRender(kleur) {
        //@ts-ignore
        if (this.firstRender) {
          //@ts-ignore
          this.msg = `Setup plugin using dotnet? ${kleur.gray('(You must have the dotnet CLI installed and accessible via `dotnet`)')}`
        }
      }
    }),
  },
  {
    key: "interactive",
    description: "Ask prompts while skipping values set using positional arguments and flags.",
    arg: {
      type: "option",
      flags: "-i, --interactive",
    },
  },
  {
    key: "forceInteractive",
    description: "Force ask all prompts. Options set via command-line are populated as prompt defaults.",
    arg: {
      type: "option",
      flags: "-I, --forceInteractive",
    },
  },
];

export function addCommandLineArguments(
  program: typeof commanderProgram,
  optionsSchema: ProgramSchema[],
): Record<string, string> {
  const lookup: Record<string, string> = {};

  for (const schema of optionsSchema) {
    if (!schema.arg) continue;

    const arg = schema.arg;
    if ("argument" === arg.type) {
      const argument = new Argument(arg.name ?? schema.key, schema.description);
      if (arg.factory) arg.factory(argument, schema);

      program.addArgument(argument);
      lookup[schema.key] = argument.name();
    } else if ("option" === arg.type) {
      const option = new Option(arg.flags, schema.description);
      if (arg.factory) arg.factory(option, schema);

      program.addOption(option);
      lookup[schema.key] = option.name();
    }
  }

  return lookup;
}

export function createPrompts(optionsSchema: ProgramSchema[], options: Record<string, ProgramOption>): PromptObject[] {
  const prompts: PromptObject[] = [];
  for (const schema of optionsSchema) {
    if (!schema.prompt) continue;

    const prompt: PromptObject = {
      name: schema.key,
      initial: options[schema.key].value ?? (schema.initial ?? undefined),
      message: schema.description,
      validate: schema.validate,
      ...schema.prompt(),
    }

    prompts.push(prompt);
  }

  return prompts;
}
