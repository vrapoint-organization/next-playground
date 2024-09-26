import { CameraAtomType, EditorUserAtomType } from "@/types/EditorType";
import { atom, createStore } from "jotai";

export const editorStore = createStore();

export const defaultCameraAtomValue: CameraAtomType = {
  showCameras: true,
  cameras: [],
};

// 다른 이용자들의 카메라 정보
export const editorCamerasAtom = atom<CameraAtomType>({
  ...defaultCameraAtomValue,
});

export const editorUserAtom = atom<EditorUserAtomType>();

const _getEditorAtom = editorStore.get;
const _setEditorAtom = editorStore.set;

type AtomArgType<T> = T | ((prev: T) => T);
export const getEditorCamerasAtom = () => _getEditorAtom(editorCamerasAtom);
export const setEditorCamerasAtom = (arg: AtomArgType<CameraAtomType>) =>
  _setEditorAtom(editorCamerasAtom, arg);

// export const getUser = () => {
//   return getEditorAtom(editorUserAtom);
// };

export const getEditorUserAtom = () => _getEditorAtom(editorUserAtom);
export const setEditorUserAtom = (arg: AtomArgType<EditorUserAtomType>) =>
  _setEditorAtom(editorUserAtom, arg);
