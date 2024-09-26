import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  OrbitControlsChangeEvent,
  OrbitControlsProps,
  Sphere,
} from "@react-three/drei";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { useEffect, useRef, useState } from "react";
import useEditorSocket from "@/src/scripts/useEditorSocket";
import { GetServerSidePropsContext } from "next";
import styled from "@emotion/styled";
import LeftPanel from "@/src/components/editor/LeftPanel";
import RightPanel from "@/src/components/editor/RightPanel";
import { Provider, useAtom, useSetAtom } from "jotai";
import { camerasAtom, editorStore } from "@/src/jotai/editor";
import { CameraAtomType } from "@/types/EditorType";
import Link from "next/link";
import EditorCanvas from "@/src/components/editor/EditorCanvas";

export default function Editor({
  myId,
  projectId,
}: {
  myId: string;
  projectId: string;
}) {
  const {
    socket,
    isConnected,
    subscribeCamera,
    editorSubscribed,
    publishCamera,
  } = useEditorSocket();
  const [cameras, setCameras] = useAtom(camerasAtom);
  // const setCameras = useSetAtom(camerasAtom);

  const lastSent = useRef(0);
  const functions = {
    onCameraChange: (e?: OrbitControlsChangeEvent) => {
      const mat = e?.target.object.matrix.toArray();
      const now = Date.now();
      const canSend = now - lastSent.current > 100;
      // const canSend = true;
      if (canSend) {
        lastSent.current = now;
        publishCamera({
          id: myId,
          matrix: mat,
        });
      }
    },
  };

  const subDataUrl = `/user/sub/editor/${projectId}/data`;
  const pubDataUrl = `/pub/editor/${projectId}/data`;
  const subFlowUrl = `/sub/editor/${projectId}/flow`;
  const pubFlowUrl = `/pub/editor/${projectId}/flow`;
  useEffect(() => {
    // subscribeCamera(projectId, (data) => {
    //   console.log("Sub:", { data });
    //   if (!data.matrix) {
    //     console.error("No matrix data. Return");
    //     return;
    //   }
    //   setCameras((prev: CameraAtomType) => {
    //     const copied = { ...prev };
    //     const body = data;
    //     const retval = copied.cameras.filter((d) => d.id !== body.id);
    //     retval.push(body);
    //     copied.cameras = retval;
    //     return copied;
    //   });
    // });

    console.log("socket.current:", socket.current?.active);
    const socketActive = socket.current && socket.current?.active;
    if (!socketActive) {
      console.log("socket is not active");
      return;
    }

    console.log({ subUrl: subDataUrl, pubUrl: pubDataUrl });
    socket.current.subscribe(subDataUrl, (data) => {
      // debugger;
      // console.log({ userSpecificData: data });
      const obj = JSON.parse(data.body);
      console.log({ obj });
    });

    socket.current.subscribe(subFlowUrl, (data) => {
      // debugger;
      // console.log({ userSpecificData: data });
      const obj = JSON.parse(data.body);
      console.log({ flowData: obj });
    });

    const body = JSON.stringify({
      // type: "arbitrary",-
      id: "some_id",
      type: "REVIEW",

      // data: { myRandomData: 1234 },
    });
    socket.current.publish({
      destination: pubDataUrl,
      body,
    });
    return () => {
      socket.current?.unsubscribe(subDataUrl);
      socket.current?.unsubscribe(subFlowUrl);
    };
  }, [isConnected]);

  if (!isConnected) {
    return (
      <div>
        Not Connected
        <br></br>
        <Link href="/editor">Back to connect</Link>
      </div>
    );
  }

  return (
    // <Provider store={editorStore}>
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <EditorCanvas onCameraChange={functions.onCameraChange}></EditorCanvas>
      <LeftPanel></LeftPanel>
      <RightPanel></RightPanel>
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
          <div>Editor sub:{editorSubscribed ? "true" : "false"}</div>
          <div>
            <button
              onClick={() => {
                socket.current?.publish({
                  destination: pubDataUrl,
                  body: JSON.stringify({
                    id: "another_id",
                    type: "REVIEW",
                  }),
                });
              }}
            >
              Pub data
            </button>
            <button
              onClick={() => {
                socket.current?.publish({
                  destination: pubFlowUrl,
                  body: JSON.stringify({
                    type: "arbitrary",
                    data: { myRandomData: 1234 },
                  }),
                });
              }}
            >
              Pub flow
            </button>
          </div>
        </div>
      </div>
    </div>
    // </Provider>
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
