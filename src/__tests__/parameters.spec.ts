import { validateNonEmptyString, validatePathDoesNotExist } from "~/parameters";
import { vol } from "memfs";
import fs from "fs";

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
