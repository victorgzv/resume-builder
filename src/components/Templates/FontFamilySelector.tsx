import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Template } from "../../types/Template";
import { fontOptions } from "../../constants";

interface FontFamilySelectorProps {
  template: Partial<Template>;
  onTemplateChange: (updatedTemplate: Partial<Template>) => void;
}

export const FontFamilySelector: React.FC<FontFamilySelectorProps> = ({
  template,
  onTemplateChange,
}) => {
  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Section Font Family</InputLabel>
      <Select
        label="Section Font Family"
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
