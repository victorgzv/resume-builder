import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { TemplateFetchingStateType } from "../../../stateMachines/templatesState";

import { STATE as TEMPLATES_STATE } from "../../../stateMachines/templatesState";
import { Template } from "../../../types/Template";

type TemplateSelectorProps = {
  templatesState: TemplateFetchingStateType;
  templatesRetry: () => void;
  selectedTemplateId: string;
  onSelectTemplate: (template: Template) => void;
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templatesState,
  templatesRetry,
  selectedTemplateId,
  onSelectTemplate,
}) => {
  const { templates = [] } = templatesState?.data || {};

  if (templatesState.state === TEMPLATES_STATE.LOADING) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (templatesState.state === TEMPLATES_STATE.ERROR) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        Error fetching templates.
        <Button variant="contained" onClick={templatesRetry} sx={{ ml: 2 }}>
          Try again
        </Button>
      </Box>
    );
  }

  if (templates?.length === 0) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          No templates available yet. Please create one first.
        </Typography>
      </Box>
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="template-select-label">Select Template</InputLabel>
      <Select
        labelId="template-select-label"
        id="template-select"
        value={selectedTemplateId || ""}
        label="Select Template"
        onChange={(e) => {
          const selected = templates.find((t) => t.id === e.target.value);
          if (selected) {
            onSelectTemplate(selected);
          }
        }}
      >
        {templates?.map((template) => (
          <MenuItem key={template.id} value={template.id}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
