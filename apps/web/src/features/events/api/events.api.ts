import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient as api } from '../../../api/client';
import { Event, Attendance, EventStatus, ScheduleItem, Announcement } from '@civichub/shared';

// Event Hooks
export const useEvents = (filters: any = {}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const response = await api.get('/events/discover', { params: filters });
      return response.data as Event[];
    },
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data as Event;
    },
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Event>) => {
      const response = await api.post('/events', data);
      return response.data as Event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: EventStatus }) => {
      const response = await api.patch(`/events/${id}/status`, { status });
      return response.data as Event;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

// Embedded items
export const useAddScheduleItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, scheduleItem }: { eventId: string; scheduleItem: Omit<ScheduleItem, 'id'> }) => {
      const response = await api.post(`/events/${eventId}/schedules`, scheduleItem);
      return response.data as Event;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
    },
  });
};

export const useAddAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, announcement }: { eventId: string; announcement: Omit<Announcement, 'id' | 'postedBy' | 'postedAt'> }) => {
      const response = await api.post(`/events/${eventId}/announcements`, announcement);
      return response.data as Event;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.eventId] });
    },
  });
};

// Attendance Hooks
export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.post(`/events/${eventId}/register`);
      return response.data as Attendance;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['attendance', eventId] });
    },
  });
};

export const useCancelRegistration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await api.post(`/events/${eventId}/cancel`);
      return response.data as Attendance;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['attendance', eventId] });
    },
  });
};

// Check-in
export const useProcessCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, userId, provider, data }: { eventId: string; userId: string; provider: string; data: any }) => {
      const response = await api.post(`/events/${eventId}/checkin`, { userId, provider, data });
      return response.data as Attendance;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', variables.eventId] });
    },
  });
};
