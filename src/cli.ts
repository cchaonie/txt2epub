import path from 'path';

import minimist from 'minimist';

import generate from './generate';

const { sourceFile, targetFolder, targetName, coverPath, author } = minimist(
  process.argv.slice(2)
);

const cwd = process.cwd();

generate({
  inputFilePath: path.resolve(cwd, sourceFile),
  outputName: targetName,
  outputDir: path.resolve(cwd, targetFolder),
  coverPath,
  author,
})
  .then(() => 'Successful')
  .catch((e) => console.error('Failed:', e));
