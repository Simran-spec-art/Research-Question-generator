
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  setValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({ label, value, setValue, min = 0, max = 100, step = 1 }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-1 accent-primary"
      />
    </div>
  );
};
