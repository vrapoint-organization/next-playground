import { editorParticipantAtom } from "@/src/jotai/editor";
import styled from "@emotion/styled";
import { useAtomValue } from "jotai";

function RightPanel() {
  const participants = useAtomValue(editorParticipantAtom);
  return (
    <Container>
      <div>
        <div>온라인 유저목록</div>
        {participants.map((p, i) => {
          return (
            <div
              key={`online-user-${p.uid}`}
              style={{ paddingLeft: 8, boxSizing: "border-box" }}
            >
              <div>이름 : {p.name}</div>
              <div>아이디 : {p.uid}</div>
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
