import { transformFileContents, transformFileName } from "~/generatePluginFiles";

describe("transformFileName", () => {
  const transforms = { "REPLACE_ME": "replaced" };

  it.each([
    ["REPLACE_ME.txt", "replaced.txt"],
    ["path/to/file/REPLACE_ME.txt", "replaced.txt"],
    ["REPLACE_ME", "replaced"],
  ])("%s is transformed to %s", (fileName, expected) => {
    const result = transformFileName(fileName, transforms);
    expect(result).toBe(expected);
  });

  it.each([
    ["DIFF_REPLACE_ME.txt"],
    ["DIFF_REPLACE_ME"],
  ])("%s remains the same", (fileName) => {
    const result = transformFileName(fileName, transforms);
    expect(result).toBe(fileName);
  });
});

describe("transformFileContents", () => {
  it("replaces all instances", () => {
    const source = "random\ninput\n1 2\n\t3 4\ninput inp ut INPUT inPut\ntest";
    const transforms = { "input": "output" }

    const newlineSplits = source.split("\n").length;

    const result = transformFileContents(source, transforms);
    expect(result).not.toContain("input");

    expect(result).toContain("output");
    expect(result).toContain("INPUT");

    expect(result.split("\n").length).toBe(newlineSplits);
  });
});
