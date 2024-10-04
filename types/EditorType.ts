import type { Matrix4 } from "three";

export interface UserCamera {
  id: string;
  name: string;
  color: string;
  camera: Matrix4;
}

export interface ParticipantState {
  name: string;
  sessionId: string;
  uid: string;
  color: string;
  camera: {
    show: boolean;
    matrix: Matrix4;
  } | null;
  selectedObject: {
    show: boolean;
    objectUuid: string | null;
  } | null;
}

export interface CameraAtomType {
  showCameras?: boolean;
  cameras: UserCamera[];
}

export interface EditorUserAtomType {
  id: string;
  sessionId: string;
  name?: string;
}

export interface EditorReviewAtomType {
  reviews: EditorReview[];
}

export interface DataSkeleton<T = any> {
  id: string;
  type: "REVIEW" | "ASSET";
  data: T | null;
  hash: string;
}

export interface EditorReview {
  done: boolean;
  position: { x: number; y: number; z: number };
  regDateTime: null;
  shortUuid: string;
  updatedDatetime: null;
  uuid: string;
}
