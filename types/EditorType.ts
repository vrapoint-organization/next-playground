import type { Matrix4 } from "three";

export interface UserCamera {
  id: string;
  name: string;
  color: string;
  camera: Matrix4;
}

export interface CameraAtomType {
  showCameras: boolean;
  cameras: UserCamera[];
}

export interface EditorUserAtomType {
  id: string;
  name?: string;
}
