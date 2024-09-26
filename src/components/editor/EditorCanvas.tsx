import { camerasAtom, editorUserAtom } from "@/src/jotai/editor";
import { OrbitControlsChangeEvent } from "@react-three/drei";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import EditorCanvasRenderer from "./EditorCanvasRenderer";
import useEditorSocket from "@/src/scripts/useEditorSocket";

export type EditorCanvasProps = {
  userId: string;
  socketExports: ReturnType<typeof useEditorSocket>;
};

// <EditorCanvas> : 렌더러 + 데이터 핸들링
// 그림은 EditorCanvasRenderer에서만 그리고
// 여기서는 데이터를 주고 받는 역할까지 담당한다.
// ex. 카메라 포지션 변경 시 WS 퍼블리시, 셀렉트 시 WS 퍼블리시 등
// 참고 : 직접적으로 sub된 데이터를 핸들링하는 파트는 useEditorSocket에서만 할 것
const EditorCanvas = (props: EditorCanvasProps) => {
  const { userId, socketExports } = props;
  const { publishData, publishFlow } = socketExports;
  const cameras = useAtomValue(camerasAtom);
  const user = useAtomValue(editorUserAtom);
  console.log({ userInEditorCanvas: user });

  const lastSent = useRef(0);
  const functions = {
    onCameraChange: (e?: OrbitControlsChangeEvent) => {
      const mat = e?.target.object.matrix.toArray();
      const now = Date.now();
      const canSend = now - lastSent.current > 100;
      // const canSend = true;
      if (canSend) {
        lastSent.current = now;
        publishFlow({
          type: "CAMERA",
          data: {
            id: userId,
            matrix: mat,
          },
        });
      }
    },
  };

  return (
    <EditorCanvasRenderer
      onCameraChange={functions.onCameraChange}
    ></EditorCanvasRenderer>
  );
};

export default EditorCanvas;
