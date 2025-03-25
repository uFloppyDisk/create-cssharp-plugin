import { vol } from "memfs";
import fs from "fs";
import {
  validateNonEmptyString,
  validatePathDoesNotExist,
  validateStringIsNotPath
} from "~/validations";

jest.mock("fs");

const errorMsg = "there was an error";

describe('validateNonEmptyString', () => {
  it('returns true on happy case', () => {
    const func = validateNonEmptyString('');

    expect(func('a string')).toBe(true);
  });

  it('returns error message', () => {
    const func = validateNonEmptyString(errorMsg);

    //@ts-expect-error
    expect(func(12345)).toBe(errorMsg);
    expect(func('')).toBe(errorMsg);
  });
});

describe('validateStringIsNotPath', () => {
  it('returns true on happy case', () => {
    const func = validateStringIsNotPath('');

    expect(func('string')).toBe(true);
    expect(func('directory.with.dots')).toBe(true);
  });

  it('returns error message', () => {
    const func = validateStringIsNotPath(errorMsg);

    expect(func("this/is/a/path")).toBe(errorMsg);
    expect(func("/etc/something")).toBe(errorMsg);
  });
});

describe("validatePathDoesNotExist", () => {
  beforeEach(() => {
    vol.reset();

    fs.mkdirSync("/exists");
  });

  it('returns true on happy case', () => {
    const func = validatePathDoesNotExist('');

    expect(func("doesnotexist")).toBe(true);
  });

  it('returns error message', () => {
    const func = validatePathDoesNotExist(errorMsg, "/");

    expect(func("exists")).toBe(errorMsg);
  });
});
