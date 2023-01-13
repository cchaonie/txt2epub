export interface Options {
  output: string;
  title: string;
  lang?: string;
  author?: string[];
  content: any[];
  images?: any[];
  cover?: string;
  fonts?: string[];
  css?: string;
  verbose?: boolean;
  customOpfTemplatePath?: string;
  customNcxTocTemplatePath?: string;
  customHtmlTocTemplatePath?: string;
  version?: number;
}
export type EpubOptions = Options & {
  appendChapterTitles?: boolean;
  id?: string;
  uuid?: string;
  docHeader?: string;
  tempDir?: string;
  _coverMediaType?: string;
  _coverExtension?: string;
};
