import React from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
  styled,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Template } from "../../types/Template";

interface TemplatePreviewProps {
  template: Partial<Template>;
}

// create theme override so the preview is always in light mode
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const PlaceholderText: React.FC<{ width: string }> = ({ width }) => (
  <Box
    sx={{
      width,
      height: "1em",
      backgroundColor: "#e0e0e0",
      my: 1,
      borderRadius: 1,
    }}
  />
);

const StyledTypography = styled(Typography)<{
  templateFont: string;
  templateFontSize: string;
  templateColor: string;
}>(({ templateFont, templateFontSize, templateColor }) => ({
  fontFamily: templateFont,
  fontSize: templateFontSize,
  color: templateColor,
}));

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
}) => {
  const areDividersEnabled = template.layout?.showDividers ?? true;
  const dividerColor = template.color || "#000000";
  const templateFont = template.fontFamily || "Arial";
  const templateFontSize = template.fontSize
    ? `${template.fontSize}px`
    : "11px";

  const margins = template.layout?.margins || {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };
  const headerStyle = template.layout?.headerStyle || "default";

  const getHeaderAlignment = () => {
    switch (headerStyle) {
      case "centered":
        return "center";
      case "leftAligned":
        return "flex-start";
      case "rightAligned":
        return "flex-end";
      default:
        return "flex-start";
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Preview
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            m: { xs: 1, sm: 1.5, md: 2 },
            position: "relative",
            minHeight: { xs: "auto", sm: 500, md: 500 },
          }}
        >
          {template.watermark && (
            <Box
              component="img"
              src={template.watermark}
              alt="Watermark"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: template.watermarkOpacity,
                zIndex: 0,
              }}
            />
          )}
          <Box
            sx={{
              fontFamily: templateFont,
              fontSize: templateFontSize,
              position: "relative",
              zIndex: 1,
              height: "100%",
              padding: `${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: getHeaderAlignment(),
                justifyContent: getHeaderAlignment(),
                gap: 2,
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 60, sm: 70 },
                  height: { xs: 60, sm: 70 },
                  backgroundColor: "#bdbdbd",
                  mr: { xs: 0, sm: 2 },
                  mb: { xs: 2, sm: 0 },
                }}
              />
              <Box>
                <StyledTypography
                  variant="h6"
                  gutterBottom
                  templateFont={templateFont}
                  templateFontSize={templateFontSize}
                  templateColor={dividerColor}
                >
                  Profile
                </StyledTypography>
                <PlaceholderText width="100%" />
                <PlaceholderText width="85%" />
              </Box>
            </Box>

            <PlaceholderText width="100%" />
            <PlaceholderText width="90%" />
            {areDividersEnabled && (
              <Divider
                sx={{ my: 2, borderColor: dividerColor, borderWidth: "2px" }}
              />
            )}

            <StyledTypography
              variant="h6"
              gutterBottom
              templateFont={templateFont}
              templateFontSize={templateFontSize}
              templateColor={dividerColor}
            >
              Work Experience
            </StyledTypography>
            <PlaceholderText width="100%" />
            <PlaceholderText width="90%" />
            <PlaceholderText width="95%" />
            {areDividersEnabled && (
              <Divider
                sx={{ my: 2, borderColor: dividerColor, borderWidth: "2px" }}
              />
            )}

            <StyledTypography
              variant="h6"
              gutterBottom
              templateFont={templateFont}
              templateFontSize={templateFontSize}
              templateColor={dividerColor}
            >
              Education
            </StyledTypography>
            <PlaceholderText width="100%" />
            <PlaceholderText width="90%" />
            {areDividersEnabled && (
              <Divider
                sx={{ my: 2, borderColor: dividerColor, borderWidth: "2px" }}
              />
            )}

            <StyledTypography
              variant="h6"
              gutterBottom
              templateFont={templateFont}
              templateFontSize={templateFontSize}
              templateColor={dividerColor}
            >
              Skills
            </StyledTypography>
            {areDividersEnabled && (
              <Divider
                sx={{ my: 2, borderColor: dividerColor, borderWidth: "2px" }}
              />
            )}
            <PlaceholderText width="95%" />
            <PlaceholderText width="100%" />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
