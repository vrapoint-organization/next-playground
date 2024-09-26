import { CameraAtomType, EditorUserAtomType } from "@/types/EditorType";
import { atom, createStore } from "jotai";

export const editorStore = createStore();

export const defaultCameraAtomValue: CameraAtomType = {
  showCameras: true,
  cameras: [],
};

// 다른 이용자들의 카메라 정보
export const camerasAtom = atom<CameraAtomType>({ ...defaultCameraAtomValue });

export const editorUserAtom = atom<EditorUserAtomType>();
