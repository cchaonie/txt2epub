import { OutputOptions } from '../types';

export interface EpubPage {
  title?: string;
  author?: string;
  data: string;
  excludeFromToc?: boolean;
  beforeToc?: boolean;
  filename?: string;
}

export type GenerateEpubOptions = Omit<OutputOptions, 'content'> & {
  title: string;
  author?: string;
  content: EpubPage[];
};
