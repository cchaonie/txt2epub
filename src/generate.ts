import fs from 'fs/promises';
import path from 'path';

import _ from 'lodash';

import { GenerateOptions } from './types';

async function parseContent(filePath: string, outputName: string) {
  const pages: string[] = [];

  const moduleDirPath = path.dirname(__filename);
  const pageTemplatePath = path.resolve(moduleDirPath, '../templates/page.html');
  const sectionTemplatePath = path.resolve(
    moduleDirPath,
    '../templates/section.html'
  );

  const sectionTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*[卷|集]/;
  const pageTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*章/;

  const fileContent = await fs.readFile(filePath, {
    encoding: 'utf-8',
  });

  const pageTemplate = await fs.readFile(pageTemplatePath, {
    encoding: 'utf-8',
  });

  const sectionTemplate = await fs.readFile(sectionTemplatePath, {
    encoding: 'utf-8',
  });

  let currentTitle = outputName; // the initial title should be the name of the book
  let currentContent: string[] = [];

  const fileContentInLines = fileContent
    .split(/\r?\n/)
    .filter(l => !!l)
    .map(l => l.trim());

  _.each(fileContentInLines, line => {
    if (sectionTitlePattern.test(line) || pageTitlePattern.test(line)) {
      // now we see a section or a new page, we should create a new page if `currentContent` is not empty
      if (currentContent.length) {
        const pageContent = pageTemplate
          .replace('{{title}}', currentTitle)
          .replace(
            '{{content}}',
            currentTitle === outputName
              ? `<h1>${currentTitle}</h1>`
              : `<h2>${currentTitle}</h2>` + currentContent.join('')
          );

        pages.push(pageContent);

        currentContent = [];
      }

      if (sectionTitlePattern.test(line)) {
        // now we should generate a new section
        const sectionContent = sectionTemplate
          .replace('{{title}}', line)
          .replace('{{section}}', `<h1>${line}</h1>`);

        pages.push(sectionContent);
      } else {
        currentTitle = line;
      }
    } else {
      currentContent.push(`<p>${line}</p>`);
    }
  });

  // Once we add the last page title, we will not have the chance to create a new page for it
  if (currentContent.length) {
    const pageContent = pageTemplate
      .replace('{{title}}', currentTitle)
      .replace(
        '{{content}}',
        `<h2>${currentTitle}</h2>` + currentContent.join('')
      );

    pages.push(pageContent);
  }

  return pages;
}

async function createFolder(folderPath: string) {
  await fs.mkdir(folderPath, { recursive: true });
}

async function generatePage(outputDir: string, pages: string[]) {
  for (let i = 0; i < pages.length; i += 1) {
    await writeToDisk(outputDir, pages[i], i);
  }
}

async function writeToDisk(outputDir: string, content: string, index: number) {
  const fileHandle = await fs.open(
    path.resolve(outputDir, `page_${index}.html`),
    'w'
  );
  await fileHandle.writeFile(content);
  await fileHandle.close();
}

async function generate({
  inputFilePath,
  outputName,
  outputDir,
}: GenerateOptions) {
  const pages = await parseContent(inputFilePath, outputName);
  console.log('Parse content successfully');
  const targetDir = path.resolve(outputDir, outputName);
  await createFolder(targetDir);
  console.log('Create target directory successfully');
  await generatePage(targetDir, pages);
}

export default generate;
