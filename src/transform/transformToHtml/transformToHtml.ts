import { EpubPage } from '../../output';
import { Page } from '../../parse';
import { PageType } from '../../parse/parseTxt/constants';

export default (pages: Page[]): EpubPage[] =>
  pages.map(({ title, data, type }) => {
    switch (type) {
      case PageType.Section: {
        return {
          title,
          type: PageType.Section,
          data: `<h1>${title}</h1>`,
        };
      }
      case PageType.Chapter:
      default: {
        return {
          title,
          type: PageType.Chapter,
          data: `<h2>${title}</h2>${data
            .map((line) => `<p>${line}</p>`)
            .join('')}`,
        };
      }
    }
  });
