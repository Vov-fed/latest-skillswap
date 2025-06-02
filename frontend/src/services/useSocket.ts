import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Update to your backend URL

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  return socketRef.current;
};