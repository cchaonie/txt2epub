import fs from 'fs/promises';
import path from 'path';
import _ from 'lodash';

const cwd = process.cwd();

const filePath = './inputs/epubs/text';

const fileOutPath = './outputs/epubs/万族之劫/text';

const files = await fs.readdir(path.resolve(cwd, filePath));

_.each(files, async (file, i) => {
  const data = await fs.readFile(path.resolve(cwd, filePath, file), {
    encoding: 'utf-8',
  });

  const titleReg = /<title>(.*)<\/title>/;

  const result = titleReg.exec(data);

  if (result) {
    const title = result[1];

    const content = data.replace(/(<body .*>)/, (_, p1) => {
      return `${p1}<h1 class="chapter_title">${title}</h1>`;
    });
    const fileHandle = await fs.open(path.resolve(cwd, fileOutPath, file), 'w');
    fileHandle.writeFile(content);
  }
});
