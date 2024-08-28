import React from "react";
import { FlexEnd } from "../../style/Style";
import ButtonComponent from "../button/Button";

interface ModalFooterProps {
  cancel: string;
  submit: string;
  onCancel: () => void;
  onSubmit: () => void;
  onClose?: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  cancel,
  submit,
  onCancel,
  onClose,
  onSubmit,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <FlexEnd>
        <ButtonComponent
          type="outlined"
          color="error"
          title={cancel}
          customStyle={{ marginRight: "5px" }}
          onClick={() => {
            onCancel();
            if (onClose) {
              onClose();
            }
          }}
        />
        <ButtonComponent
          type="contained"
          color="primary"
          title={submit}
          onClick={() => {
            onSubmit();
            if (onClose) {
              onClose();
            }
          }}
        />
      </FlexEnd>
    </div>
  );
};

export default ModalFooter;
