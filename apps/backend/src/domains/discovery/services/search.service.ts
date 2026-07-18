import { SearchProvider } from '../providers/search.provider';
import { MongoSearchProvider } from '../providers/mongo-search.provider';
import { SearchResultType, ISearchAnalytics } from '@civichub/shared';
import { SearchAnalyticsModel } from '../models/search-analytics.model';

export class SearchService {
  private static provider: SearchProvider = new MongoSearchProvider();

  // Dependency Injection could be used here to swap providers
  static setProvider(provider: SearchProvider) {
    this.provider = provider;
  }

  static async search(query: string, type?: SearchResultType | 'all', limit: number = 20) {
    return this.provider.search({ query, type, limit });
  }

  static async logAnalytics(data: ISearchAnalytics) {
    await SearchAnalyticsModel.create(data);
  }
}
