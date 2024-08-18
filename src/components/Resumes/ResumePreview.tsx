import React, { useMemo } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  Grid,
  Typography,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import type { Template } from "../../types/Template";
import type { ResumeEditorStateType } from "../../stateMachines/resumeEditorState";
import SkillRating from "./SkillRating";

type ResumePreviewProps = {
  resumeState: ResumeEditorStateType;
  resumeRef: React.RefObject<HTMLDivElement>;
  templates?: Template[];
};

// Create a light theme to always display the preview in light mode
const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export const ResumePreview: React.FC<ResumePreviewProps> = React.memo(
  ({ resumeState, resumeRef, templates }) => {
    const { selectedTemplateId, personalInfo, experiences, education, skills } =
      resumeState;

    const selectedTemplate = templates?.find(
      (template: Template) => template.id === selectedTemplateId
    );

    const horizontalMargin = selectedTemplate?.layout?.margins?.x;
    const verticalMargin = selectedTemplate?.layout?.margins?.y;

    const styleObject = useMemo(
      () => ({
        color: "#000000",
        lineHeight: "1.5",
        padding: `${verticalMargin}px ${horizontalMargin}px`,
      }),
      [horizontalMargin, verticalMargin]
    );

    const sectionHeaderStyle = useMemo(
      () => ({
        color: selectedTemplate?.color || "#000000",
        borderBottom: selectedTemplate?.layout?.showDividers
          ? `2px solid ${selectedTemplate?.color || "#000000"}`
          : "none",
        paddingBottom: "2px",
        fontSize: selectedTemplate?.fontSize
          ? `${selectedTemplate.fontSize}px`
          : "16px",
        fontFamily: selectedTemplate?.fontFamily || "Arial, sans-serif",
      }),
      [selectedTemplate]
    );

    const contentStyle = {
      wordWrap: "break-word",
      overflowWrap: "break-word",
    };

    const headerAlignment = () => {
      switch (selectedTemplate?.layout?.headerStyle) {
        case "centered":
          return "center";
        case "rightAligned":
          return "flex-end";
        case "leftAligned":
        default:
          return "flex-start";
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <Card
          elevation={3}
          sx={{ maxWidth: 800, margin: "auto", marginTop: 2, marginBottom: 2 }}
        >
          <CardContent>
            <Box
              ref={resumeRef}
              sx={{
                height: "100vh",
                width: "100%",
                position: "relative",
                overflow: "hidden",
              }}
              style={styleObject}
            >
              {selectedTemplate?.watermark && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50%",
                    height: "50%",
                    backgroundImage: `url(${selectedTemplate.watermark})`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: selectedTemplate?.watermarkOpacity,
                    zIndex: 0,
                  }}
                />
              )}
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Grid container spacing={2}>
                  {/* Header Section */}
                  <Grid
                    container
                    spacing={1}
                    direction={{ xs: "column", sm: "row" }}
                    sx={{
                      m: 1,
                    }}
                  >
                    <Grid
                      item
                      sm={3}
                      md={4}
                      container
                      justifyContent={headerAlignment}
                      alignItems="center"
                    >
                      {personalInfo?.profilePicture && (
                        <Avatar
                          src={personalInfo?.profilePicture}
                          alt="Profile Picture"
                          sx={{
                            width: { xs: 60, sm: 80, md: 80, lg: 120 },
                            height: { xs: 60, sm: 80, md: 80, lg: 120 },
                          }}
                        />
                      )}
                    </Grid>
                    <Grid
                      item
                      sm={9}
                      md={8}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: headerAlignment,
                      }}
                    >
                      <Box>
                        <Typography variant="h6">
                          {personalInfo.firstName} {personalInfo.lastName}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {personalInfo.email && (
                            <Box display="flex" alignItems="center">
                              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="caption">
                                {personalInfo.email}
                              </Typography>
                            </Box>
                          )}
                          {personalInfo.phoneNumber && (
                            <Box display="flex" alignItems="center">
                              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="caption">
                                {personalInfo.phoneNumber}
                              </Typography>
                            </Box>
                          )}
                          {personalInfo.address && (
                            <Box display="flex" alignItems="center">
                              <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="caption">
                                {personalInfo.address}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* About Me Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      style={sectionHeaderStyle}
                      gutterBottom
                    >
                      About Me
                    </Typography>
                    <Typography variant="body2" style={contentStyle}>
                      {personalInfo.description}
                    </Typography>
                  </Grid>

                  {/* Experience Section */}
                  <Grid item xs={16}>
                    <Typography
                      variant="h6"
                      style={sectionHeaderStyle}
                      gutterBottom
                    >
                      Experience
                    </Typography>
                    {experiences.map((exp, index) => (
                      <Box key={index} mb={2}>
                        {exp.title && (
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            {exp.title} at {exp.company}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {exp.startDate && exp.startDate}
                          {exp.startDate && !exp.endDate && " - Present"}
                          {exp.endDate && ` - ${exp.endDate}`}
                          {exp.location && ` | ${exp.location}`}
                        </Typography>
                        <Typography variant="body2" style={contentStyle}>
                          {exp.description}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>

                  {/* Education Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      style={sectionHeaderStyle}
                      gutterBottom
                    >
                      Education
                    </Typography>
                    {education.map((edu, index) => (
                      <Box key={index} mb={2}>
                        {edu.degree && (
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            {edu.degree} in {edu.major}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {edu.startDate && edu.startDate}
                          {edu.startDate && !edu.endDate && " - Present"}
                          {edu.endDate && ` - ${edu.endDate}`}
                          {edu.university && ` | ${edu.university}`}
                          {edu.location && `, ${edu.location}`}
                        </Typography>
                        <Typography variant="body2" style={contentStyle}>
                          {edu.description}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>

                  {/* Skills Section */}
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      style={sectionHeaderStyle}
                      gutterBottom
                    >
                      Skills
                    </Typography>
                    <SkillRating
                      skills={skills}
                      color={selectedTemplate?.color || "primary.main"}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </ThemeProvider>
    );
  }
);
