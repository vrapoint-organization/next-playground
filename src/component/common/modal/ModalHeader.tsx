import React from "react";
import { FlexBetween } from "../../style/Style";

interface ModalHeader {
  title: string;
}

const ModalHeader: React.FC<ModalHeader> = ({ title }) => {
  return (
    <div style={{ width: "100%" }}>
      <FlexBetween>
        {title}
        <div style={{ cursor: "pointer" }}>x</div>
      </FlexBetween>
    </div>
  );
};

export default ModalHeader;
