import React, { useEffect, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";

const ariaLabel = { "aria-label": "description" };

interface TextFieldProps {
  value: string;
  onChange: (e: string) => void;
}

const TextInput: React.FC<TextFieldProps> = ({ value, onChange }) => {
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
      placeholder="Placeholder"
      value={inputValue}
      onChange={(e) => {
        onChangeValue(e.target.value);
      }}
      sx={{ width: "100%" }}
      inputProps={ariaLabel}
    />
  );
};

export default TextInput;
