import {useEffect, useRef, useState} from "react";
import {Client, Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ENV_PUBLIC from "@/scripts/client/ENV_PUBLIC";
import * as THREE from 'three'

const WebSocketClient = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [responseObject, setResponseObject] = useState({
    positions: {},
    assets: [],
  });
  const [sendMouse, setSendMouse] = useState(false);
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
        const body = JSON.parse(msg.body)
        const data = JSON.parse(msg.body).data
        
        setResponseObject(prev => {
          const copied = {...prev};
          if (body.type === 'COORDINATES') {
            const positions = copied.positions;
            positions[data.user] = {x: data.x, y: data.y}
            copied.positions = positions;
          } else if (body.type === 'ASSET') {
            const assets = copied.assets;
            if (!assets.includes(data.uuid)) {
              assets.push(data.uuid);
            }
            copied.assets = assets;
          }
          return copied
        });
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
  
  const sendMessage = (data: { type: string, data: any }) => {
    const client = stompClientRef.current;
    if (!client || !isConnected) {
      return;
    }
    if (isConnected) {
      client.publish({
        destination: `/pub/editor/${sampleUUID}`,
        body: JSON.stringify(data),
      });
    }
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
  
  function setMouseStatus() {
    setSendMouse(pre => !pre);
  }
  
  const handleMouseMove = (e) => {
    if (sendMouse) {
      sendMessage({type: 'COORDINATES', data: {user: token, x: e.clientX, y: e.clientY}});
    }
  }
  
  const handleSendRandomData = () => {
    sendMessage({type: 'ASSET', data: {uuid: Math.random()}});
  }
  
  return (
    <div style={{width: '100vw', height: '100vh'}} onMouseMove={handleMouseMove}>
      <div style={{padding: '8px'}}>
        <h4>Connection</h4>
        <input type="text" value={token} onChange={(e) => setToken(e.target.value)}/>
        <button onClick={handleConnection}>{isConnected ? 'DISCONNECT' : 'CONNECT'}</button>
      </div>
      <div style={{padding: '8px'}}>
        <h4>Actions</h4>
        <div style={{display: 'flex', padding: '8px', gap: '4px'}}>
          <button onClick={setMouseStatus}>{sendMouse ? '마우스 위치 정보 보내기 ON' : '마우스 위치 정보 보내기 OFF'}</button>
          <div>
            <button onClick={handleSendRandomData}>랜덤 UUID 전송</button>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', border: '1px solid gray'}}>
        <div style={{borderRight: '1px solid gray', padding: '16px', minWidth: '200px'}}>
          <h4>Positions</h4>
          {Object.keys(responseObject.positions).map(name => {
            console.log('name : ', name)
            const o = responseObject.positions[name]
            return (<h6>{name} : {o.x}, {o.y}</h6>)
          })}
        </div>
        <div style={{borderRight: '1px solid gray', padding: '16px', minWidth: '200px'}}>
          <h4>Assets</h4>
          {responseObject.assets.map(name => {
            return (<h6>{name}</h6>)
          })}
        </div>
      </div>
    </div>
  );
};

export default WebSocketClient;
