import { Canvas } from "@react-three/fiber";

import type { EditorSocketExports } from "@/src/hooks/useEditorSocket";
import {
  editorCamerasAtom,
  editorReviewAtom,
  editorUserCameraInfo,
  editorUserCameraMatrix,
} from "@/src/jotai/editor";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import { Camera, Euler, Matrix4, Quaternion, Vector3 } from "three";

export type EditorCanvasProps = {
  userId: string;
  socketExports: EditorSocketExports;
};

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

// 캔버스로부터 WriteonlyAtom이 업데이트되면 서버로 값들을 보낸다
const useUpdateWriteonlyAtoms = (
  props: EditorCanvasProps & {
    myCameraRef: React.MutableRefObject<Camera>;
  }
) => {
  const { userId, socketExports, myCameraRef } = props;
  const { publishData, publishFlow } = socketExports;
  // const cameraInfo = useAtomValue(editorUserCameraMatrix);
  const cameraInfo = useAtomValue(editorUserCameraInfo);
  const _setUserCameraMatrix = useSetAtom(editorUserCameraMatrix);
  const _setUserCameraInfo = useSetAtom(editorUserCameraInfo);
  const setUserCameraMatrix = (matrix: Matrix4) => {
    _setUserCameraMatrix(matrix);
    _setUserCameraInfo({ updatedAt: Date.now() });
  };

  // console.log({ writeonlyUserCamera });
  const lastSent = useRef(0);

  useEffect(() => {
    // console.log({ uefwriteonlyUserCamera: writeonlyUserCamera });

    const now = Date.now();
    const canSend = now - lastSent.current > 100;
    if (canSend) {
      lastSent.current = now;
      const matrix = myCameraRef.current.matrix;
      console.log("Here");
      publishFlow({
        type: "CAMERA",
        data: {
          id: userId,
          matrix: matrix.toArray(),
        },
      });
    }
  }, [cameraInfo.updatedAt]);

  return {
    setUserCameraMatrix,
  };
};

const useReadonlyAtoms = () => {
  const userCameraMatrix = useAtomValue(editorUserCameraMatrix);

  // useEffect(() => {
  //   console.log("userCameraInfo:", userCameraInfo.updatedAt);
  // }, [userCameraInfo]);

  return {
    // myCamera,
    myCameraMatrix: userCameraMatrix,
  };
};

const CameraController = (props: EditorCanvasProps) => {
  const rootCamera = useThree((state) => state.camera);
  const myCameraRef = useRef<Camera>(rootCamera);

  const { setUserCameraMatrix } = useUpdateWriteonlyAtoms({
    ...props,
    myCameraRef,
  });
  const { myCameraMatrix } = useReadonlyAtoms();
  // console.log({ rootCamera });
  // console.log({ myCamera, rootCamera });
  useEffect(() => {
    rootCamera.applyMatrix4(myCameraMatrix);
  }, [myCameraMatrix]);

  useEffect(() => {}, []);

  return (
    <OrbitControls
      camera={rootCamera}
      onChange={(e) => {
        if (!e) {
          return;
        }
        const matrix = e.target.object.matrix;
        const position = new Vector3();
        matrix.decompose(position, new Quaternion(), new Vector3());
        // console.log({ position: position.z });
        setUserCameraMatrix(matrix);
      }}
    />
  );
};

// 밖에서 넣어주는 데이터로 그림만 그리는 컴포넌트
const EditorCanvasRenderer = (props: EditorCanvasProps) => {
  const cameraAtom = useAtomValue(editorCamerasAtom);
  const reviewAtom = useAtomValue(editorReviewAtom);

  return (
    <>
      {cameraAtom.cameras.map((camera) => {
        return (
          <LineFromMatrix
            matrix={camera.camera}
            color={camera.color}
            key={camera.id}
          ></LineFromMatrix>
        );
      })}
      {reviewAtom.reviews.map((review) => {
        return (
          <>
            <Text
              key={review.shortUuid}
              position={[
                review.position.x,
                review.position.y,
                review.position.z,
              ]}
              scale={[0.1, 0.1, 0.1]}
              color="black"
              // show text on the right side
              anchorX="center"
              anchorY="middle"
            >
              {review.shortUuid}의 리뷰
            </Text>
            <mesh
              position={[
                review.position.x,
                review.position.y,
                review.position.z,
              ]}
            >
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshStandardMaterial color="blue" />
            </mesh>
          </>
        );
      })}
      {/* basic cube */}
      <mesh position={new Vector3(0, -1, 0)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
      <ambientLight />
      {/* <directionalLight position={[0, 0, 5]} color="red" /> */}
      <CameraController {...props}></CameraController>
      {/* <Stats /> */}
    </>
  );
};

// <EditorCanvas> : 렌더러 + 데이터 핸들링
// 그림은 EditorCanvasRenderer에서만 그리고
// 여기서는 데이터를 주고 받는 역할까지 담당한다.
// ex. 카메라 포지션 변경 시 WS 퍼블리시, 셀렉트 시 WS 퍼블리시 등
// 참고 : 직접적으로 sub된 데이터를 핸들링하는 파트는 useEditorSocket에서만 할 것
const EditorCanvas = (props: EditorCanvasProps) => {
  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      <EditorCanvasRenderer
        {...props}
        // onCameraChange={functions.onCameraChange}
      ></EditorCanvasRenderer>
    </Canvas>
  );
};

export default EditorCanvas;
