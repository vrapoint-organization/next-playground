import { IMessage } from "@stomp/stompjs";
import {
  getEditorUserAtom,
  setEditorModelDataModifiedAtom,
  setEditorParticipantAtom,
} from "../jotai/editor";
import { Matrix4 } from "three";
import objectHash from "object-hash";

export interface FlowFunction {}

const randomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

// useEditorSocket에서 Flow채널 데이터 핸들링
const EditorFlowChannelHandler = (mySessionId: string) => (msg: IMessage) => {
  const data: { type: string; payload: any } = JSON.parse(msg.body);
  const { type, payload } = data;
  const thisUser = getEditorUserAtom()!;

  // console.log({ FlowDataType: type, payload: payload });
  // console.log({ thisUser });

  if (type === "USER_INFO") {
    // 나 자신은 제외
    const users = (
      payload.users as {
        id: string;
        updatedDatetime: null;
        hash: string;
        data: {
          wsSessionId: string;
          name: string;
          shortUuid: string;
          uuid: string;
        };
      }[]
    ).filter((user) => user.id !== thisUser.id);
    setEditorParticipantAtom((prev) => {
      const copied = [...prev];
      users.forEach((user) => {
        const found = copied.find((el) => el.uid === user.id);
        if (!found) {
          copied.push({
            name: user.data.name,
            sessionId: user.data.wsSessionId,
            uid: user.id,
            color: randomHexColor(),
            camera: {
              show: true,
              matrix: new Matrix4(),
            },
            selectedObject: {
              show: false,
              objectUuid: null,
            },
          });
        }
      });
      return copied;
    });
  } else if (type === "USER_STATE") {
    const userstate = payload as {
      cameraInfo: { id: null; matrix: number[] };
      selectedInfo: { nodeId: null | string };
      sessionId: string;
      uid: string;
    };
    // console.log("UserState payload: ", userstate, "MySessionId: ", mySessionId);

    // 내가 아니면 업데이트
    if (userstate.uid !== mySessionId) {
      setEditorParticipantAtom((prev) => {
        const copied = [...prev];
        const found = copied.find((el) => el.sessionId === userstate.uid);
        // console.log({ prev });
        if (found) {
          found.camera.matrix = new Matrix4().fromArray(
            userstate.cameraInfo.matrix
          );
          found.selectedObject.objectUuid = userstate.selectedInfo.nodeId;
        }
        return copied;
      });
    }
  } else if (type === "ECHO") {
    const {
      data: modelData,
      destination,
      hash,
    } = payload as {
      destination: string;
      data: any;
      hash: string;
    };
    if (destination === "model") {
      // console.log({ modelData, payload });
      setEditorModelDataModifiedAtom((prev: any) => {
        if (prev?.hash === hash) {
          return prev;
        }
        if (prev && prev.data.updatedAt >= modelData.updatedAt) {
          return;
        }
        // console.log("updated, ", { prevhas: prev.hash, hash });
        return { hash: objectHash(modelData), data: { ...modelData } };
      });
    }
  }

  // setEditorParticipantAtom((prev) => {
  //   const newCameraData = {
  //     id,
  //     name: `Camera of ${id}`,
  //     color: "red",
  //     camera: new Matrix4().fromArray(matrix),
  //   };

  //   const retval = { ...prev };
  //   const updatedCameras = retval.cameras.filter((c) => {
  //     if (c.id === id) {
  //       // 이미 있는 카메라일 때 제외
  //       return false;
  //     }
  //     return true;
  //   });
  //   updatedCameras.push(newCameraData);
  //   retval.cameras = updatedCameras.filter((c) => c.id !== thisUser.id); // 나 자신의 카메라 제외
  //   return retval;
  // });
};

export default EditorFlowChannelHandler;
