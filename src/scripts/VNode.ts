import * as THREE from "three";

export type DataNode = {
  parentId: string | null;
  id: string;
  children: DataNode[];
  data: any | null;
  type:
    | "root"
    | "mesh"
    | "ambientlight"
    | "geometry"
    | "material"
    | "image"
    | "texture"
    | "group"
    | "undefined";

  name?: string;
  hash?: string;
  //   parentId?: string;
  updatedAt?: number;

  option?: {
    optionId: string;
    index: number;
  };
};

const iterateNode = (node: DataNode, callback: (node: DataNode) => void) => {
  callback(node);
  node.children.forEach((child) => iterateNode(child, callback));
};

const totalNodeCount = (inputNode: DataNode): number => {
  let count = 1;
  iterateNode(inputNode, (node) => {
    count += 1;
  });
  return count;
};

const nodeCountByType = (inputNode: DataNode): { [key: string]: number } => {
  const retval: { [key: string]: number } = {
    empty: 0,
  };
  iterateNode(inputNode, (node) => {
    if (node.data?.type) {
      if (retval[node.data.type]) {
        retval[node.data.type] += 1;
      } else {
        retval[node.data.type] = 1;
      }
    } else {
      retval.empty += 1;
    }
  });
  return retval;
};

export type NodeAnalysis = {
  totalNodeCount: number;
  nodeCountByType: {
    [key: string]: number;
  };
  meshes: DataNode[] | undefined;
};

export const findByType = (
  root: DataNode,
  type: DataNode["type"]
): DataNode[] | undefined => {
  const retval = [] as DataNode[];
  iterateNode(root, (node) => {
    if (node.type === type) {
      retval.push(node);
    }
  });
  if (retval.length === 0) {
    return undefined;
  }
  return retval;
};

export const findMeshesFromNode = (root: DataNode): DataNode[] => {
  const retval: DataNode[] = [];
  iterateNode(root, (node) => {
    if (node.type === "mesh") {
      retval.push(node);
    }
  });
  return retval;
};

export const analyzeNode = (root: DataNode): NodeAnalysis => {
  const retval: NodeAnalysis = {
    totalNodeCount: totalNodeCount(root),
    nodeCountByType: nodeCountByType(root),
    meshes: findByType(root, "mesh"),
  };

  return retval;
};

export const threeToRootNode = (
  sceneOrObj: THREE.Object3D | THREE.SceneJSON,
  additionalNodes?: DataNode[]
): DataNode => {
  //   const loader = new THREE.ObjectLoader();
  // loader.load()
  const obj =
    sceneOrObj instanceof THREE.Scene ? sceneOrObj.toJSON() : sceneOrObj;
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
    //@ts-ignore
    dataPart[key] = copied[key];
    //@ts-ignore
    delete copied[key];
  });

  // #2. scene meta
  //@ts-ignore
  const metaPart = copied.metadata;

  // #3. object data part
  //@ts-ignore
  const objectPart = copied.object;

  // 1차적으로 분해 완료
  const decomposed = {
    object: objectPart,
    meta: metaPart,
    data: dataPart,
  };

  //   console.log(decomposed.object.children);
  //   decomposed.object.children
  const root: DataNode = {
    parentId: null,
    id: "root",
    children: [],
    data: decomposed.data, // 루트에다가 데이터를 담는다
    type: "root",
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
      type: "geometry",
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
      type: "image",
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
      type: "texture",
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
      type: "material",
    } as DataNode;

    if (material.map) {
      retval.children.push(createTextureNode(material.map, material.uuid));
    }
    return retval;
  };

  const addToNode = (parentNode: DataNode, srcThreejsChildren: any[]) => {
    srcThreejsChildren.forEach((child) => {
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
        // const thisId = mesh.uuid;
        //@ts-ignore
        const thisId = mesh.userData.nodeId;
        const meshNode = {
          parentId: parentNode.id,
          data: null,
          id: thisId,
          children: [
            createMaterialNode(mesh.material, thisId),
            createGeometryNode(mesh.geometry, thisId),
          ],
          type: "mesh",
        } as DataNode;
        parentNode.children.push(meshNode);
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
          parentId: parentNode.id,
          id: ambientLight.uuid,
          children: [],
          data: ambientLight,
          type: "ambientlight",
        };
        parentNode.children.push(lightNode);
        //   console.log({ ambientLight });
      } else if (child.type === "Group") {
        const groupNode: DataNode = {
          parentId: parentNode.id,
          id: child.uuid,
          children: [],
          data: child,
          type: "group",
        };
        addToNode(groupNode, child.children);
        parentNode.children.push(groupNode);
      }
    });
  };

  decomposed.object.children?.forEach((child: any) => {
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
        type: "mesh",
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
        type: "ambientlight",
      };
      root.children.push(lightNode);
      //   console.log({ ambientLight });
    } else if (child.type === "Group") {
    }
  });

  return root;
};

export const nodeIdToThreeId = (
  node: DataNode,
  nodeId: string
): number | undefined => {
  let retval: number | undefined = undefined;
  iterateNode(node, (n) => {
    if (retval) {
      //early return
      return;
    }
    if (n.id === nodeId) {
      //@ts-ignore
      retval = n.id;
    }
  });
  return retval;
};
