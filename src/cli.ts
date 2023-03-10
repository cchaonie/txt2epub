import path from 'path';

import minimist from 'minimist';

import generate from './generate';

const { sourceFile, outputDir, title, outputName, coverPath, author } =
  minimist(process.argv.slice(2));

const cwd = process.cwd();

generate({
  sourceFile: path.resolve(cwd, sourceFile),
  title,
  outputDir: path.resolve(cwd, outputDir),
  outputName,
  coverPath,
  author,
})
  .then(() => 'Successful')
  .catch((e) => console.error('Failed:', e));
