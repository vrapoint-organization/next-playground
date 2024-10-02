import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { useMemo, useState } from "react";
import { Camera, Matrix4 } from "three";

const CanvasElements = () => {
  const [camMatrix, setCamMatrix] = useState(new Matrix4().identity());
  const camera = useThree((state) => state.camera);
  camera.applyMatrix4(camMatrix);
  return (
    <>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <ambientLight />
      <OrbitControls
        camera={camera}
        onChange={(e) => {
          setCamMatrix(e.target.object.matrix);
        }}
      ></OrbitControls>
    </>
  );
};

function cameraatom() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <CanvasElements></CanvasElements>
      </Canvas>
    </div>
  );
}

export default cameraatom;
