import { useSocket } from "@/src/scripts/SocketProvider";
import Link from "next/link";
import { useRef, useState } from "react";

const getUserId = () => Math.round((Math.random() * 100) / 10) + 1;

const SignInPage: React.FC = () => {
  const { messages, connect, isConnected, sendMessage } = useSocket();
  const userNameRef = useRef<string>("User" + getUserId());

  const handleSignIn = async () => {
    const sessionUserName = userNameRef.current;
    connect(sessionUserName);
  };

  return (
    <div>
      <Link href="/ws2">WS2</Link>
      <Link href="/ws-canvas">ws canvas</Link>
      <button onClick={handleSignIn}>Sign In</button>
      {isConnected ? (
        <div>
          Connected to WebSocket
          <button
            onClick={() => {
              sendMessage("User" + getUserId());
            }}
          >
            send message
          </button>
          <ul>
            {messages.map((message, index) => (
              <li key={`message-${index}`}>
                [{index + 1}] {message}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Not Connected</p>
      )}
    </div>
  );
};

export default SignInPage;
