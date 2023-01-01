import fs from 'fs/promises';
import path from 'path';
import _ from 'lodash';

const [, , sourceName, targetName, targetFolder] = process.argv;

const cwd = process.cwd();

const filePath = `${sourceName}.txt`;
const fileOutPath = `${targetFolder}/${targetName}`;

const pageTemplatePath = './templates/page.html';
const sectionTemplatePath = './templates/section.html';

const pageTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*章/;
const sectionTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*[卷|集]/;

const fileContent = await fs.readFile(path.resolve(cwd, filePath), {
  encoding: 'utf-8',
});

const pageTemplate = await fs.readFile(path.resolve(cwd, pageTemplatePath), {
  encoding: 'utf-8',
});

const sectionTemplate = await fs.readFile(
  path.resolve(cwd, sectionTemplatePath),
  {
    encoding: 'utf-8',
  }
);

const pages: string[] = [];

async function parseContent() {
  let currentTitle = targetName; // the initial title should be the name of the book
  let currentContent: string[] = [];

  const fileContentInLines = fileContent
    .split(/\r?\n/)
    .filter(l => !!l)
    .map(l => l.trim());

  console.log(fileContentInLines);
  _.each(fileContentInLines, line => {
    if (sectionTitlePattern.test(line) || pageTitlePattern.test(line)) {
      // now we see a section or a new page, we should create a new page if `currentContent` is not empty
      if (currentContent.length) {
        const pageContent = pageTemplate
          .replace('{{title}}', currentTitle)
          .replace(
            '{{content}}',
            currentTitle === targetName
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
}

async function createFolder() {
  await fs.mkdir(path.resolve(cwd, fileOutPath), { recursive: true });
}

async function generatePage() {
  for (let i = 0; i < pages.length; i += 1) {
    await writeToDisk(pages[i], i);
  }
}

async function writeToDisk(content: string, index: number) {
  const fileHandle = await fs.open(
    path.resolve(cwd, fileOutPath, `page_${index}.html`),
    'w'
  );
  await fileHandle.writeFile(content);
  await fileHandle.close();
}

await createFolder();

await parseContent();

await generatePage();
