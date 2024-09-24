// import { useSocket } from "@/src/scripts/SocketProvider";
// import useEditorSocket from "@/src/scripts/useEditorSocket";
// import { GetServerSidePropsContext } from "next";
// import Link from "next/link";

// function Editor({ myId, projectId }: { myId: string; projectId: string }) {
//   const {
//     isConnected,
//     subscribeEditor,
//     editorSubscribed,
//     publishEditor,
//     editorData,
//   } = useEditorSocket();

//   return (
//     <div>
//       Editor Inside - My Id : {myId}
//       <div>isConnected : {isConnected ? "true" : "false"}</div>
//       <button
//         onClick={() => {
//           subscribeEditor(projectId);
//         }}
//       >
//         Subscribe to {projectId}
//       </button>
//       <div>editorSubscribed: {editorSubscribed ? "true" : "false"}</div>
//       <div>
//         <button
//           onClick={() => {
//             publishEditor({ x: 100, y: 200 });
//           }}
//         >
//           Publish
//         </button>
//       </div>
//       <div>
//         {editorData.map((data, i) => (
//           <div key={i}>{JSON.stringify(data)}</div>
//         ))}
//       </div>
//       <Link href={`/editor`}>Back to editor main</Link>
//     </div>
//   );
// }

// export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
//   const { query } = ctx;
//   const { id: myId, projectId } = query;

//   return {
//     props: {
//       myId,
//       projectId,
//     },
//   };
// };

// export default Editor;

import { Canvas } from "@react-three/fiber";
import {
  Stats,
  OrbitControls,
  OrbitControlsProps,
  Sphere,
} from "@react-three/drei";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { useRef, useState } from "react";

const defaultUsers = [
  {
    camera: new Matrix4()
      .identity()
      .makeRotationFromEuler(new Euler(45, 0, 0))
      .makeTranslation(0, 0, 1),
    name: "user1",
    color: "#ff0000",
  },
  {
    camera: new Matrix4()
      .identity()
      .makeRotationFromEuler(new Euler(0, 45, 70))
      .makeTranslation(0, 0.5, 0),
    name: "user2",
    color: "#00ff00",
  },
];

export default function App() {
  const [users, setUsers] = useState([...defaultUsers]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div
        style={{
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
        </div>
      </div>
      <SharedCanvas users={users} onCameraChange={() => {}}></SharedCanvas>
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
    <line ref={theRef} position={position.toArray()} rotation={euler.toArray()}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array([0, 0, 0, 0, 0, 1])} // Start at (0,0,0) and go to (0,0,1)
          itemSize={3}
          count={2}
        />
      </bufferGeometry>
      <Sphere args={[0.2, 16, 16]} />
      <lineBasicMaterial color={color} />
    </line>
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
  }[];
  onCameraChange: OrbitControlsProps["onChange"];
}) => {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      {/* <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial />
      </mesh> */}
      {users.map((user) => {
        // draw tetrahedron with user's name on it

        return (
          // <mesh>
          //   <tetrahedronGeometry args={[2, 0]} />
          //   <meshPhongMaterial />
          //   <textGeometry args={[user.name]} />
          // </mesh>
          <LineFromMatrix
            matrix={user.camera}
            color={user.color}
          ></LineFromMatrix>
        );
      })}
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="red" />
      <OrbitControls onChange={onCameraChange} />
      {/* <Stats /> */}
    </Canvas>
  );
};
