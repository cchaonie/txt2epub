import generate from '..';
import fs from 'fs/promises';

import { generateEpub } from '../output';
import { fileContent } from '../mocks';

jest.mock('fs/promises', () => ({
  mkdir: jest.fn(),
  readFile: jest.fn(),
}));

jest.mock('../output', () => ({
  generateEpub: jest.fn(),
}));

describe('generate', () => {
  it('should generate epub file', async () => {
    (fs.readFile as jest.Mock).mockResolvedValue(fileContent);

    const defaultOptions = {
      inputFilePath: './hello.txt',
      outputDir: 'output',
      outputName: 'HELLO',
    };

    await generate(defaultOptions);

    expect(fs.mkdir).toBeCalledWith(defaultOptions.outputDir, {
      recursive: true,
    });

    expect(generateEpub).toBeCalledWith({
      content: [
        { data: '<h2>前言</h2><p>HelloWorld</p>', title: '前言', type: 1 },
        { data: '<h1>第一卷 Hello</h1>', title: '第一卷 Hello', type: 0 },
        { data: '<h2>第一章 h</h2><p>hhhhh</p>', title: '第一章 h', type: 1 },
        { data: '<h2>第二章 e</h2><p>eeeee</p>', title: '第二章 e', type: 1 },
        {
          data: '<h2>第三章 l1</h2><p>l1l1l1l1l1</p>',
          title: '第三章 l1',
          type: 1,
        },
        {
          data: '<h2>第四章 l2</h2><p>l2l2l2l2l2</p>',
          title: '第四章 l2',
          type: 1,
        },
        { data: '<h2>第五章 o</h2><p>ooooo</p>', title: '第五章 o', type: 1 },
        { data: '<h1>第二卷 World</h1>', title: '第二卷 World', type: 0 },
        { data: '<h2>第一章 w</h2><p>wwwww</p>', title: '第一章 w', type: 1 },
        { data: '<h2>第二章 o</h2><p>ooooo</p>', title: '第二章 o', type: 1 },
        { data: '<h2>第三章 r</h2><p>rrrrr</p>', title: '第三章 r', type: 1 },
        { data: '<h2>第四章 l</h2><p>lllll</p>', title: '第四章 l', type: 1 },
        { data: '<h2>第五章 d</h2><p>ddddd</p>', title: '第五章 d', type: 1 },
      ],
      outputDir: 'output',
      title: 'HELLO',
    });
  });
});
