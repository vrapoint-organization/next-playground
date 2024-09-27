import type { Matrix4 } from "three";

export interface UserCamera {
  id: string;
  name: string;
  color: string;
  camera: Matrix4;
}

export interface CameraAtomType {
  showCameras?: boolean;
  cameras: UserCamera[];
}

export interface EditorUserAtomType {
  id: string;
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
