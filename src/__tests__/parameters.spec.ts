import { validateNonEmptyString } from "~/parameters";

describe('validateNonEmptyString', () => {
  it('returns true on happy case', () => {
    const func = validateNonEmptyString('');

    expect(func('a string')).toBe(true);
  });

  it('returns error message', () => {
    const errorMsg = "there was an error";
    const func = validateNonEmptyString(errorMsg);

    //@ts-expect-error
    expect(func(12345)).toBe(errorMsg);
    expect(func('')).toBe(errorMsg);
  });
});
