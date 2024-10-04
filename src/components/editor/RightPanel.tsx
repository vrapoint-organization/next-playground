import { editorParticipantAtom } from "@/src/jotai/editor";
import styled from "@emotion/styled";
import { useAtom, useAtomValue } from "jotai";

function RightPanel() {
  const [participants, setParticipants] = useAtom(editorParticipantAtom);
  return (
    <Container>
      <div>
        <div>온라인 유저목록</div>
        {participants.map((p, i) => {
          const showingCam = p.camera?.show;
          const showingSelect = p.selectedObject?.show;
          return (
            <div
              key={`online-user-${p.uid}`}
              style={{ paddingLeft: 8, boxSizing: "border-box" }}
            >
              <div style={{ display: "flex" }}>
                <div>이름 : {p.name}</div>
                <button
                  onClick={() => {
                    setParticipants((prev) => {
                      const copied = [...prev];
                      const cam = copied.find((el) => el.uid === p.uid)!.camera;
                      if (cam) {
                        cam.show = !showingCam;
                        return copied;
                      }
                      return prev;
                    });
                  }}
                >
                  {showingCam ? "카메라숨기기" : "카메라보이기"}
                </button>
                <button
                  onClick={() => {
                    setParticipants((prev) => {
                      const copied = [...prev];
                      const select = copied.find(
                        (el) => el.uid === p.uid
                      )!.selectedObject;
                      if (select) {
                        select.show = !showingSelect;
                        return copied;
                      }
                      return prev;
                    });
                  }}
                >
                  {showingSelect ? "선택숨기기" : "선택보이기"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default RightPanel;

const Container = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  bottom: 20px;
  width: 200px;
  background-color: #ededed;
  z-index: 100;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
`;
