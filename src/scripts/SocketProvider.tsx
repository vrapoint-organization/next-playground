import { createSocket } from "dgram";
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
  sendMousePosition: (x: number, y: number) => void;
  messages: string[];
  mousePositions: { name: string; x: number; y: number }[];
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

type User = {
  name: string;
  x: number;
  y: number;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const roomDataRef = useRef<any>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [mousePositions, setMousePositions] = useState<User[]>([]);

  const connect = (userName: string) => {
    if (socketRef.current) return;

    const socket = io(WEBSOCKET_URL, { query: { userName } });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("reply", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("connect_error", (error) =>
      console.error("Socket error:", error)
    );

    // Example of handling custom events
    socket.on("message", (data) => {
      console.log("Received message:", data);
    });

    socket.on("mousePositions", (data) => {
      console.log("Received mousePosition:", data);
      setMousePositions(data);
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

  const sendMousePosition = (x: number, y: number) => {
    if (socketRef.current) {
      socketRef.current.emit("mousePosition", { x, y });
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
        messages,
        sendMousePosition,
        mousePositions,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

/*

노드 서버 패키지
"cors": "^2.8.5",
"express": "^4.19.2",
"socket.io": "^4.7.5",
"ws": "^8.18.0"

// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create an Express application
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Create a Socket.IO server and configure CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow only GET and POST requests
  },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for messages from the client
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Send a reply back to the client
    socket.emit('reply', `You said: ${message}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



 */
