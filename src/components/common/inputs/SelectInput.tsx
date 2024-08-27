import React, { useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

type ItemType = {
  name: string;
  value: string;
};

interface SelectInputProps {
  value: string;
  items: ItemType[];
}

const SelectInput: React.FC<SelectInputProps> = ({ value, items }) => {
  const [age, setAge] = React.useState("");

  useEffect(() => {
    setAge(value);
  }, [value]);

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <Select value={age} displayEmpty onChange={handleChange}>
      {items &&
        items.map((child) => {
          return (
            <MenuItem key={`selectKey_${child.value}`} value={child.value}>
              {child.name}
            </MenuItem>
          );
        })}
    </Select>
  );
};

export default SelectInput;
