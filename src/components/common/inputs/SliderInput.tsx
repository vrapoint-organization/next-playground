import Slider from "@mui/material/Slider";
import React, { useEffect, useState } from "react";

interface SliderInputProps {
  value: number;
  min: number;
  max: number;
  step: number;
}
const SliderInput: React.FC<SliderInputProps> = ({ value, min, max, step }) => {
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (value) {
      setSliderValue(value);
    }
  }, [value]);
  const onChangeValue = (targetValue: string) => {
    setSliderValue(Number(targetValue));
  };

  return (
    <Slider
      value={sliderValue}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const target = e.target as HTMLInputElement;
        if (target) {
          onChangeValue(target.value);
        }
      }}
      valueLabelDisplay="auto"
      aria-labelledby="non-linear-slider"
    />
  );
};

export default SliderInput;
