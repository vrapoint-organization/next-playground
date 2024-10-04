import { IMessage } from "@stomp/stompjs";
import {
  getEditorUserAtom,
  setEditorModelDataModifiedAtom,
  setEditorParticipantAtom,
} from "../jotai/editor";
import { Matrix4 } from "three";
import objectHash from "object-hash";
import { ParticipantState } from "@/types/EditorType";

export interface FlowFunction {}

const randomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const UserStateQueue = new Map<string, any>();

// useEditorSocket에서 Flow채널 데이터 핸들링
const EditorFlowChannelHandler = (mySessionId: string) => (msg: IMessage) => {
  const data: { type: string; payload: any } = JSON.parse(msg.body);
  const { type, payload } = data;
  const thisUser = getEditorUserAtom()!;

  // console.log({ FlowDataType: type, payload: payload });
  // console.log({ thisUser });

  if (type === "USER_INFO") {
    // 나 자신은 제외
    console.log({ USER_INFOpayload: payload });
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
          const userstateFound = UserStateQueue.get(user.id);
          let camera: ParticipantState["camera"] = null;
          let selectedObject: ParticipantState["selectedObject"] = null;
          if (userstateFound) {
            camera = {
              show: true,
              matrix: new Matrix4().fromArray(
                userstateFound.data.cameraInfo.matrix
              ),
            };
            selectedObject = {
              show: true,
              objectUuid: userstateFound.data.selectedInfo.nodeId,
            };
            UserStateQueue.delete(user.id);
          }
          copied.push({
            name: user.data.name,
            sessionId: user.data.wsSessionId,
            uid: user.id,
            color: randomHexColor(),
            camera,
            selectedObject,
          });
        }
      });
      return copied;
    });
  } else if (type === "USER_STATE") {
    type SingleUserStateData = {
      cameraInfo: { id: null; matrix: number[] };
      selectedInfo: { nodeId: null | string };
      sessionId: string;
      uid: string;
    };
    type SingleUserState = {
      id: string;
      updatedDatetime: null;
      hash: string;
      data: SingleUserStateData;
    };
    if (Array.isArray(payload.users)) {
      // #case 1. payload.users가 배열일 때
      // 나를 제외한 유저들을 받아서 업데이트
      const users = (payload.users as SingleUserState[]).filter(
        (user) => user.data.uid !== mySessionId
      );

      setEditorParticipantAtom((prev) => {
        const copied = [...prev];
        console.log({ users });
        users.forEach((user) => {
          const found = copied.find((el) => el.uid === user.data.uid);
          if (found) {
            if (!found.camera) {
              found.camera = {
                show: true,
              };
            }
            if (!found.selectedObject) {
              found.selectedObject = {
                show: true,
              };
            }
            found.camera.matrix = new Matrix4().fromArray(
              user.data.cameraInfo.matrix
            );
            found.selectedObject.objectUuid =
              user.data.selectedInfo?.nodeId ?? null;
          } else {
            // 없으면 추가
            UserStateQueue.set(user.data.uid, user);
            throw new Error(
              "UserInfo에서 수신하지 않은 유저정보를 UserState에서 받았음"
            );
          }
        });
        return copied;
      });
    } else {
      // #case 2. payload.users가 하나의 유저스테이트일 때
      const userstate = payload as SingleUserStateData;

      // 내가 아니면 업데이트
      if (userstate.uid !== mySessionId) {
        setEditorParticipantAtom((prev) => {
          const copied = [...prev];
          const found = copied.find((el) => el.sessionId === userstate.uid);
          // console.log({ prev });
          if (found) {
            if (!found.camera) {
              found.camera = {
                show: true,
              };
            }
            if (!found.selectedObject) {
              found.selectedObject = {
                show: true,
              };
            }
            found.camera.matrix = new Matrix4().fromArray(
              userstate.cameraInfo.matrix
            );
            found.selectedObject.objectUuid = userstate.selectedInfo.nodeId;
          }
          return copied;
        });
      } else {
        //내 정보
        console.log("UserState is mine");
      }
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
