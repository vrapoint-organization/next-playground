import {useEffect, useRef, useState} from "react";
import {Client, Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";
import * as THREE from 'three'

const WebSocketClient = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [responseObject, setResponseObject] = useState({});
  const [token, setToken] = useState("MASTER");
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const sampleUUID = 'eqwe1e';
  
  const createNewConnect = async (token: string) => {
    // const socket = new SockJS("http://localhost:8080/ws");
    const socket = new SockJS(ENV_PUBLIC.NEXT_PUBLIC_WEBSOCKET_URL);
    const stompClient = Stomp.over(() => socket);
    
    stompClient.connect({
      Authorization: token
    }, () => {
      // stompClient.subscribe("/sub/default", (msg) => {
      //   console.log({ msg });
      //   setResponse(JSON.parse(msg.body).response);
      // });
      
      setIsConnected(true);
      
      stompClient.subscribe(`/sub/editor/${sampleUUID}`, (msg) => {
        console.log('received From sub : ', msg);
        const r = responseObject;
        const data = JSON.parse(msg.body).data
        if (!r[sampleUUID]) {
          r[sampleUUID] = [data];
        } else {
          r[sampleUUID].push(data);
        }
        setResponseObject(r);
        // console.log({msg});
        // setResponse(JSON.parse(msg.body).data.message);
      });
    }, (err) => {
      console.log('websocket Error, ', err);
      setIsConnected(false);
      if (err.body === "유효하지 않은 권한입니다.") {
        alert('subscribe 에러 발생')
      }
    }, () => {
      setIsConnected(false);
      console.log('websocket Closed');
    });
    
    stompClient.activate();
    stompClientRef.current = stompClient;
    
    return stompClient;
  }
  
  const sendMessage = () => {
    const client = stompClientRef.current;
    if (!client) {
      return;
    }
    
    client.publish({
      destination: `/pub/editor/${sampleUUID}`,
      body: JSON.stringify({
        type: "COORDINATES",
        data: {
          coords : new THREE.Matrix4(),
          user: token
        },
      }),
    });
  };
  
  useEffect(() => {
    setIsConnected(isWebsocketConnected());
  }, [stompClientRef.current, stompClientRef.current?.active]);
  
  const isWebsocketConnected = () => {
    console.log('isWebsocketConnected : ', stompClientRef)
    return stompClientRef.current !== null && stompClientRef.current.active
  }
  
  async function handleConnection() {
    console.log(isWebsocketConnected());
    if (isWebsocketConnected()) {
      const wsClient = stompClientRef.current;
      if (wsClient) {
        await wsClient.deactivate({force: true});
      }
    } else {
      await createNewConnect(token);
    }
  }
  
  useEffect(() => {
    console.log('responseObject : ', responseObject)
  }, [responseObject]);
  
  return (
    <>
      <div>
        <input type="text" value={token} onChange={(e) => setToken(e.target.value)}/>
        <button onClick={handleConnection}>{isConnected ? 'DISCONNECT' : 'CONNECT'}</button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        {responseObject && Object.keys(responseObject).map(key => {
          return (<div key={key}>
            <h4 style={{fontSize: '20px'}}>{key}</h4>
            {responseObject[key].map((s: { coords: THREE.Matrix4, user: string }) => (
              <h6>{s.user} : {s.coords.elements}</h6>
            ))}
          </div>)
        })}
      </div>
    </>
  );
};

export default WebSocketClient;
