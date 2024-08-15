import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Slider,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Template } from "../../types/Template";
import { FontFamilySelector } from "./FontFamilySelector";

interface TemplateEditorProps {
  template: Partial<Template>;
  onTemplateChange: (template: Partial<Template>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ScrolleableContainer = styled(Box)({
  padding: 16,
  overflowY: "auto",
  maxHeight: "calc(100vh - 150px)",
});

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onTemplateChange,
  onSave,
  onCancel,
}) => {
  const [layoutExpanded, setLayoutExpanded] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const validateName = (): boolean => {
    if (!template?.name || template?.name.trim() === "") {
      setNameError("A name is required");
      return false;
    }
    setNameError(null);
    return true;
  };

  const handleSave = () => {
    if (validateName()) {
      onSave();
    }
  };

  useEffect(() => {
    // Check if the template has any layout settings
    const hasLayoutSettings =
      template.layout &&
      (template.layout.headerStyle !== "default" ||
        template.layout.footerStyle !== "default" ||
        Object.values(template.layout.margins || {}).some(
          (value) => value !== 20
        ));

    setLayoutExpanded(hasLayoutSettings);
  }, [template]);

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onTemplateChange({ watermark: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpacityChange = (event: Event, value: number | number[]) => {
    if (Array.isArray(value)) {
      value = value[0];
    }
    onTemplateChange({ watermarkOpacity: value });
  };

  const handleMarginChange =
    (margin: string) => (event: Event, value: number | number[]) => {
      const newValue = Array.isArray(value) ? value[0] : value;
      const margins = template.layout?.margins || {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      };
      onTemplateChange({
        layout: {
          ...template.layout,
          margins: { ...margins, [margin]: newValue },
        },
      });
    };

  const handleDividerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTemplateChange({
      layout: {
        ...template.layout,
        showDividers: e.target.checked,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {template?.id ? "Edit Template" : "Create New Template"}
      </Typography>
      <ScrolleableContainer>
        <TextField
          fullWidth
          label="Template Name"
          value={template.name || ""}
          onChange={(e) => onTemplateChange({ name: e.target.value })}
          margin="normal"
          inputProps={{ maxLength: 30 }}
          error={!!nameError}
          helperText={nameError}
          required
        />
        <TextField
          fullWidth
          label="Template Description"
          value={template.description || ""}
          onChange={(e) => onTemplateChange({ description: e.target.value })}
          margin="normal"
          inputProps={{ maxLength: 45 }}
        />
        <FontFamilySelector
          template={template}
          onTemplateChange={onTemplateChange}
        />
        <TextField
          fullWidth
          label="Section Font Size"
          type="number"
          value={template.fontSize || "11"}
          placeholder="11"
          onChange={(e) => onTemplateChange({ fontSize: e.target.value })}
          margin="normal"
          InputProps={{ inputProps: { min: 11, max: 16 } }}
        />
        <TextField
          fullWidth
          label="Color"
          type="color"
          value={template.color || "#000000"}
          onChange={(e) => onTemplateChange({ color: e.target.value })}
          margin="normal"
        />
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography variant="body1">Watermark</Typography>
          <Button variant="contained" component="label">
            Upload
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleWatermarkChange}
            />
          </Button>
          {template.watermark && (
            <Button
              variant="contained"
              onClick={() => onTemplateChange({ watermark: "" })}
            >
              Remove
            </Button>
          )}
        </Box>
        {template.watermark && (
          <>
            <Box mt={1}>
              <Typography gutterBottom>Opacity</Typography>
              <Slider
                data-testid="opacity-slider"
                value={template.watermarkOpacity || 0.3}
                onChange={handleOpacityChange}
                aria-labelledby="watermark-opacity-slider"
                min={0.1}
                max={0.9}
                step={0.01}
              />
            </Box>
          </>
        )}
        <Accordion
          expanded={layoutExpanded}
          onChange={() => setLayoutExpanded(!layoutExpanded)}
          sx={{ mt: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="layout-settings-content"
            id="layout-settings-header"
          >
            <Typography>Layout Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              sx={{ mb: 2 }}
              control={
                <Switch
                  checked={template.layout?.showDividers ?? true}
                  onChange={handleDividerToggle}
                  name="showDividers"
                />
              }
              label="Show Dividers"
            />
            <FormControl fullWidth>
              <InputLabel>Header Alignment</InputLabel>
              <Select
                label="Header Alignment"
                value={template.layout?.headerStyle || "default"}
                onChange={(e) =>
                  onTemplateChange({
                    layout: { ...template.layout, headerStyle: e.target.value },
                  })
                }
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="centered">Centered</MenuItem>
                <MenuItem value="leftAligned">Left Aligned</MenuItem>
                <MenuItem value="rightAligned">Right Aligned</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Margins (px)
            </Typography>
            {["top", "bottom", "right", "left"].map((margin) => (
              <Box key={margin}>
                <Typography gutterBottom>
                  {margin.charAt(0).toUpperCase() + margin.slice(1)} Margin
                </Typography>
                <Slider
                  data-testid={`${margin}-margin-slider`}
                  value={template?.layout?.margins?.[margin] || 20}
                  onChange={handleMarginChange(margin)}
                  aria-labelledby={`${margin}-margin-slider`}
                  min={20}
                  max={50}
                  step={1}
                />
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      </ScrolleableContainer>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          gap: 2,
        }}
      >
        <Button variant="contained" onClick={handleSave}>
          {template?.id ? "Update Template" : "Save Template"}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
