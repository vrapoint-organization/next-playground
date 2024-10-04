import Image from "next/image";
import type { DataNode } from "../scripts/VNode";
import {
  editorParticipantAtom,
  editorUserSelectedObjectAtom,
} from "../jotai/editor";
import { useAtom, useAtomValue } from "jotai";

const typeMap: { [key in DataNode["type"]]: any } = {
  ambientlight: "조명",
  mesh: "메시",
  material: "머티리얼",
  texture: "텍스쳐",
  geometry: "지오메트리",
  image: "이미지",
  root: "루트",
  group: "그룹",
  undefined: "노드",
};

export interface NodeTreeProps {
  node: DataNode | null;
  options?: any;
}

const RecursiveNodeTree = ({ node, options: inputOptions }: NodeTreeProps) => {
  const options = inputOptions || { depth: 0 };
  const childOption = { ...options, depth: options.depth + 1 };

  const [selected, setSelected] = useAtom(editorUserSelectedObjectAtom);
  const participant = useAtomValue(editorParticipantAtom);

  if (!node) {
    return null;
  }
  const otherSelected = participant.find(
    (p) => p.selectedObject?.objectUuid === node?.id
  );
  const type = node.type;
  const name = type ? typeMap[type] : "노드";
  // console.log({ type });
  const isImage = ((node.data?.url ?? "") as string).startsWith("data:image");

  if (!node) return null;
  return (
    <div
      style={{
        width: "100%",
        paddingLeft: 5 + options.depth * 8,
        color: selected?.id === node.id ? "blue" : "black",
        fontWeight: selected?.id === node.id ? "bold" : "normal",
        cursor: "pointer",
      }}
      key={`${node.id}-nodecontainer`}
      onClick={(e) => {
        e.stopPropagation();
        setSelected((prev) => {
          if (prev?.id === node.id) {
            return null;
          }
          console.log("Setting selected : ", node);
          return node;
        });
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>{name}</div>
        {otherSelected && (
          <div
            style={{
              color: otherSelected.color,
              fontSize: 14,
              textDecoration: "underline",
            }}
          >
            {otherSelected.name}
          </div>
        )}
        {isImage && (
          <Image
            width={20}
            height={20}
            alt={node.id}
            src={node.data.url}
          ></Image>
        )}
      </div>

      {node.children.map((child) => {
        return (
          <RecursiveNodeTree
            key={`${child.id}-node`}
            node={child}
            options={childOption}
          ></RecursiveNodeTree>
        );
      })}
    </div>
  );
};

const NodeTree = (props: NodeTreeProps) => {
  if (!props?.node) {
    return null;
  }

  // console.log("NodeTree : ", props?.node);

  return (
    <div style={{ width: "100%" }}>
      <RecursiveNodeTree {...props}></RecursiveNodeTree>
    </div>
  );
};
export default NodeTree;
