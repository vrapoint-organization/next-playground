import React, { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";

const ariaLabel = { "aria-label": "description" };

interface TextFieldProps {
  value: string;
  placeholder: string;
  type?: string;
  onChange: (e: string) => void;
}

const TextInput: React.FC<TextFieldProps> = ({
  value,
  placeholder,
  type = "string",
  onChange,
}) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onChangeValue = (targetValue: string) => {
    setInputValue(targetValue);
    onChange(targetValue);
  };

  return (
    <OutlinedInput
      placeholder={placeholder}
      value={inputValue}
      type={type}
      onChange={(e) => {
        onChangeValue(e.target.value);
      }}
      sx={{ width: "100%", borderRadius: "15px" }}
      inputProps={ariaLabel}
    />
  );
};

export default TextInput;
