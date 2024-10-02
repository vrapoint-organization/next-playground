import { Matrix4 } from "three";
import useEditorSocket from "@/src/hooks/useEditorSocket";
import { GetServerSidePropsContext } from "next";
import LeftPanel from "@/src/components/editor/LeftPanel";
import RightPanel from "@/src/components/editor/RightPanel";
import {
  editorModelDataModified,
  editorNode,
  editorStatus as editorStatusAtom,
  editorStore,
  editorUserAtom,
} from "@/src/jotai/editor";
import Link from "next/link";
import EditorCanvas from "@/src/components/editor/EditorCanvas";
import { useRouter } from "next/router";
import JotaiSSRProvider from "@/src/jotai/JotaiSSRProvider";
import { useEffect, useMemo } from "react";
import { useAtom, useSetAtom } from "jotai";
import * as THREE from "three";
export type EditorProps = {
  myId: string;
  projectId: string;
};
const _Editor = ({ myId, projectId }: EditorProps) => {
  const router = useRouter();
  const socketExports = useEditorSocket({
    productId: projectId,
    // connectOnMount: true,
    actionOnDisconnection() {
      alert("소켓 연결 실패");
      router.back();
    },
  });

  const setModifiedModelData = useSetAtom(editorModelDataModified);

  const { isConnected, publishData, session } = socketExports;

  useEffect(() => {
    if (isConnected) {
      console.log("Session ID : ", session.current);
    }
  }, [isConnected]);

  const ControlPanel = () =>
    !true ? null : (
      <div
        style={{
          display: true ? "inherit" : "none",
          position: "absolute",
          right: 0,
          bottom: 0,
          backgroundColor: "#d0d0d0",
          zIndex: 100,
        }}
      >
        ControlPanel
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => {
              publishData({
                type: "ECHO",
                data: {
                  mydata: "한지우 그는 신인가?",
                },
              });
            }}
          >
            Data
          </button>
          <button
            onClick={() => {
              publishData({
                type: "REVIEW",
                data: {
                  id: myId,
                  matrix: new Matrix4().toArray(),
                },
              });
            }}
          >
            Flow
          </button>
          <button
            onClick={() => {
              setModifiedModelData((prev) => {
                const x = Math.random() * 2 - 1;
                const y = Math.random() * 2 - 1;
                const z = Math.random() * 2 - 1;
                return {
                  id: "0a2d8a62-c09b-4833-a706-fb42f2523608",
                  data: {
                    action: "position",
                    value: [x, y, z],
                  },
                  updatedAt: new Date().getTime(),
                };
              });
            }}
          >
            Move left box
          </button>
          <button
            onClick={() => {
              setModifiedModelData((prev) => {
                const x = Math.random() * 2 + 2;
                const y = Math.random() * 2 - 1;
                const z = Math.random() * 2 - 1;
                return {
                  id: "9d24b37d-93b5-4a0d-9718-c67bdeb23319",
                  data: {
                    action: "position",
                    value: [x, y, z],
                  },
                  updatedAt: new Date().getTime(),
                };
              });
            }}
          >
            Move right box
          </button>
        </div>
      </div>
    );

  if (!isConnected) {
    return (
      <div>
        {/* Not Connected */}
        연결 중...
        <br></br>
        <Link href="/editor">Back to connect</Link>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <EditorCanvas socketExports={socketExports} userId={myId}></EditorCanvas>
      <LeftPanel></LeftPanel>
      <RightPanel></RightPanel>
      <ControlPanel></ControlPanel>
    </div>
  );
};

const Editor = (props: EditorProps) => {
  const router = useRouter();
  const { myId, projectId } = props;
  const socketExports = useEditorSocket({
    productId: projectId,
    // connectOnMount: true,
    actionOnDisconnection() {
      alert("소켓 연결 실패");
      router.back();
    },
  });
  const { session } = socketExports;

  return (
    <JotaiSSRProvider
      store={editorStore}
      atomValues={[
        [
          editorUserAtom,
          {
            id: myId,
            name: `User${myId}`,
            sessionId: session.current,
          },
        ],
      ]}
    >
      <_Editor {...props}></_Editor>
    </JotaiSSRProvider>
  );
};

export default Editor;

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const { id: myId, projectId } = query;

  return {
    props: {
      myId,
      projectId,
    },
  };
};
