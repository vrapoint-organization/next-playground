import { useSocket } from "@/src/scripts/SocketProvider";
import Link from "next/link";

function Editor() {
  const { isConnected } = useSocket();

  return (
    <div>
      Editor
      <div>isConnected : {isConnected ? "true" : "false"}</div>
      <Link href={"/editor/editor"}>To editor</Link>
    </div>
  );
}

export default Editor;
