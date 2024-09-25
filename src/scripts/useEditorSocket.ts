import { useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketProvider";
import { compressData } from "./utils";

const EDITOR_CHANNEL_PREFIX = "/sub/editor/" as const;
const EDITOR_CAMERA_CHANNEL_PREFIX = `${EDITOR_CHANNEL_PREFIX}camera/` as const;
const EDITOR_DATA_CHANNEL_PREFIX = `${EDITOR_CHANNEL_PREFIX}data/` as const;
const EDITOR_REVIEW_CHANNEL_PREFIX = `${EDITOR_CHANNEL_PREFIX}review/` as const;

export default function useEditorSocket() {
  const socketExports = useSocket();
  const socketRef = socketExports.socket;
  const connectedUuid = useRef<string | null>(null);
  const [editorSubscribed, setEditorSubscribed] = useState(false);

  const [cameraData, setCameraData] = useState<any[]>([]);
  const [editorData, setEditorData] = useState<any[]>([]);

  const subscribeCamera = (uuid: string) => {
    const socket = socketRef?.current;
    if (!socket) {
      return;
    }
    socket.subscribe(`${EDITOR_CAMERA_CHANNEL_PREFIX}${uuid}`, (msg) => {
      setCameraData((prev: { id: string }[]) => {
        const copied = [...prev];
        const body = JSON.parse(msg.body).data as { id: string };
        const retval = copied.filter((d) => d.id !== body.id).push(body);
        return retval;
      });
    });
    connectedUuid.current = uuid;
    setEditorSubscribed(true);
  };

  const subscribeEditor = (uuid: string) => {
    const socket = socketRef?.current;
    if (!socket) {
      return false;
    }
    if (!socket.active) {
      return false;
    }
    socket.subscribe(`/sub/editor/${uuid}`, (msg) => {
      // console.log("received From sub : ", msg);
      setEditorData((prev: { id: string }[]) => {
        const copied = [...prev];
        const body = JSON.parse(msg.body).data as { id: string };
        const retval = copied.filter((d) => d.id !== body.id);
        retval.push(body);
        return retval;
      });
    });
    connectedUuid.current = uuid;
    setEditorSubscribed(true);
    return true;
  };

  const publishEditor = (data: any) => {
    const socket = socketRef?.current;
    if (!socket) {
      return;
    }

    if (!connectedUuid.current) {
      return;
    }

    const uuid = connectedUuid.current;
    const sendData = {
      type: "arbitrary",
      data: { ...data },
    };

    const source = JSON.stringify(sendData);
    // const body = compressData(source).toString();
    const body = source;
    // console.log("Source : ", source.length, "Compressed : ", body.length);
    // console.log(body);
    socket.publish({
      destination: `/pub/editor/${uuid}`,
      body,
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
