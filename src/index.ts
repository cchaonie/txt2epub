import fs from 'fs/promises';
import path from 'path';
import _ from 'lodash';

const [, , sourceName, targetName, targetFolder] = process.argv;

const cwd = process.cwd();

const filePath = `${sourceName}.txt`;
const pageTemplatePath = './templates/page.html';

const fileOutPath = `${targetFolder}/${targetName}`;

const titlePattern = /^第\d*章/;

const fileContent = await fs.readFile(path.resolve(cwd, filePath), {
  encoding: 'utf-8',
});

const pageTemplate = await fs.readFile(path.resolve(cwd, pageTemplatePath), {
  encoding: 'utf-8',
});

const fileContentInLines = fileContent.split('\n').filter(l => !!l);

let currentTitle = '请输入标题';
let currentContent: string[] = [];

const pages: string[] = [];

async function parseContent() {
  _.each(fileContentInLines, line => {
    if (titlePattern.test(line)) {
      // now we should generate a new page
      const pageContent = pageTemplate
        .replace('{{title}}', currentTitle)
        .replace(
          '{{content}}',
          `<h2>${currentTitle}</h2>` + currentContent.join('\n')
        );

      pages.push(pageContent);

      currentContent = [];
      currentTitle = line;
    } else {
      currentContent.push(`<p>${line}</p>`);
    }
  });

  if (currentContent.length) {
    const pageContent = pageTemplate
      .replace('{{title}}', currentTitle)
      .replace(
        '{{content}}',
        `<h2>${currentTitle}</h2>` + currentContent.join('\n')
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
