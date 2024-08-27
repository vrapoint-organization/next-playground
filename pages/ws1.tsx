import { useSocket } from "@/src/scripts/SocketProvider";
import Link from "next/link";
import { useState } from "react";

const SignInPage: React.FC = () => {
  const { connect, isConnected } = useSocket();
  const [token, setToken] = useState("");

  const handleSignIn = async () => {
    // Replace this with your actual sign-in logic
    const fetchedToken = "example-token"; // Simulate token fetching

    setToken(fetchedToken);
    connect(fetchedToken); // Establish Socket.IO connection with token
  };

  return (
    <div>
      <Link href="/ws2">WS2</Link>
      <button onClick={handleSignIn}>Sign In</button>
      {isConnected ? <p>Connected to WebSocket</p> : <p>Not Connected</p>}
    </div>
  );
};

export default SignInPage;
