import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  connect: (token: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  socket: Socket | null;
  sendMessage: (message: string) => void;
}

const WEBSOCKET_URL = "http://localhost:8080";

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connect = (token: string) => {
    if (socketRef.current) return;

    const socket = io(WEBSOCKET_URL, { query: { token } });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (error) =>
      console.error("Socket error:", error)
    );

    // Example of handling custom events
    socket.on("message", (data) => {
      console.log("Received message:", data);
    });

    socketRef.current = socket;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("message", message);
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        socket: socketRef.current,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
