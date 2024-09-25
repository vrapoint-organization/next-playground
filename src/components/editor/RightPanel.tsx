import styled from "@emotion/styled";

function RightPanel() {
  return <Container>RightPanel</Container>;
}

export default RightPanel;

const Container = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  bottom: 20px;
  width: 200px;
  background-color: #d0d0d0;
  z-index: 100;
`;
