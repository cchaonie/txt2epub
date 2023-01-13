import { PageType } from '../../parse/parseTxt/constants';
import { OutputOptions } from '../types';

export interface EpubPage {
  title?: string;
  author?: string;
  data: string;
  excludeFromToc?: boolean;
  beforeToc?: boolean;
  filename?: string;
  type: PageType;
}

export type GenerateEpubOptions = Omit<OutputOptions, 'content'> & {
  title: string;
  author?: string;
  content: EpubPage[];
};
