import { camerasAtom } from "@/src/jotai/editor";
import ConcurrentFetch from "@/src/scripts/ConcurrentFetch";
import GlobalStore from "@/src/scripts/GlobalStore";
import { OrbitControls, OrbitControlsProps, Sphere } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";

function LineFromMatrix({ matrix, color }: { matrix: Matrix4; color: string }) {
  // const theRef = useRef();

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
        <Sphere args={[0.02, 16, 16]} />
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
  // myId: string,
  data: { id: string; matrix: number[] | Matrix4 }[]
) => {
  // console.log(data);
  return (
    data
      //   .filter((d) => d.id !== myId)
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
      })
  );
};

const EditorCanvas = ({
  onCameraChange,
}: {
  onCameraChange: OrbitControlsProps["onChange"];
}) => {
  const cameras = useAtomValue(camerasAtom);

  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      {cameras.cameras.map((camera) => {
        return (
          <LineFromMatrix
            matrix={camera.matrix}
            color={camera.color}
            key={camera.id}
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

export default EditorCanvas;
