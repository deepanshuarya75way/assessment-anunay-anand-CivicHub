import { apiClient as api } from '../../../api/client';

export interface Attachment {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface Post {
  _id: string;
  author: {
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
  content: {
    text: string;
    categories: string[];
    hashtags: string[];
    mentions: string[];
  };
  attachments: Attachment[];
  visibility: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS';
  createdAt: string;
}

export interface FeedResponse {
  data: {
    posts: Post[];
    pageInfo: {
      hasNextPage: boolean;
      nextCursor: string | null;
    };
  };
}

export const CommunityService = {
  getFeed: async (limit: number = 20, cursor?: string): Promise<FeedResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor);
    
    const response = await api.get(`/community/feed?${params.toString()}`);
    return response.data;
  },

  createPost: async (data: { content: any; attachments: Attachment[]; visibility: string }) => {
    const response = await api.post('/community/posts', data);
    return response.data;
  },

  getUploadToken: async () => {
    const response = await api.post('/community/media/upload-token');
    return response.data.data;
  }
};
