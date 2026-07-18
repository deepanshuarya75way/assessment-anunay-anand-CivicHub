export interface IHashtag {
  tag: string;
  usageCount: number;
  trendingScore: number;
  postCount: number;
  firstSeenAt: Date;
  lastUsedAt: Date;
}

export interface ISearchAnalytics {
  id?: string;
  term: string;
  typeSelected?: string;
  clickedUrl?: string;
  userId?: string;
  timestamp: Date;
}

export type SearchResultType = 'user' | 'community' | 'organization' | 'post' | 'hashtag' | 'issue' | 'department' | 'category';

export interface ISearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  url: string;
  score?: number;
}
