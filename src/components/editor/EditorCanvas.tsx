import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  BoxGeometry,
  Camera,
  Euler,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from "three";

import type { EditorSocketExports } from "@/src/hooks/useEditorSocket";
import {
  editorParticipantAtom,
  editorModelData,
  editorModelDataModified,
  editorReviewAtom,
  editorSceneDataUpdated,
  editorStatus,
  editorUserCameraInfo,
  editorUserCameraMatrix,
  editorUserSelectedObject,
} from "@/src/jotai/editor";
import { analyzeNode, DataNode } from "@/src/scripts/VNode";
import { ParticipantState } from "@/types/EditorType";

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

// 캔버스로부터 WriteonlyAtom이 업데이트되면 서버로 값들을 보낸다
const useUpdateWriteonlyAtoms = (
  props: EditorCanvasProps & {
    myCameraRef: React.MutableRefObject<Camera>;
  }
) => {
  const { userId, socketExports, myCameraRef } = props;
  const { publishData } = socketExports;
  // const cameraInfo = useAtomValue(editorUserCameraMatrix);
  const cameraInfo = useAtomValue(editorUserCameraInfo);
  const _setUserCameraMatrix = useSetAtom(editorUserCameraMatrix);
  const _setUserCameraInfo = useSetAtom(editorUserCameraInfo);
  const setUserCameraMatrix = (matrix: Matrix4) => {
    // TODO : 매트릭스와 인포가 동시에 바뀔거라는 보장이 없다
    // 그런데 매트릭스와 인포를 하나의 아톰에서 관리하게되면 매트릭스가 계속 바뀌어서
    // 캔버스의 카메라가 날뛰게 됨
    _setUserCameraMatrix(matrix);
    _setUserCameraInfo({ updatedAt: Date.now() });
  };
  const setUserSelectedObject = useSetAtom(editorUserSelectedObject);

  // console.log({ writeonlyUserCamera });
  const lastSent = useRef(0);

  // 카메라 정보가 업데이트되면 서버로 보낸다
  useEffect(() => {
    const now = Date.now();
    const canSend = now - lastSent.current > 100;
    type StateSendData = {
      cameraInfo: {
        matrix: number[];
      };
      selectedInfo: {
        nodeId?: string;
      };
    };

    if (canSend) {
      lastSent.current = now;
      const matrix = myCameraRef.current.matrix;
      console.log("Here");
      publishData({
        type: "USER_STATE",
        data: {
          cameraInfo: {
            matrix: matrix.toArray(),
          },
          selectedInfo: {
            nodeId: undefined,
          },
        } as StateSendData,
      });
    }
  }, [cameraInfo.updatedAt]);

  return {
    setUserCameraMatrix,
    setUserSelectedObject,
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

  // useEffect(() => {}, []);

  useEffect(() => {
    setUserCameraMatrix(rootCamera.matrix);
  }, []);

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

const SingleSelectBox = (props: {
  objectUuid?: string | null;
  color?: string;
  opacity?: number;
  scaleFactor?: number;
}) => {
  const { scene } = useThree();
  if (!props.objectUuid) {
    return null;
  }

  const {
    objectUuid,
    color: inputColor,
    opacity: inputOpacity,
    scaleFactor: inputScaleFactor,
  } = props;

  // default values
  const color = inputColor ?? "ivory";
  const opacity = inputOpacity ?? 0.5;
  const scaleFactor = inputScaleFactor ?? 1.15;

  // 바운딩박스 계산
  const obj = scene.getObjectByProperty("uuid", objectUuid);

  if (!obj) {
    return null;
  }
  (obj as Mesh).geometry.computeBoundingBox();
  const selectBox = (obj as Mesh).geometry.boundingBox!;
  const position = obj.position.clone();

  return (
    <mesh
      scale={new Vector3(scaleFactor, scaleFactor, scaleFactor)}
      position={position}
    >
      <boxGeometry
        args={[
          selectBox.max.x - selectBox.min.x,
          selectBox.max.y - selectBox.min.y,
          selectBox.max.z - selectBox.min.z,
        ]}
      />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );

  return;
};

const UserSelectBox = () => {
  const userSelectedObject = useAtomValue(editorUserSelectedObject);
  const modifiedModelData = useAtomValue(editorSceneDataUpdated);
  const prevModifiedModelData = useRef<{
    id: string | string[];
    updatedAt: number;
  } | null>(null);

  const drawUserSelectBox: boolean = (() => {
    if (!userSelectedObject) {
      return false;
    }

    const modelHasChanged = (() => {
      //바뀌었는지 체크
      if (!prevModifiedModelData.current) {
        return true;
      }

      if (!modifiedModelData) {
        return false;
      }

      if (
        prevModifiedModelData.current.updatedAt > modifiedModelData.updatedAt
      ) {
        return false;
      }

      if (Array.isArray(prevModifiedModelData.current?.id)) {
        return prevModifiedModelData.current.id.every((id) => {
          return !modifiedModelData?.id.includes(id);
        });
      }
      return prevModifiedModelData.current.id !== modifiedModelData?.id;
    })();
    prevModifiedModelData.current = modifiedModelData;

    // 셀렉트는 유지이지만 모델이 변경되었을 때
    if (modelHasChanged && modifiedModelData) {
      // 변화된 모델 데이터가 셀렉트 된 오브젝트와 일치하지 않으면 null
      if (Array.isArray(modifiedModelData)) {
        if (!modifiedModelData.includes(userSelectedObject.id)) {
          return false;
        }
      }

      if (
        typeof modifiedModelData === "string" &&
        modifiedModelData !== userSelectedObject.id
      ) {
        return false;
      }
    }

    return true;
  })();

  if (!drawUserSelectBox) {
    return null;
  }

  return (
    <SingleSelectBox objectUuid={userSelectedObject?.id}></SingleSelectBox>
  );
};

const ParticipantCamera = (participant: ParticipantState) => {
  const { camera, color, name, uid, sessionId } = participant;
  return <LineFromMatrix matrix={camera.matrix} color={color}></LineFromMatrix>;
};

const ParticipantSelectBox = (participant: ParticipantState) => {
  const { selectedObject, color, name, uid, sessionId } = participant;
  const { objectUuid } = selectedObject;

  const modifiedModelData = useAtomValue(editorSceneDataUpdated);
  const prevModifiedModelData = useRef<{
    id: string | string[];
    updatedAt: number;
  } | null>(null);

  const drawUserSelectBox: boolean = (() => {
    if (!objectUuid) {
      return false;
    }

    const modelHasChanged = (() => {
      //바뀌었는지 체크
      if (!prevModifiedModelData.current) {
        return true;
      }

      if (!modifiedModelData) {
        return false;
      }

      if (
        prevModifiedModelData.current.updatedAt > modifiedModelData.updatedAt
      ) {
        return false;
      }

      if (Array.isArray(prevModifiedModelData.current?.id)) {
        return prevModifiedModelData.current.id.every((id) => {
          return !modifiedModelData?.id.includes(id);
        });
      }
      return prevModifiedModelData.current.id !== modifiedModelData?.id;
    })();
    prevModifiedModelData.current = modifiedModelData;

    // 셀렉트는 유지이지만 모델이 변경되었을 때
    if (modelHasChanged && modifiedModelData) {
      // 변화된 모델 데이터가 셀렉트 된 오브젝트와 일치하지 않으면 null
      if (Array.isArray(modifiedModelData)) {
        if (!modifiedModelData.includes(objectUuid)) {
          return false;
        }
      }

      if (
        typeof modifiedModelData === "string" &&
        modifiedModelData !== objectUuid
      ) {
        return false;
      }
    }

    return true;
  })();

  if (!drawUserSelectBox) {
    return null;
  }

  return (
    <SingleSelectBox objectUuid={objectUuid} color={color}></SingleSelectBox>
  );
};

const OtherUserCamera = () => {
  const participants = useAtomValue(editorParticipantAtom);
  console.log({ participants });

  return (
    <>
      {participants.map((participant) => (
        <ParticipantCamera
          {...participant}
          key={`camera-of-${participant.sessionId}`}
        ></ParticipantCamera>
      ))}
    </>
  );
};

const OtherUserSelect = () => {
  const participants = useAtomValue(editorParticipantAtom);

  return (
    <>
      {participants.map((participant) => (
        <ParticipantSelectBox
          {...participant}
          key={`select-of-${participant.sessionId}`}
        ></ParticipantSelectBox>
      ))}
    </>
  );
};

const UserReviews = () => {
  const reviewAtom = useAtomValue(editorReviewAtom);
  return (
    <>
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
    </>
  );
};

const TheModel = () => {
  const model = useAtomValue(editorModelData);
  const modelDataModified = useAtomValue(editorModelDataModified);
  const setEditorSceneDataUpdated = useSetAtom(editorSceneDataUpdated);
  const { scene } = useThree();
  // console.log({ Themodel: model });
  if (!model) {
    return null;
  }

  useEffect(() => {
    // const copied = model.children.map((child) => child.clone());
    // scene.add(...copied);
    // return () => {
    //   scene.remove(...copied);
    // };
    const models = model.children;
    const updatedIds = models.map((model) => model.uuid);
    scene.add(...models);
    setEditorSceneDataUpdated(updatedIds);
    return () => {
      scene.remove(...models);
    };
  }, [model]);

  useEffect(() => {
    if (!modelDataModified) {
      return;
    }
    const { id, data: modified } = modelDataModified;
    const { action, value } = modified;
    const target = scene.getObjectByProperty("uuid", id);
    if (!target) {
      console.error("Target not found", { id });
      return;
    }
    if (action === "position") {
      target.position.set(value[0], value[1], value[2]);
      setEditorSceneDataUpdated({
        id,
        updatedAt: Date.now(),
      });
      // target.updateMatrix();
    } else {
      console.log("Unknown action", { modelDataModified });
    }
  }, [modelDataModified]);

  return null;
};

const Hotspots = () => {
  return null;
};

// 밖에서 넣어주는 데이터로 그림만 그리는 컴포넌트
const EditorCanvasRenderer = (props: EditorCanvasProps) => {
  // const setUserSelectedObject = useSetAtom(editorUserSelectedObject);
  const { scene } = useThree();
  // console.log({ scene });

  // const [userSelectBox, setUserSelectBox] = useState<React.ReactNode | null>(
  //   null
  // );

  return (
    <>
      <OtherUserCamera></OtherUserCamera>
      <OtherUserSelect></OtherUserSelect>
      <UserReviews></UserReviews>
      <Hotspots></Hotspots>
      <CameraController {...props}></CameraController>
      <ambientLight />
      <UserSelectBox></UserSelectBox>
      <TheModel></TheModel>
    </>
  );
};

// <EditorCanvas> : 렌더러 + 데이터 핸들링
// 그림은 EditorCanvasRenderer에서만 그리고
// 여기서는 데이터를 주고 받는 역할까지 담당한다.
// ex. 카메라 포지션 변경 시 WS 퍼블리시, 셀렉트 시 WS 퍼블리시 등
// 참고 : 직접적으로 sub된 데이터를 핸들링하는 파트는 useEditorSocket에서만 할 것
const EditorCanvas = (props: EditorCanvasProps) => {
  const setEditorUserSelectedObject = useSetAtom(editorUserSelectedObject);

  const setModel = useSetAtom(editorModelData);
  const setStatus = useSetAtom(editorStatus);

  useEffect(() => {
    if (!true) {
      setTimeout(() => {
        setStatus("success");
      }, 1000);
    } else {
      const loader = new THREE.ObjectLoader();
      loader.load("/node/twoboxthree.json", (obj) => {
        // console.log({ setModel: obj });
        setModel(obj);
        setStatus("success");
      });
      // fetch("/node/twoboxnode.json")
      //   .then((res) => res.json())
      //   .then((data: DataNode) => {
      //     console.log("twobox", data);
      //     setModel(data);
      //   });
    }
  }, []);

  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => {
        setEditorUserSelectedObject(null);
      }}
    >
      <EditorCanvasRenderer
        {...props}
        // onCameraChange={functions.onCameraChange}
      ></EditorCanvasRenderer>
    </Canvas>
  );
};

export default EditorCanvas;
