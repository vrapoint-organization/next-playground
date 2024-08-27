import React from "react";
import { FlexBetween } from "../../style/Style";

interface ModalHeader {
  title: string;
  onClose?: () => void;
}

const ModalHeader: React.FC<ModalHeader> = ({ title, onClose }) => {
  return (
    <div style={{ width: "100%" }}>
      <FlexBetween>
        {title}
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (onClose) {
              onClose();
            }
          }}
        >
          x
        </div>
      </FlexBetween>
    </div>
  );
};

export default ModalHeader;
