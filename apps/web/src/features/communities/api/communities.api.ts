import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../../../api/client';
import { ICommunity, CreateCommunityInput, UpdateCommunityInput } from '@civichub/shared';

// API Functions
export const getCommunityBySlug = async (slug: string): Promise<ICommunity> => {
  const { data } = await api.get(`/communities/${slug}`);
  return data.data;
};

export const createCommunity = async (payload: CreateCommunityInput): Promise<ICommunity> => {
  const { data } = await api.post('/communities', payload);
  return data.data;
};

export const updateCommunity = async (id: string, payload: UpdateCommunityInput): Promise<ICommunity> => {
  const { data } = await api.patch(`/communities/${id}`, payload);
  return data.data;
};

export const joinCommunity = async (id: string): Promise<{ message: string; status: string }> => {
  const { data } = await api.post(`/communities/${id}/join`);
  return data.data;
};

export const getDiscoverCommunities = async (type: 'trending' | 'newest' | 'suggested' = 'trending'): Promise<ICommunity[]> => {
  const { data } = await api.get(`/communities/discover?type=${type}`);
  return data.data;
};

// React Query Hooks
export const useCommunity = (slug: string) => {
  return useQuery({
    queryKey: ['community', slug],
    queryFn: () => getCommunityBySlug(slug),
    enabled: !!slug,
  });
};

export const useDiscoverCommunities = (type: 'trending' | 'newest' | 'suggested' = 'trending') => {
  return useQuery({
    queryKey: ['communities', 'discover', type],
    queryFn: () => getDiscoverCommunities(type),
  });
};

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCommunity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.setQueryData(['community', data.slug], data);
    },
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => joinCommunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] });
    },
  });
};
