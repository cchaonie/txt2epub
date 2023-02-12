import { Epub } from '../../core';

import { GenerateEpubOptions } from './types';

export default async function generateEpub({
  title,
  author,
  content,
  outputDir,
  coverPath,
  outputName,
}: GenerateEpubOptions) {
  const options = {
    title,
    lang: 'zh',
    cover: coverPath,
    tocTitle: title,
    appendChapterTitles: false,
    author,
    content,
    output: `${outputDir}/${outputName}.epub`,
    publisher: '',
  };

  try {
    const epub = new Epub(options);
    await epub.render();
    console.log('Ebook Generated Successfully!');
  } catch (error) {
    console.error('Failed to generate Ebook because of ', error);
    throw error;
  }
}
