import { editorCamerasAtom, editorModelData } from "@/src/jotai/editor";
import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import ObjectViewer from "../ObjectViewer";
import { Matrix4, Quaternion, Vector3 } from "three";
import NodeTree from "../NodeTree";
import { threeToRootNode } from "@/src/scripts/VNode";

function LeftPanel() {
  const cameras = useAtomValue(editorCamerasAtom);
  //   console.log({ cameras });
  // console.log("LeftPanel");
  const node = useAtomValue(editorModelData);
  console.log({ leftpanel: node });

  return (
    <Container>
      {/* LeftPanel */}
      <NodeTree node={node ? threeToRootNode(node) : null}></NodeTree>
      <div>
        {cameras.cameras.map((camera) => {
          // console.log("LeftPanelData:", { camera, mat: camera.camera });
          const pos = new Vector3();
          camera.camera.decompose(pos, new Quaternion(), new Vector3());
          return (
            <div key={camera.id}>
              {camera.id} :<div>X:[{pos.x}]</div>
              <div>Y:[{pos.y}]</div>
              <div>Z:[{pos.z}]</div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default LeftPanel;

const Container = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  bottom: 20px;
  width: 200px;
  background-color: #d0d0d0;
  z-index: 100;
`;
