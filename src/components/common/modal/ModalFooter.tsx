import React from "react";
import { FlexEnd } from "../../style/Style";
import SubmitButton from "../button/SubmitButton";

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
        <SubmitButton
          type="outlined"
          color="error"
          title={cancel}
          customStyle={{ marginRight: "5px" }}
          onClick={() => {
            onCancel();
            onClose();
          }}
        />
        <SubmitButton
          type="contained"
          color="primary"
          title={submit}
          onClick={() => {
            onSubmit();
            onClose();
          }}
        />
      </FlexEnd>
    </div>
  );
};

export default ModalFooter;
