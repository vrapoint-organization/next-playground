import { useEffect, useRef, useState } from "react";
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";

const WebSocketClient = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // const socket = new SockJS("http://localhost:8080/ws");
    const socket = new SockJS(ENV_PUBLIC.NEXT_PUBLIC_WEBSOCKET_URL);
    const stompClient = Stomp.over(() => socket);

    stompClient.connect({}, () => {
      // stompClient.subscribe("/sub/default", (msg) => {
      //   console.log({ msg });
      //   setResponse(JSON.parse(msg.body).response);
      // });

      stompClient.subscribe("/sub/default", (msg) => {
        console.log({ msg });
        setResponse(JSON.parse(msg.body).response);
      });
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    const client = stompClientRef.current;
    if (!client) {
      return;
    }

    client.publish({
      destination: "/pub/default",
      body: JSON.stringify({
        type: "wowtype",
        data: {
          message,
        },
      }),
    });
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <p>Response: {response}</p>
    </div>
  );
};

export default WebSocketClient;
