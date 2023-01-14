#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const generate = require('../lib/index');

const [, , sourceFile, targetFolder, targetName, coverPath, author] = process.argv;

const cwd = process.cwd();

generate({
  inputFilePath: path.resolve(cwd, sourceFile),
  outputName: targetName,
  outputDir: path.resolve(cwd, targetFolder),
  coverPath,
  author
})
  .then(() => 'Successful')
  .catch(e => console.error('Failed:', e));
