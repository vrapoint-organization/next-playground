import { createSocket } from "dgram";
import React, {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { compressData } from "./utils";
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";

interface SocketContextType {
  connect: (token: string) => void;
  disconnect: () => void;
  isConnected: boolean;
  socket: MutableRefObject<Client | null>;
}

// server/websocket_test 참조
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
  const socketRef = useRef<Client | null>(null);

  const connect = (token: string) => {
    if (socketRef.current) return;
    const socket = new SockJS(ENV_PUBLIC.NEXT_PUBLIC_WEBSOCKET_URL);
    const stompClient = Stomp.over(() => socket);

    stompClient.connect(
      {
        Authorization: token,
      },
      () => {
        setIsConnected(true);
      },
      (err) => {
        console.log("websocket Error, ", err);
        setIsConnected(false);
        if (err.body === "유효하지 않은 권한입니다.") {
          alert("subscribe 에러 발생");
        }
      },
      () => {
        setIsConnected(false);
        console.log("websocket Closed");
      }
    );

    stompClient.activate();
    socketRef.current = stompClient;

    return stompClient;
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.deactivate();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    return disconnect;
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        socket: socketRef,
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
