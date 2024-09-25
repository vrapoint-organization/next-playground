import { Canvas } from "@react-three/fiber";
import { OrbitControls, OrbitControlsProps, Sphere } from "@react-three/drei";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { useEffect, useRef, useState } from "react";
import useEditorSocket from "@/src/scripts/useEditorSocket";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

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
  data: { id: string; matrix: number[] }[]
) => {
  // console.log(data);
  return data
    .filter((d) => d.id !== myId)
    .map((d) => {
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
  const {
    isConnected,
    subscribeEditor,
    editorSubscribed,
    publishEditor,
    editorData,
  } = useEditorSocket();
  const router = useRouter();

  const lastSent = useRef(0);

  useEffect(() => {
    const suc = subscribeEditor(projectId);
    if (!suc) {
      alert("subscribe 실패");
    }
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
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
          display: true ? "none" : "",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: "#999999",
          zIndex: 100,
        }}
      >
        ControlPanel
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => {
              setUsers((prev) => {
                const copied = [...prev];
                const prevcam = copied
                  .find((user) => user.name === "user1")!
                  .camera.clone();
                const prevPosition = new Vector3();
                prevcam.decompose(
                  prevPosition,
                  new Quaternion(),
                  new Vector3()
                );
                prevcam.makeTranslation(
                  prevPosition.x + 0.05,
                  prevPosition.y,
                  prevPosition.z
                );
                copied.find((user) => user.name === "user1")!.camera = prevcam;
                const printTrans = (mat: Matrix4, label?: string) => {
                  const pos = new Vector3();
                  mat.decompose(pos, new Quaternion(), new Vector3());
                  console.log(label ?? "", pos.toArray());
                };
                // printTrans(
                //   prev.find((user) => user.name === "user1")!.camera,
                //   "prevPosition"
                // );
                // printTrans(
                //   copied.find((user) => user.name === "user1")!.camera,
                //   "newPosition"
                // );
                return copied;
              });
            }}
          >
            Move User1
          </button>
          <button
            onClick={() => {
              setUsers((prev) => {
                const copied = [...prev];
                const prevcam = copied
                  .find((user) => user.name === "user2")!
                  .camera.clone();
                const prevPosition = new Vector3();
                prevcam.decompose(
                  prevPosition,
                  new Quaternion(),
                  new Vector3()
                );
                prevcam.makeTranslation(
                  prevPosition.x,
                  prevPosition.y + 0.05,
                  prevPosition.z
                );
                copied.find((user) => user.name === "user2")!.camera = prevcam;
                const printTrans = (mat: Matrix4, label?: string) => {
                  const pos = new Vector3();
                  mat.decompose(pos, new Quaternion(), new Vector3());
                  console.log(label ?? "", pos.toArray());
                };
                // printTrans(
                //   prev.find((user) => user.name === "user2")!.camera,
                //   "prevPosition"
                // );
                // printTrans(
                //   copied.find((user) => user.name === "user2")!.camera,
                //   "newPosition"
                // );
                return copied;
              });
            }}
          >
            Move User2
          </button>
          <button
            onClick={() => {
              subscribeEditor(projectId);
            }}
          >
            subscribeEditor {editorSubscribed ? "Subscribed" : ""}
          </button>
          {editorSubscribed && (
            <button
              onClick={() => {
                publishEditor({ x: 100, y: 200 });
              }}
            >
              Publish
            </button>
          )}
          {/* <ObjectViewer objectData={editorData}></ObjectViewer> */}
        </div>
      </div>
      <SharedCanvas
        users={refineEditorData(myId, editorData)}
        onCameraChange={(e) => {
          // const t = new Vector3();
          // e?.target.object.position
          // console.log(e?.target.object.position);
          const mat = e?.target.object.matrix.toArray();
          const now = Date.now();
          // const canSend = now - lastSent.current > 100;
          const canSend = true;
          if (canSend) {
            lastSent.current = now;
            publishEditor({
              id: myId,
              matrix: mat,
            });
          }
        }}
      ></SharedCanvas>
    </div>
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
      <line
        ref={theRef}
        position={position.toArray()}
        rotation={euler.toArray()}
      >
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
      <line
        ref={theRef}
        position={position.toArray()}
        rotation={euler.toArray()}
      >
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
      <line
        ref={theRef}
        position={position.toArray()}
        rotation={euler.toArray()}
      >
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
      <line
        ref={theRef}
        position={position.toArray()}
        rotation={euler.toArray()}
      >
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
      <line
        ref={theRef}
        position={position.toArray()}
        rotation={euler.toArray()}
      >
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
  //       ref={theRef}
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

const SharedCanvas = ({
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
