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

// random color from string
const randomColorFromString = (str: string) => {
  return (
    "#" +
    str
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0)
      .toString(16)
  );
};

const refineEditorData = (
  myId: string,
  data: { id: string; matrix: number[] | Matrix4 }[]
) => {
  // console.log(data);
  return data
    .filter((d) => d.id !== myId)
    .map((d) => {
      if (d.matrix instanceof Matrix4) {
        return {
          camera: d.matrix,
          name: d.id,
          color: randomColorFromString(d.id),
          id: d.id,
        };
      }

      const mat = new Matrix4();
      mat.fromArray(d.matrix);
      return {
        camera: mat,
        name: d.id,
        color: randomColorFromString(d.id),
        id: d.id,
      };
    });
};

export default function Editor({
  myId,
  projectId,
}: {
  myId: string;
  projectId: string;
}) {
  const { isConnected, subscribeCamera, editorSubscribed, publishCamera } =
    useEditorSocket();
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

  useEffect(() => {
    subscribeCamera(projectId, (data) => {
      // console.log(data);
      setCameras((prev: CameraAtomType) => {
        const copied = { ...prev };
        const body = data;
        const retval = copied.cameras.filter((d) => d.id !== body.id);
        retval.push(body);
        copied.cameras = retval;
        return copied;
      });
    });
  }, []);

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
      <EditorCanvas
        users={refineEditorData(myId, cameras.cameras)}
        onCameraChange={functions.onCameraChange}
      ></EditorCanvas>
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
        </div>
      </div>
    </div>
    // </Provider>
  );
}

function LineFromMatrix({ matrix, color }: { matrix: Matrix4; color: string }) {
  const theRef = useRef();

  // Extract the translation vector (position) and rotation matrix (orientation)
  const position = new Vector3();
  const rotationQuaternion = new Quaternion();
  matrix.decompose(position, rotationQuaternion, new Vector3(1, 1, 1));

  // Get rotation in Euler angles from the rotation matrix
  const euler = new Euler().setFromQuaternion(rotationQuaternion);

  return (
    <>
      <line position={position.toArray()} rotation={euler.toArray()}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, 0, 0.35, 0.35, -1])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
        <Sphere args={[0.05, 16, 16]} />
      </line>
      <line position={position.toArray()} rotation={euler.toArray()}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, 0, 0.35, -0.35, -1])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
      <line position={position.toArray()} rotation={euler.toArray()}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, 0, -0.35, 0.35, -1])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
      <line position={position.toArray()} rotation={euler.toArray()}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, 0, -0.35, -0.35, -1])}
            itemSize={3}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
      <line position={position.toArray()} rotation={euler.toArray()}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={
              new Float32Array([
                0.35, -0.35, -1, 0.35, 0.35, -1, -0.35, 0.35, -1, -0.35, -0.35,
                -1, 0.35, -0.35, -1,
              ])
            }
            itemSize={3}
            count={5}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} />
      </line>
    </>
  );
  // return (
  //   <>
  //     <mesh
  //       position={position.toArray()}
  //       rotation={euler.toArray()} // 쿼터니언을 받지 않는다
  //     >
  //       <tetrahedronGeometry args={[0.5]} /> {/* Radius 0.5 */}
  //       <meshStandardMaterial color={color} />
  //       <Sphere args={[0.2, 16, 16]} />
  //     </mesh>
  //   </>
  // );
}

const EditorCanvas = ({
  users,
  onCameraChange,
}: {
  users: {
    camera: Matrix4;
    name: string;
    color: string;
    id: string;
  }[];
  onCameraChange: OrbitControlsProps["onChange"];
}) => {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      {users.map((user) => {
        return (
          <LineFromMatrix
            matrix={user.camera}
            color={user.color}
            key={user.id}
          ></LineFromMatrix>
        );
      })}
      {/* basic cube */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
      <OrbitControls onChange={onCameraChange} />
      {/* <Stats /> */}
    </Canvas>
  );
};

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
