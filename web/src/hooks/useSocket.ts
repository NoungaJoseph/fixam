import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../services/api';

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      setConnected(false);
      return;
    }

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    setSocket(s);
    s.on('connect', () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    return () => {
      s.disconnect();
      setConnected(false);
      setSocket(null);
    };
  }, [token]);

  const emit = useCallback(
    (event: string, payload?: unknown) => {
      socket?.emit(event, payload);
    },
    [socket]
  );

  const subscribe = useCallback(
    (event: string, handler: (...args: unknown[]) => void) => {
      if (!socket) return () => {};
      socket.on(event, handler as (...args: unknown[]) => void);
      return () => socket.off(event, handler as (...args: unknown[]) => void);
    },
    [socket]
  );

  return { socket, connected, emit, subscribe };
}
