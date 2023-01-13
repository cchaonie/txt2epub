export interface Options {
  output: string;
  title: string;
  author?: string[];
  content: any[];
  images?: any[];
  cover?: string;
  fonts?: string[];
  css?: string;
}
export type EpubOptions = Options & {
  id?: string;
  uuid?: string;
  docHeader?: string;
  tempDir?: string;
  _coverMediaType?: string;
  _coverExtension?: string;
};
