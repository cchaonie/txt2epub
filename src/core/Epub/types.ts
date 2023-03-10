import { EpubPage } from '../../output';

export type PageContent = Omit<EpubPage, 'author'> & {
  filePath: string;
  href: string;
  id: string;
  beforeToc?: boolean;
};

export interface Options {
  output: string;
  title: string;
  lang?: string;
  author?: string;
  content: EpubPage[];
  cover?: string;
  fonts?: string[];
  css?: string;
  customOpfTemplatePath?: string;
  customNcxTocTemplatePath?: string;
  customHtmlTocTemplatePath?: string;
  version?: number;
}
export type EpubOptions = Omit<Options, 'content'> & {
  content: PageContent[];
  appendChapterTitles?: boolean;
  id?: string;
  uuid?: string;
  docHeader?: string;
  tempDir?: string;
  _coverMediaType?: string;
  _coverExtension?: string;
};
