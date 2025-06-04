import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://latest-skillswap-production.up.railway.app"; // Update to your backend URL

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    return () => { socketRef.current?.disconnect(); };
  }, []);

  return socketRef.current;
};