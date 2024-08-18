import React from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  MobileStepper,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import type { TemplateFetchingStateType } from "../../stateMachines/templatesState";
import type {
  ResumeEditorStateType,
  ResumeEditorActionType,
} from "../../stateMachines/resumeEditorState";

import { ACTION, STATE } from "../../stateMachines/resumeEditorState";
import { TemplateSelector } from "./form/TemplateSelector";
import { PersonalInfo } from "./form/PersonalInfo";
import { Experience } from "./form/Experience";
import { Education } from "./form/Education";
import { Skills } from "./form/Skills";

const steps = [
  STATE.SELECT_TEMPLATE,
  STATE.PERSONAL_INFO,
  STATE.EXPERIENCE,
  STATE.EDUCATION,
  STATE.SKILLS,
];

const stepLabels = {
  [STATE.SELECT_TEMPLATE]: "Template",
  [STATE.PERSONAL_INFO]: "Profile",
  [STATE.EXPERIENCE]: "Experience",
  [STATE.EDUCATION]: "Education",
  [STATE.SKILLS]: "Skills",
};

type Props = {
  templatesState: TemplateFetchingStateType;
  templatesRetry: () => void;
  resumeState: ResumeEditorStateType;
  onResumeAction: (action: ResumeEditorActionType) => void;
};

export const ResumeEditor: React.FC<Props> = ({
  templatesState,
  templatesRetry,
  resumeState,
  onResumeAction,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNext = () => {
    onResumeAction({ type: ACTION.NEXT });
  };

  const handleBack = () => {
    onResumeAction({ type: ACTION.PREVIOUS });
  };

  const getStepContent = (step: string) => {
    switch (step) {
      case STATE.SELECT_TEMPLATE:
        return (
          <TemplateSelector
            templatesState={templatesState}
            templatesRetry={templatesRetry}
            selectedTemplateId={resumeState?.selectedTemplateId || ""}
            onSelectTemplate={(template) =>
              onResumeAction({ type: ACTION.SELECT_TEMPLATE, template })
            }
          />
        );
      case STATE.PERSONAL_INFO:
        return (
          <PersonalInfo
            personalInfo={resumeState.personalInfo}
            onUpdate={(field, value) =>
              onResumeAction({
                type: ACTION.UPDATE_PERSONAL_INFO,
                personalInfo: { [field]: value },
              })
            }
          />
        );
      case STATE.EXPERIENCE:
        return (
          <Experience
            experiences={resumeState.experiences}
            onAdd={() => onResumeAction({ type: ACTION.ADD_EXPERIENCE })}
            onUpdate={(index, field, value) =>
              onResumeAction({
                type: ACTION.UPDATE_EXPERIENCE,
                experience: { [field]: value },
                experienceIndex: index,
              })
            }
            onRemove={(index) =>
              onResumeAction({
                type: ACTION.REMOVE_EXPERIENCE,
                experienceIndex: index,
              })
            }
          />
        );
      case STATE.EDUCATION:
        return (
          <Education
            education={resumeState.education}
            onAdd={() => onResumeAction({ type: ACTION.ADD_EDUCATION })}
            onUpdate={(index, field, value) =>
              onResumeAction({
                type: ACTION.UPDATE_EDUCATION,
                education: { [field]: value },
                educationIndex: index,
              })
            }
            onRemove={(index) =>
              onResumeAction({
                type: ACTION.REMOVE_EDUCATION,
                educationIndex: index,
              })
            }
          />
        );
      case STATE.SKILLS:
        return (
          <Skills
            skills={resumeState.skills}
            onAdd={() => onResumeAction({ type: ACTION.ADD_SKILL })}
            onUpdate={(index, field, value) =>
              onResumeAction({
                type: ACTION.UPDATE_SKILL,
                skill: { [field]: value },
                skillIndex: index,
              })
            }
            onRemove={(index) =>
              onResumeAction({ type: ACTION.REMOVE_SKILL, skillIndex: index })
            }
          />
        );
      default:
        return "Unknown step";
    }
  };

  const activeStep = steps.indexOf(resumeState?.state);

  return (
    <Box sx={{ width: "100%" }}>
      {isMobile ? (
        <MobileStepper
          variant="text"
          steps={steps.length}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={
                resumeState.state === STATE.SELECT_TEMPLATE &&
                !resumeState.selectedTemplateId
              }
            >
              {resumeState.state !== STATE.SKILLS && "Next"}
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={resumeState.state === STATE.SELECT_TEMPLATE}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      ) : (
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>{stepLabels[step]}</StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
      <Box sx={{ mt: 2, mb: 1 }}>
        <React.Fragment>
          {!isMobile && (
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2, mb: 2 }}>
              <Button
                color="inherit"
                disabled={resumeState.state === STATE.SELECT_TEMPLATE}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={handleNext}
                disabled={
                  resumeState.state === STATE.SELECT_TEMPLATE &&
                  !resumeState.selectedTemplateId
                }
              >
                {resumeState.state !== STATE.SKILLS && "Next"}
              </Button>
            </Box>
          )}
          {getStepContent(resumeState.state)}
        </React.Fragment>
      </Box>
    </Box>
  );
};
