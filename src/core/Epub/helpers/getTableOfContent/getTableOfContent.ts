import { PageType } from '../../../../parse/parseTxt/constants';
import { EpubOptions, PageContent } from '../../types';

const getTocChildren = (pages: PageContent[], startIndex: number) => {
  const result = [];
  for (let i = startIndex + 1; i < pages.length; i += 1) {
    const { type } = pages[i];
    if (type === PageType.Section) break;
    result.push(pages[i]);
  }
  return result.length > 0 ? result : undefined;
};

export default ({ lang, id, title, author, content }: EpubOptions) => {
  return {
    lang,
    id,
    title,
    author,
    tocTitle: title,
    items: content.reduce((a, c) => {
      let last;
      if (
        a.length > 0 &&
        (last = a[a.length - 1]).type === PageType.Section &&
        c.type !== PageType.Section
      ) {
        const children = last.children || [];
        children.push(c);
        last.children = children;
      } else {
        a.push(c);
      }
      return a;
    }, []),
  };
};
