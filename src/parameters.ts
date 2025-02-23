import { existsSync } from "fs";
import path from "path";
import { PromptObject } from "prompts";
import { TARGET_BASE } from "~/constants";

type ValidationClosure<T> = (input: T) => boolean | string;
type Validation<T extends string = string> = ValidationClosure<T>;

function validationBuilder(validations: Validation[]): Validation {
  return (answer: string) => {
    for (const validate of validations) {
      const result = validate(answer);
      if (result === true) continue;

      return result;
    }

    return true;
  }
}

export function validateNonEmptyString(errorMsg: string): Validation {
  return (answer) => {
    return typeof answer === 'string' && answer.trim().length > 0 ? true : errorMsg;
  }
}

export function validateStringIsNotPath(errorMsg: string): Validation {
  return (answer: string) => {
    const found = answer.match(/[\/\\\:]/);
    if (!found) return true;

    return found.length <= 0 ? true : errorMsg;
  }
}

export function validatePathDoesNotExist(errorMsg: string, base: string = TARGET_BASE): Validation {
  return (answer) => {
    return !existsSync(path.join(base, answer)) ? true : errorMsg;
  }
}

export default <PromptObject[]>[
  {
    type: 'text',
    name: 'containingDirectoryName',
    message: 'What do you want to name the project directory?',
    validate: validationBuilder([
      validateNonEmptyString('Your project directory must have a name!'),
      validatePathDoesNotExist(`A directory with that name already exists!`),
    ]),
  },
  {
    type: 'toggle',
    name: 'pluginSameName',
    message: 'Do you want your plugin to have the same name as your project directory?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: (_, values) => values.pluginSameName === false ? 'text' : null,
    name: 'pluginName',
    message: 'What do you want to name your plugin?',
    initial: (_, values) => path.parse(values.containingDirectoryName).base,
    validate: validationBuilder([
      validateNonEmptyString('Your plugin must have a name!'),
      validateStringIsNotPath('Your plugin name cannot be a path!'),
    ])
  },
  {
    type: 'text',
    name: 'pluginAuthor',
    message: 'Plugin author',
    initial: '',
  },
  {
    type: 'text',
    name: 'pluginDescription',
    message: 'Plugin description',
    initial: '',
  },
  {
    type: 'text',
    name: 'pluginVersion',
    message: 'Initial version',
    initial: '0.0.1',
  },
  {
    type: 'toggle',
    name: 'setupUsingDotnetCli',
    message: 'Setup plugin using dotnet?',
    initial: true,
    active: 'yes',
    inactive: 'no',
    onRender(kleur) {
      //@ts-ignore
      if (this.firstRender) {
        //@ts-ignore
        this.msg = `Setup plugin using dotnet? ${kleur.gray('(You must have the dotnet CLI installed and accessible via `dotnet`)')}`
      }
    }
  },
];

