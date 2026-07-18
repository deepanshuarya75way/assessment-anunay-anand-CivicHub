import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../../../api/client';
import { IProfile, ProfileUpdateInput } from '@civichub/shared';

// API Functions
const getProfileByUsername = async (username: string): Promise<IProfile> => {
  const { data } = await api.get(`/identity/profiles/${username}`);
  return data.data;
};

const getMyProfile = async (): Promise<IProfile> => {
  const { data } = await api.get('/identity/me/profile');
  return data.data;
};

const updateMyProfile = async (payload: ProfileUpdateInput): Promise<IProfile> => {
  const { data } = await api.patch('/identity/me/profile', payload);
  return data.data;
};

const getUserActivity = async (username: string): Promise<any[]> => {
  const { data } = await api.get(`/identity/profiles/${username}/activity`);
  return data.data;
};

// React Query Hooks
export const useProfile = (username: string) => {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => getProfileByUsername(username),
    enabled: !!username,
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['myProfile'], data);
      queryClient.setQueryData(['profile', data.username], data);
    },
  });
};

export const useUserActivity = (username: string) => {
  return useQuery({
    queryKey: ['userActivity', username],
    queryFn: () => getUserActivity(username),
    enabled: !!username,
  });
};
