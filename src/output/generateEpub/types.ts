import { PageType } from '../../parse/parseTxt/constants';
import { OutputOptions } from '../types';

export interface EpubPage {
  title: string;
  data: string;
  type: PageType;
  author?: string;
}

export type GenerateEpubOptions = Omit<OutputOptions, 'content'> & {
  title: string;
  author?: string;
  content: EpubPage[];
};
