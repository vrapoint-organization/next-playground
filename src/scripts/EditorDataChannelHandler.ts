import { IMessage } from "@stomp/stompjs";
import { getEditorUserAtom } from "../jotai/editor";

export interface DataFunction {
  DEFAULT: (data: any) => void;
  BROADCAST: (data: any) => void;
  CAMERA: (data: any) => void;
  DATA_TRANSFER: (data: any) => void;
  REVIEW: (data: any) => void;
}

// useEditorSocket에서 Data채널 데이터 핸들링
const EditorDataChannelHandler = (msg: IMessage) => {
  const data = JSON.parse(msg.body);
  // handler
  console.log({ data });
  console.log({ getUser: getEditorUserAtom() });
};

export default EditorDataChannelHandler;
