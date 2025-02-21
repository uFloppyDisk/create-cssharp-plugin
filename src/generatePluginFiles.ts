import path from "path";
import fs from "fs";

const ignoreFileNames = ['bin', 'obj'];

export function transformFileName(name: string, transforms: Transforms): string {
  const parsedFile = path.parse(name);
  return (transforms[parsedFile.name] ?? parsedFile.name) + parsedFile.ext;
}

export function transformFileContents(content: string, transforms?: Transforms): string {
  if (!transforms) return content;

  for (const [key, value] of Object.entries(transforms)) {
    content = content.replaceAll(key, value);
  }

  return content;
}

// Source:
// https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/scripts/init.js
function renameOrOverwriteIfExistsGitignore(targetPath: string) {
  const gitignoreExists = fs.existsSync(path.join(targetPath, 'gitignore'));
  if (!gitignoreExists) return;

  const dotgitignoreExists = fs.existsSync(path.join(targetPath, '.gitignore'));
  if (dotgitignoreExists) {
    console.log("Overwriting");
    fs.unlinkSync(path.join(targetPath, '.gitignore'));
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  fs.renameSync(
    path.join(targetPath, 'gitignore'),
    path.join(targetPath, '.gitignore'),
  );
}

type Transforms = Record<string, string>;
function generatePluginFiles(templatePath: string, targetPath: string, transforms?: Transforms) {
  const templateContentNames = fs.readdirSync(templatePath)
    .filter(name => !ignoreFileNames.includes(name));

  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);

  for (const name of templateContentNames) {
    const originPath = path.join(templatePath, name);
    const destPath = path.join(targetPath, name);

    const stats = fs.statSync(originPath);
    if (stats.isFile()) {
      const fileContent = transformFileContents(
        fs.readFileSync(originPath, 'utf8'),
        transforms
      );
      const transformedDestPath = path.join(
        targetPath,
        !!transforms ? transformFileName(name, transforms) : name
      );

      fs.writeFileSync(transformedDestPath, fileContent);
      continue;
    }

    fs.mkdirSync(destPath);
    generatePluginFiles(originPath, destPath, transforms);
  }

  renameOrOverwriteIfExistsGitignore(targetPath);
}

export default generatePluginFiles;
