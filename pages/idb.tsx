import React, { useEffect } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { set, get } from "idb-keyval";
import VTimer from "@/src/scripts/VTimer";

const Chair = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loadData = async () => {
      const data = {
        someData: 1,
        withArray: [1, 2, 3],
      };
      await set("data", data);
      return await get("data");
    };
    loadData().then(console.log);
    const loadModel = async () => {
      const timer = new VTimer().start();
      let model = await get("0725");
      timer.add("model get");
      if (!model) {
        timer.add("Fetch start");
        model = await fetch("/model/0725.glb").then((res) => res.blob());
        timer.add("Fetch end");
        await set("0725", model);
        timer.add("Chair set");
      }
      timer.add("Create URL start");
      const modelUrl = URL.createObjectURL(model);
      timer.add("Create URL end");
      timer.finish().print();
      return modelUrl;
    };

    loadModel().then((modelUrl: string) => {
      const loader = new GLTFLoader();
      loader.load(modelUrl, (loadedModel) => {
        console.log("Here", loadedModel);
        scene.add(loadedModel.scene);
        URL.revokeObjectURL(modelUrl);
      });
    });
  }, []);
  return <></>;
};

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <Chair></Chair>
        {/* <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshPhongMaterial />
        </mesh> */}
        <ambientLight intensity={0.1} />
        {/* <directionalLight position={[0, 0, 5]} color="red" /> */}
        <OrbitControls></OrbitControls>
      </Canvas>
    </div>
  );
}
