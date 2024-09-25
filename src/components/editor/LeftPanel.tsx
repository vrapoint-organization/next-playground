import { camerasAtom, editorStore } from "@/src/jotai/editor";
import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import ObjectViewer from "../ObjectViewer";
import { Matrix4, Quaternion, Vector3 } from "three";

function LeftPanel() {
  const cameras = useAtomValue(camerasAtom);
  console.log({ cameras });

  return (
    <Container>
      LeftPanel
      <div>
        {cameras.cameras.map((camera) => {
          //   console.log({ camera, mat: camera.camera });
          const pos = new Vector3();
          new Matrix4()
            .fromArray(camera.matrix)
            .decompose(pos, new Quaternion(), new Vector3());
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
