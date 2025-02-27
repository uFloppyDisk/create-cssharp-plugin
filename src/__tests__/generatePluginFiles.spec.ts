import path from "path";
import { vol, createFsFromVolume } from "memfs";
import { ufs } from "unionfs";
import generatePluginFiles, { transformFileContents, transformFileName } from "~/generatePluginFiles";
import { nestedDirectories } from "~/__fixtures__/templateMocks";
import assert from "assert";

jest.mock('fs', () => {
  beforeEach(() => vol.mkdirSync(path.join(process.cwd(), '.playground'), { recursive: true }));
  afterEach(() => vol.reset());

  return ufs
    .use(jest.requireActual('fs'))
    .use(createFsFromVolume(vol) as any);
});

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

describe("generatePluginFiles", () => {
  it("makes nested directories", () => {
    vol.fromNestedJSON({ 'fixture': nestedDirectories });

    generatePluginFiles("fixture", ".playground/newDir", {});

    expect(ufs.existsSync(".playground/newDir")).toBe(true);
    expect(ufs.existsSync(`.playground/newDir/${Object.keys(nestedDirectories)[0]}`)).toBe(true);
  });

  it("transforms file content", () => {
    vol.fromNestedJSON({
      'fixture': {
        ...nestedDirectories,
        'REPLACE_THIS': ufs.readFileSync("src/__fixtures__/mock.md")
      }
    });

    generatePluginFiles("fixture", ".playground/newDir", {
      "REPLACE_THIS": "TO_THIS"
    });

    assert(ufs.existsSync(".playground/newDir/TO_THIS"));

    const file = ufs.readFileSync(".playground/newDir/TO_THIS", "utf-8")
    expect(file).toContain("TO_THIS");
    expect(file).not.toContain("REPLACE_THIS");
  });

  it("moves gitignore in-place", () => {
    vol.fromNestedJSON({
      "fixture": {
        "gitignore": "after",
        ".gitignore": "before",
      }
    });

    generatePluginFiles("fixture", ".playground/newDir", {});

    const dirContents = ufs.readdirSync(".playground/newDir");
    expect(dirContents).toContain(".gitignore");
    expect(dirContents).not.toContain("gitignore");

    expect(ufs.readFileSync(".playground/newDir/.gitignore", "utf-8")).toEqual("after");
  });
});
