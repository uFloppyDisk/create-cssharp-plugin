import path from "path";
import { existsSync } from "fs";
import { TARGET_BASE } from "~/constants";

type ValidationClosure<T> = (input: T) => boolean | string;
type Validation<T extends string = string> = ValidationClosure<T>;

export function validationBuilder(validations: Validation[]): Validation {
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

