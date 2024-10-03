import { Matrix4 } from "three";
import useEditorSocket from "@/src/hooks/useEditorSocket";
import { GetServerSidePropsContext } from "next";
import LeftPanel from "@/src/components/editor/LeftPanel";
import RightPanel from "@/src/components/editor/RightPanel";
import {
  editorModelDataModified,
  editorNode,
  editorParticipantAtom,
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
import { ParticipantState } from "@/types/EditorType";
export type EditorProps = {
  myId: string;
  projectId: string;
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const createRandomUser = (name: string): ParticipantState => {
  const thisUid = name + "-id";
  const thisSessionId = name + "-sessionid";
  const color = generateRandomHexColor();
  const initialCamera = new Matrix4().identity();
  const randomPosition = new THREE.Vector3(
    Math.random() * 3,
    Math.random() * 3,
    Math.random() * 3
  );
  initialCamera.setPosition(randomPosition);
  const retval: ParticipantState = {
    uid: thisUid,
    sessionId: thisSessionId,
    color,
    name,
    camera: {
      show: true,
      matrix: initialCamera,
    },
    selectedObject: {
      show: false,
      objectUuid: null,
    },
  };
  return retval;
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
  const setParticipants = useSetAtom(editorParticipantAtom);

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
          <div style={{ display: "flex" }}>
            <button
              onClick={() => {
                setParticipants((prev) => {
                  const user1 = createRandomUser("User1");
                  const { sessionId } = user1;
                  const copied = [...prev];
                  const found = copied.find((p) => p.sessionId === sessionId);
                  const filtered = copied.filter(
                    (p) => p.sessionId !== sessionId
                  );
                  if (found) {
                    return copied.filter((p) => p.sessionId !== sessionId);
                  } else {
                    filtered.push(user1);
                    return filtered;
                  }
                });
              }}
            >
              Toggle User1
            </button>
            <button
              onClick={() => {
                setParticipants((prev) => {
                  const copied = [...prev];
                  const user1 = copied.find((p) => p.name === "User1");
                  if (!user1) return prev;
                  const { sessionId } = user1;
                  const randomPosition = new THREE.Vector3(
                    Math.random() * 3 - 3,
                    Math.random() * 3,
                    Math.random() * 3
                  );
                  user1.camera.matrix.setPosition(randomPosition);
                  return copied;
                });
              }}
            >
              Move User1 Camera
            </button>
            <button
              onClick={() => {
                setParticipants((prev) => {
                  const copied = [...prev];
                  const user1 = copied.find((p) => p.name === "User1");
                  if (!user1) return prev;
                  if (user1.selectedObject.objectUuid) {
                    user1.selectedObject.objectUuid = null;
                  } else {
                    user1.selectedObject.objectUuid =
                      "0a2d8a62-c09b-4833-a706-fb42f2523608";
                    ("9d24b37d-93b5-4a0d-9718-c67bdeb23319");
                  }

                  return copied;
                });
              }}
            >
              User1 select left
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <button
              onClick={() => {
                setParticipants((prev) => {
                  const user2 = createRandomUser("User2");
                  const { sessionId } = user2;
                  const copied = [...prev];
                  const found = copied.find((p) => p.sessionId === sessionId);
                  const filtered = copied.filter(
                    (p) => p.sessionId !== sessionId
                  );
                  if (found) {
                    return copied.filter((p) => p.sessionId !== sessionId);
                  } else {
                    filtered.push(user2);
                    return filtered;
                  }
                });
              }}
            >
              Toggle User2
            </button>
            <button
              onClick={() => {
                setParticipants((prev) => {
                  const copied = [...prev];
                  const user2 = copied.find((p) => p.name === "User2");
                  if (!user2) return prev;
                  const { sessionId } = user2;
                  const randomPosition = new THREE.Vector3(
                    Math.random() * 3 + 3,
                    Math.random() * 3,
                    Math.random() * 3
                  );
                  user2.camera.matrix.setPosition(randomPosition);
                  return copied;
                });
              }}
            >
              Move User2 Camera
            </button>
            <button
              onClick={() => {
                setParticipants((prev) => {
                  const copied = [...prev];
                  const user2 = copied.find((p) => p.name === "User2");
                  if (!user2) return prev;
                  if (user2.selectedObject.objectUuid) {
                    user2.selectedObject.objectUuid = null;
                  } else {
                    user2.selectedObject.objectUuid =
                      "9d24b37d-93b5-4a0d-9718-c67bdeb23319";
                  }

                  return copied;
                });
              }}
            >
              User2 select Right
            </button>
          </div>
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
