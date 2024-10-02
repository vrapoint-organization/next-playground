import ObjectViewer from "@/src/components/ObjectViewer";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Image from "next/image";
import { DataNode, threeToRootNode } from "@/src/scripts/VNode";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// type DataNode = {
//   parentId: string | null;
//   id: string;
//   children: DataNode[];
//   data: any | null;

//   name?: string;
//   hash?: string;
//   //   parentId?: string;
//   updatedAt?: number;

//   option?: {
//     optionId: string;
//     index: number;
//   };
// };

const typeMap: { [key in string]: any } = {
  Mesh: "메시",
  AmbientLight: "조명",
  BoxGeometry: "박스지오메트리",
  MeshPhongMaterial: "퐁머티리얼",
  1009: "텍스쳐",
};

const NodeTree = ({
  node,
  options: inputOptions,
}: {
  node: DataNode;
  options?: any;
}) => {
  const options = inputOptions || { depth: 0 };
  const childOption = { ...options, depth: options.depth + 1 };
  const type = node.data?.type;
  const name = type ? typeMap[type] : "노드";
  const isImage = ((node.data?.url ?? "") as string).startsWith("data:image");
  return (
    <div
      style={{ marginLeft: 5 + options.depth * 8 }}
      key={`${node.id}-nodecontainer`}
    >
      {isImage ? (
        <Image width={20} height={20} alt={node.id} src={node.data.url}></Image>
      ) : (
        <div>{name}</div>
      )}
      {node.children.map((child) => {
        return (
          <NodeTree
            key={`${child.id}-node`}
            node={child}
            options={childOption}
          ></NodeTree>
        );
      })}
    </div>
  );
};

const CanvasElements = ({ doSpeak, setRoot }) => {
  const { scene } = useThree();
  //   const colorMap = useLoader(TextureLoader, "/img/loginBg.png");
  const colorMap = useLoader(TextureLoader, "/img/logo.png");

  const speak = () => {
    const data = scene.toJSON();
    console.log(data);
    const root = threeToRootNode(data);
    console.log(root);
    setRoot(root);

    // const rootString = JSON.stringify(root);
    // console.log(rootString);
    // create link and download
    if (!true) {
      // 다운로드
      const a = document.createElement("a");
      const blob = new Blob([JSON.stringify(root)], {
        type: "application/json",
      });
      // const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = "twoboxnode.json";
      a.click();
      URL.revokeObjectURL(url);
    }

    if (!true) {
      // 다운로드
      const a = document.createElement("a");
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      // const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = "twoboxthree.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    speak();
  }, [doSpeak]);

  useEffect(() => {
    scene.children.forEach((child) => {
      if (child.type === "Mesh") {
        // console.log(child);
        (child as Mesh).geometry.computeBoundingBox();
        // console.log("Bounding Box:", (child as Mesh).geometry.boundingBox);
        console.log(child.position);
      }
    });
  }, []);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load("/model/Chair.glb", (data) => {
      scene.add(data.scene);
      speak();
    });
  }, []);

  return (
    <>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial map={colorMap}>
          {/* <texture col image={"/img/loginBg.png"}></texture> */}
        </meshPhongMaterial>
      </mesh>

      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color={"red"}>
          <texture
            image={"/img/loginBg.png"}
            wrapS={THREE.RepeatWrapping}
            wrapT={THREE.RepeatWrapping}
          ></texture>
        </meshPhongMaterial>
      </mesh>
      <ambientLight intensity={1.0} />
      <directionalLight position={[1, 1, 1]} color="white" />
      <OrbitControls></OrbitControls>
    </>
  );
};

export default function App() {
  const [doSpeak, setDoSpeak] = useState(0);
  const [root, setRoot] = useState<DataNode | null>(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          width: 400,
          backgroundColor: "#f0f0f0",
        }}
      >
        <button
          onClick={() => {
            setDoSpeak((prev) => prev + 1);
            // console.log("clicked, ", doSpeak);
          }}
        >
          Speak
        </button>
        {/* {root && <ObjectViewer objectData={root}></ObjectViewer>} */}
        {root && <NodeTree node={root}></NodeTree>}
      </div>
      <Canvas style={{ width: "100%", height: "100%" }}>
        <CanvasElements doSpeak={doSpeak} setRoot={setRoot} />
      </Canvas>
    </div>
  );
}
