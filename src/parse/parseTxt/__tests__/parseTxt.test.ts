import parseTxt from '..';

import { fileContent } from '../../../mocks';

describe('parseTxt', () => {
  it('should return correct content  ', () => {
    expect(parseTxt(fileContent)).toEqual([
      { data: ['HelloWorld'], title: '前言', type: 2 },
      { data: ['第一卷 Hello'], title: '第一卷 Hello', type: 0 },
      { data: ['hhhhh'], title: '第一章 h', type: 1 },
      { data: ['eeeee'], title: '第二章 e', type: 1 },
      { data: ['l1l1l1l1l1'], title: '第三章 l1', type: 1 },
      { data: ['l2l2l2l2l2'], title: '第四章 l2', type: 1 },
      { data: ['ooooo'], title: '第五章 o', type: 1 },
      { data: ['第二卷 World'], title: '第二卷 World', type: 0 },
      { data: ['wwwww'], title: '第一章 w', type: 1 },
      { data: ['ooooo'], title: '第二章 o', type: 1 },
      {
        data: ['rrrrr'],
        title: '第三章 r',
        type: 1,
      },
      {
        data: ['lllll'],
        title: '第四章 l',
        type: 1,
      },
      {
        data: ['ddddd'],
        title: '第五章 d',
        type: 1,
      },
    ]);
  });
});
