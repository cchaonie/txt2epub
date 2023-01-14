import fs from 'fs/promises';

import { parseTxt } from './parse';
import { transformToHtml } from './transform';
import { generateEpub } from './output';

import { GenerateOptions } from './types';

async function createFolder(folderPath: string) {
  await fs.mkdir(folderPath, { recursive: true });
}

async function generate({
  inputFilePath,
  outputName,
  outputDir,
  coverPath,
  author,
}: GenerateOptions) {
  const fileContent = await fs.readFile(inputFilePath, {
    encoding: 'utf-8',
  });
  const pages = parseTxt(fileContent);
  console.log('Parse content successfully');

  const epubPages = transformToHtml(pages);

  await createFolder(outputDir);
  console.log('Create target directory successfully');

  await generateEpub({
    outputDir: outputDir,
    content: epubPages,
    title: outputName,
    coverPath,
    author,
  });
}

export default generate;
