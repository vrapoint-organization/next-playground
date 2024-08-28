import { useSocket } from "scripts/SocketProvider";
import React from "react";
import Link from "next/link";
import { decompressData } from "@/src/scripts/utils";

function WebSocketCanvas() {
  const { isConnected, sendMousePosition, mousePositions } = useSocket();
  const lastSentRef = React.useRef<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // console.log("mouse move", e.clientX, e.clientY);
    if (Date.now() - lastSentRef.current < 100) {
      return;
    }
    sendMousePosition(e.clientX, e.clientY);
    lastSentRef.current = Date.now();
  };

  if (!isConnected) {
    return (
      <div>
        <Link href="/ws1">WS1</Link>
        <Link href="/ws2">WS2</Link>
        Not connected
      </div>
    );
  }
  return (
    <div
      onMouseMove={handleMouseMove}
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      <Link href="/ws1">WS1</Link>
      <Link href="/ws2">WS2</Link>
      {mousePositions.map((res, index) => {
        const { name, data: compressed } = res;
        const { x, y } = decompressData(compressed);
        return (
          <div key={name} style={{ position: "absolute", top: y, left: x }}>
            {name}
          </div>
        );
      })}
    </div>
  );
}

export default WebSocketCanvas;
