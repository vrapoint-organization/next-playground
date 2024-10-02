import {
  CameraAtomType,
  EditorReviewAtomType,
  EditorUserAtomType,
} from "@/types/EditorType";
import {
  atom,
  createStore,
  PrimitiveAtom,
  SetStateAction,
  WritableAtom,
} from "jotai";
import { Matrix4, Object3D, Scene } from "three";
import type { DataNode } from "../scripts/VNode";
import { string } from "three/webgpu";

export const editorStore = createStore();

export const defaultCameraAtomValue: CameraAtomType = {
  showCameras: true,
  cameras: [],
};

// 다른 이용자들의 카메라 정보
// export const editorCamerasAtom = atom<CameraAtomType>({
//   ...defaultCameraAtomValue,
// });

export const editorUserAtom = atom<EditorUserAtomType>();

// 훅 내부가 아닌 일반 함수에서 전달받아서 사용하기 위헤 store.get
const _getEditorAtom = editorStore.get;
const _setEditorAtom = editorStore.set;

type AtomArgType<T> = T | ((prev: T) => T);

const _createAtomPair = <T = any>(
  initalValue?: T
): [
  WritableAtom<T, unknown[], unknown>,
  () => T | undefined,
  (arg: AtomArgType<T>) => void
] => {
  // @ts-ignore
  const theAtom = atom<T>(initalValue);
  return [
    theAtom,
    (() => _getEditorAtom(theAtom)) as () => T | undefined,
    ((arg: AtomArgType<T>) => _setEditorAtom(theAtom, arg)) as (
      arg: AtomArgType<T>
    ) => void,
  ];
};

export const [editorCamerasAtom, getEditorCamerasAtom, setEditorCamerasAtom] =
  _createAtomPair<CameraAtomType>({
    ...defaultCameraAtomValue,
  });

export const [editorReviewAtom, getEditorReviewAtom, setEditorReviewAtom] =
  _createAtomPair<EditorReviewAtomType>({ reviews: [] });

// export const getUser = () => {
//   return getEditorAtom(editorUserAtom);
// };

export const getEditorUserAtom = () => _getEditorAtom(editorUserAtom);
export const setEditorUserAtom = (arg: AtomArgType<EditorUserAtomType>) =>
  _setEditorAtom(editorUserAtom, arg);

////////////////////////////////////////////////////////////////////////

export type EditorUserCameraMatrixType = Matrix4;
export type EditorUserCameraInfoType = {
  // updatedBy: "mouse" | "nodeselect";
  updatedAt: number;
};
// three/drei 특성상 매트릭스의 객체가 변하지 않고 계속 재사용되므로
// 카메라의 RT매트릭스가 변경되어도 useEffect 등에서 잡을 수 없다
// 따라서 두 가지 아톰을 운용한다 :
//  - 카메라의 값을 가지는 아톰
//  - 메타정보를 가지는 아톰 : updatedAt
export const editorUserCameraMatrix = atom<Matrix4>(new Matrix4().identity());
export const editorUserCameraInfo = atom<EditorUserCameraInfoType>({
  updatedAt: 0,
});

export const editorUserSelectedObject = atom<DataNode | null>(null);

export type EditorStatus = "loading" | "failed" | "success" | "reconnecting";
export const editorStatus = atom<EditorStatus>("loading");

export const editorModelData = atom<Object3D | null>(null);

// WS에서 데이터를 받아서 EditorCanvas.TheModel에서 실제로 Scene에 데이터를 추가할 때 사용
// 실제 씬에 데이터를 업데이트 한 후 아래의 editorSceneDataUpdated에 업데이트 된 아이디를 전달
// * 중요!!
// 모델 데이터가 업데이트됐다고 바로 씬에 데이터가 업데이트되는 것이 아니므로
// TheModel이 아닌 다른 컴포넌트에서 씬의 업데이트를 감지할 때는 editorSceneDataUpdated를 사용해야함

export const editorModelDataModified = atom<{
  id: string;
  data: {
    action: "position" | "rotation";
    value: number[];
  };
  updatdAt: number;
} | null>(null);

export const editorSceneDataUpdated = atom<{
  id: string | string[];
  updatedAt: number;
} | null>(null);

export const editorNode = atom<DataNode | null>(null);
