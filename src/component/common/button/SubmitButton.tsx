import Button from "@mui/material/Button";
import { ButtonProps } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import React from "react";

interface SubmitButtonProps {
  title: string;
  color?: ButtonProps["color"];
  type?: ButtonProps["variant"];
  customStyle?: SxProps<Theme>;
  onClick: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  type,
  color,
  title,
  customStyle,
  onClick,
}) => {
  return (
    <Button color={color} variant={type} onClick={onClick} sx={customStyle}>
      {title}
    </Button>
  );
};

export default SubmitButton;
