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

const updateCampaign = async (id: string, payload: Partial<Campaign>): Promise<Campaign> => {
  const { data } = await api.put(`/volunteer/campaigns/${id}`, payload);
  return data;
};

const updateCampaignStatus = async (id: string, status: string): Promise<Campaign> => {
  const { data } = await api.patch(`/volunteer/campaigns/${id}/status`, { status });
  return data;
};

const deleteCampaign = async (id: string): Promise<void> => {
  await api.delete(`/volunteer/campaigns/${id}`);
};

// Tasks
const getCampaignTasks = async (campaignId: string): Promise<Task[]> => {
  const { data } = await api.get(`/volunteer/campaigns/${campaignId}/tasks`);
  return data;
};

const createCampaignTask = async (campaignId: string, payload: Partial<Task>): Promise<Task> => {
  const { data } = await api.post(`/volunteer/campaigns/${campaignId}/tasks`, payload);
  return data;
};

const assignTask = async (taskId: string): Promise<Task> => {
  const { data } = await api.post(`/volunteer/tasks/${taskId}/assign`);
  return data;
};

const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/volunteer/tasks/${taskId}`);
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

export const useUpdateCampaign = (campaignId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Campaign>) => updateCampaign(campaignId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(['volunteerCampaign', campaignId], data);
      queryClient.invalidateQueries({ queryKey: ['volunteerCampaigns'] });
    },
  });
};

export const useUpdateCampaignStatus = (campaignId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => updateCampaignStatus(campaignId, status),
    onSuccess: (data) => {
      queryClient.setQueryData(['volunteerCampaign', campaignId], data);
      queryClient.invalidateQueries({ queryKey: ['volunteerCampaigns'] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCampaign,
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

export const useCreateCampaignTask = (campaignId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Task>) => createCampaignTask(campaignId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaignTasks', campaignId] });
    },
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

export const useDeleteTask = (campaignId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
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
