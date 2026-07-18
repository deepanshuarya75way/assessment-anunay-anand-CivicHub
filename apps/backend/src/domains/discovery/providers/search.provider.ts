import { ISearchResult, SearchResultType } from '@civichub/shared';

export interface SearchOptions {
  query: string;
  type?: SearchResultType | 'all';
  limit?: number;
  skip?: number;
}

export interface SearchProvider {
  search(options: SearchOptions): Promise<ISearchResult[]>;
}
