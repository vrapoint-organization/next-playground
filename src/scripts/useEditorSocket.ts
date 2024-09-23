import { useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketProvider";

export default function useEditorSocket() {
  const socketExports = useSocket();
  const socketRef = socketExports.socket;
  const connectedUuid = useRef<string | null>(null);
  const [editorSubscribed, setEditorSubscribed] = useState(false);

  const [editorData, setEditorData] = useState<any[]>([]);

  const subscribeEditor = (uuid: string) => {
    const socket = socketRef?.current;
    if (!socket) {
      return;
    }
    socket.subscribe(`/sub/editor/${uuid}`, (msg) => {
      console.log("received From sub : ", msg);
      connectedUuid.current = uuid;
      setEditorData((prev) => [...prev, JSON.parse(msg.body).data]);
    });
    setEditorSubscribed(true);
  };

  const publishEditor = (data: any) => {
    debugger;
    const socket = socketRef?.current;
    if (!socket) {
      return;
    }

    if (!connectedUuid.current) {
      return;
    }

    const uuid = connectedUuid.current;
    socket.publish({
      destination: `/pub/editor/${uuid}`,
      body: JSON.stringify(data),
    });
  };

  const unsubscribeEditor = () => {
    const socket = socketRef?.current;
    if (!socket) {
      return;
    }

    if (!connectedUuid.current) {
      return;
    }

    const uuid = connectedUuid.current;
    socket.unsubscribe(`/pub/editor/${uuid}`);
    console.log("unsubscribed : " + uuid);
  };

  useEffect(() => {
    return unsubscribeEditor;
  }, []);
  return {
    ...socketExports,
    subscribeEditor,
    unsubscribeEditor,
    publishEditor,
    editorSubscribed,
    editorData,
  };
}
