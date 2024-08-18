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
  Switch,
  Stepper,
  Step,
  StepButton,
  StepContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Template } from "../../types/Template";
import { FontFamilySelector } from "./FontFamilySelector";

interface TemplateEditorProps {
  template: Partial<Template>;
  onTemplateChange: (template: Partial<Template>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onTemplateChange,
  onSave,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [nameError, setNameError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!template.id) {
      setActiveStep(0);
    }
  }, [template.id]);

  const validateName = (): boolean => {
    if (!template?.name || template?.name.trim() === "") {
      setNameError("A name is required");
      return false;
    }
    setNameError(null);
    return true;
  };

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
    const newValue = Array.isArray(value) ? value[0] : value;
    onTemplateChange({ watermarkOpacity: newValue });
  };

  const handleMarginChange =
    (margin: string) => (event: Event, value: number | number[]) => {
      const newValue = Array.isArray(value) ? value[0] : value;
      const margins = template.layout?.margins || {
        x: 0,
        y: 0,
      };
      onTemplateChange({
        layout: {
          ...template?.layout,
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

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateName()) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: "Basic Settings",
      content: (
        <Box>
          <TextField
            fullWidth
            label="Template Name"
            value={template.name || ""}
            onChange={(e) => {
              onTemplateChange({ name: e.target.value });
              if (nameError) validateName();
            }}
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
            value={template.fontSize || "14"}
            placeholder="14"
            onChange={(e) => onTemplateChange({ fontSize: e.target.value })}
            margin="normal"
            InputProps={{ inputProps: { min: 14, max: 20 } }}
          />
          <TextField
            fullWidth
            label="Section Color"
            type="color"
            value={template.color || "#000000"}
            onChange={(e) => onTemplateChange({ color: e.target.value })}
            margin="normal"
          />
        </Box>
      ),
    },
    {
      label: "Layout Settings",
      content: (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={template.layout?.showDividers ?? true}
                onChange={handleDividerToggle}
                name="showDividers"
              />
            }
            label="Show Dividers"
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
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
          {["x", "y"].map((margin) => (
            <Box key={margin} sx={{ ml: 2 }}>
              <Typography gutterBottom>
                {margin === "x" ? "Horizontal" : "Vertical"} Margin
              </Typography>
              <Slider
                data-testid={`${margin}-margin-slider`}
                value={template?.layout?.margins?.[margin]}
                onChange={handleMarginChange(margin)}
                aria-labelledby={`${margin}-margin-slider`}
                min={20}
                max={50}
                step={1}
              />
            </Box>
          ))}
        </Box>
      ),
    },
    {
      label: "Watermark",
      content: (
        <Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Button variant="contained" component="label">
              Upload Image
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
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {template?.id ? "Edit Template" : "Create New Template"}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            onClick={activeStep === steps.length - 1 ? onSave : handleNext}
          >
            {activeStep === steps.length - 1 ? "Save" : "Next"}
          </Button>
          <Button size="small" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
      <Stepper
        activeStep={activeStep}
        orientation={isMobile ? "vertical" : "horizontal"}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton onClick={handleStep(index)}>{step.label}</StepButton>
            {isMobile && <StepContent>{step.content}</StepContent>}
          </Step>
        ))}
      </Stepper>
      {!isMobile && <Box sx={{ mt: 2 }}>{steps[activeStep].content}</Box>}
    </Box>
  );
};
