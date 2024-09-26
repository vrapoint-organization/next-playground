import { Matrix4 } from "three";
import useEditorSocket from "@/src/scripts/useEditorSocket";
import { GetServerSidePropsContext } from "next";
import LeftPanel from "@/src/components/editor/LeftPanel";
import RightPanel from "@/src/components/editor/RightPanel";
import { Provider, useAtom, useSetAtom } from "jotai";
import { camerasAtom, editorStore, editorUserAtom } from "@/src/jotai/editor";
import Link from "next/link";
import EditorCanvas from "@/src/components/editor/EditorCanvas";
import { useEffect } from "react";
import { useRouter } from "next/router";
import JotaiSSRProvider from "@/src/jotai/JotaiSSRProvider";

export default function Editor({
  myId,
  projectId,
}: {
  myId: string;
  projectId: string;
}) {
  const socketExports = useEditorSocket({
    productId: projectId,
    // connectOnMount: true,
  });

  const {
    socket,
    isConnected,
    subscribeData,
    subscribeFlow,
    publishData,
    publishFlow,
  } = socketExports;
  const router = useRouter();

  if (!isConnected) {
    return (
      <div>
        Not Connected
        <br></br>
        <Link href="/editor">Back to connect</Link>
      </div>
    );
  }

  const ControlPanel = () => (
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
            publishData({ type: "REVIEW", id: "" });
          }}
        >
          Data
        </button>
        <button
          onClick={() => {
            publishFlow({
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
      </div>
    </div>
  );

  return (
    // <Provider store={editorStore}>
    <JotaiSSRProvider
      atomValues={[
        [
          editorUserAtom,
          {
            id: myId,
            name: `User${myId}`,
          },
        ],
      ]}
    >
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <EditorCanvas
          userId={myId}
          socketExports={socketExports}
        ></EditorCanvas>
        <LeftPanel></LeftPanel>
        <RightPanel></RightPanel>
        <ControlPanel></ControlPanel>
      </div>
    </JotaiSSRProvider>
  );
}

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
