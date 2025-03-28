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
    },
    prompt: () => ({
      type: (_, values) => values.pluginSameName === false ? 'text' : null,
      message: 'What do you want to name your plugin?',
    }),
  },
  {
    key: "pluginAuthor",
    initial: '',
    prompt: () => ({
      type: 'text',
      message: 'Plugin author',
    }),
  },
  {
    key: 'pluginDescription',
    initial: '',
    prompt: () => ({
      type: 'text',
      message: 'Plugin description',
    }),
  },
  {
    key: 'pluginVersion',
    initial: '0.0.1',
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
    description: "Force interactive prompting. Options set via command-line are populated as prompt defaults.",
    initial: true,
    validate: validationBuilder([
      validateNonEmptyString('Your plugin must have a name!'),
      validateStringIsNotPath('Your plugin name cannot be a path!'),
    ]),
    arg: {
      type: "option",
      flags: "-i, --interactive",
    },
  },
];

export function addCommandLineArguments(
  program: typeof commanderProgram,
  optionsSchema: ProgramSchema[],
): Record<string, string> {
  const reverseLookup: Record<string, string> = {};

  for (const schema of optionsSchema) {
    if (!schema.arg) continue;

    const arg = schema.arg;
    if ("argument" === arg.type) {
      const argument = new Argument(arg.name ?? schema.key, schema.description);
      if (arg.factory) arg.factory(argument, schema);

      program.addArgument(argument);
      reverseLookup[argument.name()] = schema.key;
    } else if ("option" === arg.type) {
      const option = new Option(arg.flags, schema.description);
      if (arg.factory) arg.factory(option, schema);

      program.addOption(option);
      reverseLookup[option.name()] = schema.key;
    }
  }

  return reverseLookup;
}

export function createPrompts(optionsSchema: ProgramSchema[]): PromptObject[] {
  const prompts: PromptObject[] = [];
  for (const schema of optionsSchema) {
    if (!schema.prompt) continue;

    const prompt: PromptObject = {
      name: schema.key,
      initial: schema.initial ?? undefined,
      message: schema.description,
      validate: schema.validate,
      ...schema.prompt(),
    }


    prompts.push(prompt);
  }

  return prompts;
}
