import { PageType } from './constants';

export interface Page {
  title: string;
  data: string[];
  type: PageType;
}
