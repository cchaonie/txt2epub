import { PageType, PROLOGUE } from './constants';
import { Page } from './types';

export default (source: string) => {
  const sectionTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*[卷|集]/;
  const pageTitlePattern = /^第[\d|一|二|三|四|五|六|七|八|九|十|百]*章/;

  const fileContentInLines = source
    .split(/\r?\n/)
    .filter(l => !!l)
    .map(l => l.trim());

  const pages: Page[] = [];
  let pageData: string[] = [];
  let currentPageTitle = '';

  fileContentInLines.forEach(line => {
    if (sectionTitlePattern.test(line) || pageTitlePattern.test(line)) {
      // now we see a section or a new page, we should create a new page if `pageData` is not empty
      if (pageData.length) {
        pages.push({
          title: currentPageTitle || PROLOGUE,
          data: pageData,
          type: currentPageTitle ? PageType.Chapter : PageType.Other,
        });

        pageData = [];
      }

      if (sectionTitlePattern.test(line)) {
        // now we should generate a new section
        pages.push({
          title: line,
          data: [line],
          type: PageType.Section,
        });
      } else {
        currentPageTitle = line;
      }
    } else {
      pageData.push(line);
    }
  });

  // Once we add the last page title, we will not have the chance to create a new page for it
  if (pageData.length) {
    pages.push({
      title: currentPageTitle,
      data: pageData,
      type: PageType.Chapter,
    });
  }

  return pages;
};
