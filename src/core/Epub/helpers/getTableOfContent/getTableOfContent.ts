import { PageType } from '../../../../parse/parseTxt/constants';
import { EpubOptions } from '../../types';

export default ({ lang, id, title, author, content }: EpubOptions) => {
  return {
    lang,
    id,
    title,
    author,
    tocTitle: '目录',
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
