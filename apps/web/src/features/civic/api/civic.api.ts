import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Issue, Category, Department } from '@civichub/shared';
import { useAuthStore } from '../../../stores/auth.store';

const API_URL = 'http://localhost:3000/api/v1/civic';

// API instance with auth
const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Hooks
export const useIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data } = await api.get<Issue[]>('/issues');
      return data;
    }
  });
};

export const useIssueDetails = (id: string) => {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const { data } = await api.get<Issue>(`/issues/${id}`);
      return data;
    },
    enabled: !!id
  });
};

export const useIssueFeed = (id: string) => {
  return useQuery({
    queryKey: ['issue', id, 'feed'],
    queryFn: async () => {
      const { data } = await api.get<any[]>(`/issues/${id}/feed`);
      return data;
    },
    enabled: !!id
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    }
  });
};

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await api.get<Department[]>('/departments');
      return data;
    }
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueData: Partial<Issue>) => {
      const { data } = await api.post<Issue>('/issues', issueData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    }
  });
};

export const useWatchIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: string) => {
      const { data } = await api.post(`/issues/${issueId}/watch`);
      return data;
    },
    onSuccess: (_, issueId) => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
    }
  });
};

export const useUnwatchIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: string) => {
      const { data } = await api.post(`/issues/${issueId}/unwatch`);
      return data;
    },
    onSuccess: (_, issueId) => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
    }
  });
};

export const useSupportIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: string) => {
      const { data } = await api.post(`/issues/${issueId}/support`);
      return data;
    },
    onSuccess: (_, issueId) => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
    }
  });
};

export const useUnsupportIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (issueId: string) => {
      const { data } = await api.post(`/issues/${issueId}/unsupport`);
      return data;
    },
    onSuccess: (_, issueId) => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
    }
  });
};

export const useAddCitizenUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ issueId, text }: { issueId: string, text: string }) => {
      const { data } = await api.post(`/issues/${issueId}/updates`, { text });
      return data;
    },
    onSuccess: (_, { issueId }) => {
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      queryClient.invalidateQueries({ queryKey: ['issue', issueId, 'feed'] });
    }
  });
};

export const useMarkAsDuplicate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ duplicateId, primaryId, reason }: { duplicateId: string, primaryId: string, reason?: string }) => {
      const { data } = await api.post(`/issues/${duplicateId}/duplicate`, { primaryId, reason });
      return data;
    },
    onSuccess: (_, { duplicateId, primaryId }) => {
      queryClient.invalidateQueries({ queryKey: ['issue', duplicateId] });
      queryClient.invalidateQueries({ queryKey: ['issue', primaryId] });
    }
  });
};
