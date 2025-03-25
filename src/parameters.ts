import path from "path";
import { PromptObject } from "prompts";
import {
  validateNonEmptyString,
  validatePathDoesNotExist,
  validateStringIsNotPath,
  validationBuilder
} from "./validations";

export const interactivePrompts: PromptObject[] = [
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
    name: 'initGitRepo',
    message: 'Initialize a git repository?',
    initial: true,
    active: 'yes',
    inactive: 'no',
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
