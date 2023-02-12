import fs from 'fs/promises';

import chardet from 'chardet';
import iconv from 'iconv-lite';

import { parseTxt } from './parse';
import { transformToHtml } from './transform';
import { generateEpub } from './output';

import { GenerateOptions } from './types';

async function createFolder(folderPath: string) {
  await fs.mkdir(folderPath, { recursive: true });
}

async function generate({
  sourceFile,
  outputName,
  outputDir,
  coverPath,
  author,
}: GenerateOptions) {
  const fileContentBuffer = await fs.readFile(sourceFile);

  const encoding = await chardet.detectFile(sourceFile);

  const fileContent = iconv.decode(fileContentBuffer, encoding);

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
