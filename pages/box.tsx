import ObjectViewer from "@/src/components/ObjectViewer";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import Image from "next/image";

type DataNode = {
  parentId: string | null;
  id: string;
  children: DataNode[];
  data: any | null;

  name?: string;
  hash?: string;
  //   parentId?: string;
  updatedAt?: number;

  option?: {
    optionId: string;
    index: number;
  };
};

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

const threeToRootNode = (
  obj: THREE.SceneJSON,
  additionalNodes?: DataNode[]
): DataNode => {
  const loader = new THREE.ObjectLoader();
  // loader.load()
  const copied = structuredClone(obj);

  const datapartKeys = [
    "geometries",
    "materials",
    "textures",
    "images",
  ] as const;

  // #1. datapart
  const dataPart: any = {};
  datapartKeys.forEach((key) => {
    dataPart[key] = copied[key];
    delete copied[key];
  });

  // #2. scene meta
  const metaPart = copied.metadata;

  // #3. object data part
  const objectPart = copied.object;

  // 1차적으로 분해 완료
  const decomposed = {
    object: objectPart,
    meta: metaPart,
    data: dataPart,
  };

  console.log(decomposed.object.children);
  //   decomposed.object.children
  const root: DataNode = {
    parentId: null,
    id: "root1",
    children: [],
    data: null,
  };

  const createGeometryNode = (
    geometryUuid: string,
    parentId: string
  ): DataNode => {
    const geometry = decomposed.data.geometries.find(
      (geo: { uuid: string }) => geo.uuid === geometryUuid
    )!;
    // return {} as DataNode;
    return {
      id: geometry.uuid,
      parentId,
      children: [],
      data: geometry,
    } as DataNode;
  };

  const createImageNode = (imageUuid: string, parentId: string) => {
    const image = decomposed.data.images.find(
      (img: { uuid: string }) => img.uuid === imageUuid
    )!;
    return {
      id: image.uuid,
      parentId,
      children: [],
      data: image,
    } as DataNode;
  };

  const createTextureNode = (
    textureUuid: string,
    parentId: string
  ): DataNode => {
    const texture = decomposed.data.textures.find(
      (tex: { uuid: string }) => tex.uuid === textureUuid
    )!;

    const retval = {
      id: texture.uuid,
      parentId,
      children: [],
      data: texture,
    } as DataNode;

    if (texture.image) {
      retval.children.push(createImageNode(texture.image, texture.uuid));
    }

    return retval;
  };

  const createMaterialNode = (
    materialUuid: string,
    parentId: string
  ): DataNode => {
    const material = decomposed.data.materials.find(
      (mat: { uuid: string }) => mat.uuid === materialUuid
    )!;
    const retval = {
      // id:material.
      id: material.uuid,
      parentId,
      children: [],
      data: material,
    } as DataNode;

    if (material.map) {
      retval.children.push(createTextureNode(material.map, material.uuid));
    }
    return retval;
  };

  decomposed.object.children.forEach((child) => {
    if (child.type === "Mesh") {
      const mesh = child as {
        geometry: string;
        layers: number;
        material: string;
        matrix: number[];
        type: "Mesh";
        up: number[];
        uuid: string;
      };
      const thisId = mesh.uuid;
      const meshNode = {
        parentId: root.id,
        data: null,
        id: thisId,
        children: [
          createMaterialNode(mesh.material, thisId),
          createGeometryNode(mesh.geometry, thisId),
        ],
      } as DataNode;
      root.children.push(meshNode);
      //   console.log({ mesh });
    } else if (child.type === "AmbientLight") {
      const ambientLight = child as {
        color: number;
        intensity: number;
        layers: number;
        matrix: number[];
        type: "AmbientLight";
        up: number[];
        uuid: string;
      };
      const lightNode: DataNode = {
        parentId: root.id,
        id: ambientLight.uuid,
        children: [],
        data: ambientLight,
      };
      root.children.push(lightNode);
      //   console.log({ ambientLight });
    }
  });

  return root;
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
    // const a = document.createElement("a");
    // const blob = new Blob([rootString], { type: "application/json" });
    // const url = URL.createObjectURL(blob);
    // a.href = url;
    // a.download = "root.json";
    // a.click();
    // URL.revokeObjectURL(url);
  };

  useEffect(() => {
    speak();
  }, [doSpeak]);

  return (
    <>
      <mesh position={[0, 0, 0]}>
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
      <ambientLight intensity={0.5} />
      {/* <directionalLight position={[0, 0, 5]} color="red" /> */}
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
