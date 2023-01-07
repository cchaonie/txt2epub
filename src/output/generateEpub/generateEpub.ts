import Epub from 'epub-gen';

import { GenerateEpubOptions } from './types';

export default function generateEpub({
  title,
  author,
  content,
  outputDir,
}: GenerateEpubOptions) {
  const options = {
    title,
    lang: 'zh',
    cover: '',
    tocTitle: title,
    appendChapterTitles: false,
    author,
    content,
    output: `${outputDir}/${title}.epub`,
    publisher: '',
    verbose: true,
  };
  new Epub(options).promise.then(
    () => console.log('Ebook Generated Successfully!'),
    err => console.error('Failed to generate Ebook because of ', err)
  );
}
