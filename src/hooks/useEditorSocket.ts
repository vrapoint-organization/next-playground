import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useSocket } from "../scripts/SocketProvider";
import { Client } from "@stomp/stompjs";
import { getCookie } from "cookies-next";
import ENV_PUBLIC from "../scripts/ENV_PUBLIC";
import EditorDataChannelHandler from "../scripts/EditorDataChannelHandler";
import EditorFlowChannelHandler from "../scripts/EditorFlowChannelHandler";

const safeSocket = (socketRef: MutableRefObject<Client | null>) => {
  const socket = socketRef.current;
  if (!socket) {
    throw new Error("Socket not connected");
  }
  if (!socket.active) {
    throw new Error("Socket not active");
  }
  return socket;
};

export type useEditorSocketProps = {
  productId: string;
  actionOnDisconnection?: () => void;
  // dataHandler: DataFunction;
  // flowHandler: FlowFunction;
  disableConnectionOnMount?: boolean;
};

// SocketProvider과 컨텍스트로부터 소켓을 받아서 사용하므로
// 이 훅을 사용하는 곳은 동일한 소켓을 사용한다고 보장할 수 있다
export default function useEditorSocket(props?: useEditorSocketProps) {
  const socketExports = useSocket();
  const socketRef = socketExports.socket;
  const { productId, disableConnectionOnMount, actionOnDisconnection } =
    props ?? {};

  const urls = {
    subDataUrl: `/user/sub/editor/${productId}/data`,
    pubDataUrl: `/pub/editor/${productId}/data`,
    subFlowUrl: `/sub/editor/${productId}/flow`,
    pubFlowUrl: `/pub/editor/${productId}/flow`,
  };

  const checkBeforeSocketInteraction = () => {
    if (!productId) {
      throw new Error("productId is required. productId: " + productId);
    }
    // if (!dataHandler) {
    //   throw new Error("dataHandler is required");
    // }
    // if (!flowHandler) {
    //   throw new Error("flowHandler is required");
    // }
  };
  const subscribeData = () => {
    checkBeforeSocketInteraction();
    const socket = safeSocket(socketRef);
    socket.subscribe(urls.subDataUrl, EditorDataChannelHandler);
    console.log("subscribed to Data channel");
  };

  const subscribeFlow = () => {
    checkBeforeSocketInteraction();
    const socket = safeSocket(socketRef);
    socket.subscribe(urls.subFlowUrl, EditorFlowChannelHandler);
    console.log("subscribed to Flow channel");
  };

  const publishData = (data: any) => {
    checkBeforeSocketInteraction();
    const socket = safeSocket(socketRef);
    socket.publish({
      destination: urls.pubDataUrl,
      // body: compressData(data),
      body: JSON.stringify(data),
    });
  };

  const publishFlow = (data: any) => {
    checkBeforeSocketInteraction();
    const socket = safeSocket(socketRef);
    socket.publish({
      destination: urls.pubFlowUrl,
      // body: compressData(data),
      body: JSON.stringify(data),
    });
  };

  const cleanup = () => {
    console.log("Unsub");
    socketRef.current?.unsubscribe(urls.subDataUrl);
    socketRef.current?.unsubscribe(urls.subFlowUrl);
    socketRef.current?.deactivate();
    socketRef.current?.forceDisconnect();
    socketRef.current = null;
  };

  useEffect(() => {
    const onEditorSocketMount = async () => {
      // 어디든 첫 페이지 진입 시 연결 시도
      const socket = socketExports.socket.current;
      const tryToConnectOnMount = !disableConnectionOnMount && !socket?.active;
      if (tryToConnectOnMount) {
        // 소켓연결이 없으면 연결 시도, 실패 시 얼리리턴
        if (!socket) {
          const random3digitNumber = Math.floor(Math.random() * 1000);
          const token =
            getCookie(ENV_PUBLIC.NEXT_PUBLIC_USER_ACCESS) ??
            `MASTER${random3digitNumber}`;
          if (token) {
            let failed = null;
            console.log("isConnected:", socketExports.isConnected);
            await socketExports.connect(token).catch((e) => {
              failed = e;
            });
            // debugger;
            if (failed) {
              // TODO : handle
              console.error(failed);
              throw new Error("소켓 연결 실패");
            }
          } else {
            // 실패하면 얼리리턴
            console.error("No token to connect to socket found");
            actionOnDisconnection?.();
            return;
          }
        }
        // 여기까지 왔으면 소켓 연결 성공
        // subscribe 시도
        if (productId) {
          // socket.sub;
          subscribeData();
          subscribeFlow();
        }
      }
    };

    onEditorSocketMount();

    return cleanup;
  }, []);
  return {
    ...socketExports,
    cleanup,
    subscribeData,
    subscribeFlow,
    publishData,
    publishFlow,
  };
}

export type EditorSocketExports = ReturnType<typeof useEditorSocket>;
