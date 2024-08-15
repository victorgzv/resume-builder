import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Template } from "../../types/Template";

interface FontFamilySelectorProps {
  template: Partial<Template>;
  onTemplateChange: (updatedTemplate: Partial<Template>) => void;
}

const fontOptions = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: '"Times New Roman", serif' },
  { name: "Courier", value: '"Courier New", monospace' },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Comic Sans", value: '"Comic Sans MS", cursive' },
  { name: "Euphemia", value: "Euphemia" },
];

export const FontFamilySelector: React.FC<FontFamilySelectorProps> = ({
  template,
  onTemplateChange,
}) => {
  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Font Family</InputLabel>
      <Select
        label="Font Family"
        value={template.fontFamily ?? fontOptions[0].value}
        onChange={(e) => onTemplateChange({ fontFamily: e.target.value })}
      >
        {fontOptions.map((fontOption) => (
          <MenuItem value={fontOption.value} key={fontOption.value}>
            {fontOption.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
