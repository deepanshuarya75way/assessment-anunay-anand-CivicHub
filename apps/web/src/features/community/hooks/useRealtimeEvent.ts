import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../../../stores/auth.store';


let socket: Socket | null = null;

export const useRealtimeEvent = <T>(eventName: string, callback: (data: T) => void, roomId?: string) => {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    if (!socket) {
      const serverUrl = 'http://localhost:5000'; // Replace with env API URL
      socket = io(serverUrl, {
        auth: { token: accessToken },
      });
      
      socket.on('connect', () => {
        console.log('Connected to realtime server');
      });
    }

    if (roomId) {
      socket.emit('join_room', roomId);
    }

    socket.on(eventName, callback);

    return () => {
      if (socket) {
        socket.off(eventName, callback);
        if (roomId) {
          socket.emit('leave_room', roomId);
        }
      }
    };
  }, [accessToken, eventName, callback, roomId]);
};
