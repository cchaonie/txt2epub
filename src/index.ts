import path from 'path';

import generate from './generate';

const [, , sourceFile, targetFolder, targetName] = process.argv;

const cwd = process.cwd();

generate({
  inputFilePath: path.resolve(cwd, sourceFile),
  outputName: targetName,
  outputDir: path.resolve(cwd, targetFolder),
})
  .then(() => 'Successful')
  .catch(e => console.error('Failed:', e));
