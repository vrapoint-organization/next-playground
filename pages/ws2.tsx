import { useSocket } from "@/src/scripts/SocketProvider";
import Link from "next/link";

const OtherPage: React.FC = () => {
  const { disconnect, isConnected } = useSocket();

  return (
    <div>
      <Link href="/ws1">WS1</Link>
      {isConnected ? (
        <button onClick={disconnect}>Disconnect from WebSocket</button>
      ) : (
        <p>Not connected</p>
      )}
    </div>
  );
};

export default OtherPage;
