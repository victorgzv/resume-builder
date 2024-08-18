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

// Font size to size down the font for the preview
const getRelativeFontSize = (fontSize: string) => {
  const fontSizeNumber = parseInt(fontSize) - 2;
  return fontSizeNumber.toString();
};

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
    ? `${getRelativeFontSize(template.fontSize)}px`
    : "14px";

  console.log("template in TemplatePreview: ", template);

  const margins = template.layout?.margins || {
    x: 0,
    y: 0,
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
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "50%",
                height: "50%",
                opacity: template?.watermarkOpacity || 0.3,
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
              padding: `${margins.y}px ${margins.x}px`,
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
            <StyledTypography
              variant="h6"
              gutterBottom
              templateFont={templateFont}
              templateFontSize={templateFontSize}
              templateColor={dividerColor}
            >
              About me
            </StyledTypography>
            {areDividersEnabled && (
              <Divider sx={{ borderColor: dividerColor, borderWidth: "2px" }} />
            )}
            <PlaceholderText width="100%" />
            <PlaceholderText width="90%" />
            <StyledTypography
              variant="h6"
              gutterBottom
              templateFont={templateFont}
              templateFontSize={templateFontSize}
              templateColor={dividerColor}
            >
              Work Experience
            </StyledTypography>
            {areDividersEnabled && (
              <Divider sx={{ borderColor: dividerColor, borderWidth: "2px" }} />
            )}

            <PlaceholderText width="100%" />
            <PlaceholderText width="90%" />
            <PlaceholderText width="95%" />

            <StyledTypography
              variant="h6"
              gutterBottom
              templateFont={templateFont}
              templateFontSize={templateFontSize}
              templateColor={dividerColor}
            >
              Education
            </StyledTypography>
            {areDividersEnabled && (
              <Divider sx={{ borderColor: dividerColor, borderWidth: "2px" }} />
            )}
            <PlaceholderText width="100%" />
            <PlaceholderText width="90%" />
            <PlaceholderText width="95%" />

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
              <Divider sx={{ borderColor: dividerColor, borderWidth: "2px" }} />
            )}
            <PlaceholderText width="95%" />
            <PlaceholderText width="100%" />
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};
