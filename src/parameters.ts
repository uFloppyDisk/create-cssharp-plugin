import { existsSync } from "fs";
import path from "path";
import { PromptObject } from "prompts";
import { TARGET_BASE } from "./constants";

type Validation<T extends string = string, P = PromptObject<T>["validate"]> =
  (answer: Parameters<P>[0]) => ReturnType<P>;

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

function validateString(errorMsg: string): Validation {
  return (answer) => {
    return typeof answer === 'string' && answer.trim().length > 0 ? true : errorMsg;
  }
}

function validatePathDoesNotExist(errorMsg: string, base: string = TARGET_BASE): Validation {
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
      validateString('Your project directory must have a name!'),
      validatePathDoesNotExist(`A directory with that name already exists!`),
    ]),
  },
  {
    type: 'toggle',
    name: 'containingDirectorySameName',
    message: 'Do you want your plugin to have the same name as your project directory?',
    initial: true,
    active: 'yes',
    inactive: 'no',
  },
  {
    type: (_, values) => values.containingDirectorySameName === false ? 'text' : null,
    name: 'pluginName',
    message: 'What do you want to name your plugin?',
    initial: (_, values) => values.containingDirectoryName,
    validate: validateString('Your plugin must have a name!'),
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
      if (this.firstRender) {
        this.msg = `Setup plugin using dotnet? ${kleur.gray('(You must have the dotnet CLI installed and accessible via `dotnet`)')}`
      }
    }
  },
];

