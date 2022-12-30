import fs from 'fs/promises';
import path from 'path';
import _ from 'lodash';

const cwd = process.cwd();

const filePath = './inputs/金鳞岂是池中物.txt';
const pageTemplatePath = './templates/page.html';

const fileOutPath = './outputs/epubs/金鳞';

const titlePattern = /^第\d*章/;

const fileContent = await fs.readFile(path.resolve(cwd, filePath), {
  encoding: 'utf-8',
});

const pageTemplate = await fs.readFile(path.resolve(cwd, pageTemplatePath), {
  encoding: 'utf-8',
});

const fileContentInLines = fileContent.split('\n').filter(l => !!l);

// console.log(fileContentInLines);

let currentTitle = '请输入标题';
let currentContent = [];

const pages = [];

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

await parseContent();

await generatePage();
