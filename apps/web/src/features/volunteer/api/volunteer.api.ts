import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../../../api/client';
import { Campaign, Task, VolunteerProfile, Registration } from '@civichub/shared';

// --- API Functions ---

// Profiles
const getProfile = async (userId: string): Promise<VolunteerProfile> => {
  const { data } = await api.get(`/volunteer/profiles/${userId}`);
  return data;
};

const updateProfile = async (userId: string, payload: Partial<VolunteerProfile>): Promise<VolunteerProfile> => {
  const { data } = await api.put(`/volunteer/profiles/${userId}`, payload);
  return data;
};

// Campaigns
const getCampaigns = async (): Promise<Campaign[]> => {
  const { data } = await api.get('/volunteer/campaigns');
  return data;
};

const getCampaign = async (id: string): Promise<Campaign> => {
  const { data } = await api.get(`/volunteer/campaigns/${id}`);
  return data;
};

const createCampaign = async (payload: Partial<Campaign>): Promise<Campaign> => {
  const { data } = await api.post('/volunteer/campaigns', payload);
  return data;
};

// Tasks
const getCampaignTasks = async (campaignId: string): Promise<Task[]> => {
  const { data } = await api.get(`/volunteer/campaigns/${campaignId}/tasks`);
  return data;
};

const assignTask = async (taskId: string): Promise<Task> => {
  const { data } = await api.post(`/volunteer/tasks/${taskId}/assign`);
  return data;
};

// Registrations
const getCampaignRegistrations = async (campaignId: string): Promise<Registration[]> => {
  const { data } = await api.get(`/volunteer/campaigns/${campaignId}/registrations`);
  return data;
};

const joinCampaign = async (campaignId: string): Promise<Registration> => {
  const { data } = await api.post(`/volunteer/campaigns/${campaignId}/join`);
  return data;
};

// --- React Query Hooks ---

// Profiles
export const useVolunteerProfile = (userId: string) => {
  return useQuery({
    queryKey: ['volunteerProfile', userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  });
};

export const useUpdateVolunteerProfile = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<VolunteerProfile>) => updateProfile(userId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['volunteerProfile', userId], data);
    },
  });
};

// Campaigns
export const useCampaigns = () => {
  return useQuery({
    queryKey: ['volunteerCampaigns'],
    queryFn: getCampaigns,
  });
};

export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: ['volunteerCampaign', id],
    queryFn: () => getCampaign(id),
    enabled: !!id,
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['volunteerCampaigns'] });
    },
  });
};

// Tasks
export const useCampaignTasks = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaignTasks', campaignId],
    queryFn: () => getCampaignTasks(campaignId),
    enabled: !!campaignId,
  });
};

export const useAssignTask = (campaignId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignTasks', campaignId] });
    },
  });
};

// Registrations
export const useCampaignRegistrations = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaignRegistrations', campaignId],
    queryFn: () => getCampaignRegistrations(campaignId),
    enabled: !!campaignId,
  });
};

export const useJoinCampaign = (campaignId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => joinCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignRegistrations', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['volunteerCampaign', campaignId] });
    },
  });
};
