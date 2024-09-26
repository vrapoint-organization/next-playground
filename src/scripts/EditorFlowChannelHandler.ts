import { IMessage } from "@stomp/stompjs";
import { getEditorUserAtom, setEditorCamerasAtom } from "../jotai/editor";
import { Matrix4 } from "three";

export interface FlowFunction {}

// useEditorSocket에서 Flow채널 데이터 핸들링
const EditorFlowChannelHandler = (msg: IMessage) => {
  const data = JSON.parse(msg.body);
  // console.log({ flowData: data });
  // handler[data.type](data.data);
  const { id, matrix } = data.data;
  const thisUser = getEditorUserAtom()!;
  setEditorCamerasAtom((prev) => {
    const newCameraData = {
      id,
      name: `Camera of ${id}`,
      color: "red",
      camera: new Matrix4().fromArray(matrix),
    };

    const retval = { ...prev };
    const updatedCameras = retval.cameras.filter((c) => {
      if (c.id === id) {
        // 이미 있는 카메라일 때 제외
        return false;
      }
      return true;
    });
    updatedCameras.push(newCameraData);
    retval.cameras = updatedCameras.filter((c) => c.id !== thisUser.id); // 나 자신의 카메라 제외
    return retval;
  });
};

export default EditorFlowChannelHandler;
