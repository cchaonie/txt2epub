import { PageType } from '../../parse/parseTxt/constants';
import { OutputOptions } from '../types';

export interface EpubPage {
  title: string;
  data: string;
  type: PageType;
}

export type GenerateEpubOptions = Omit<OutputOptions, 'content'> & {
  title: string;
  content: EpubPage[];
  author?: string;
  coverPath?: string;
};
