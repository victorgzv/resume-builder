import React, { useCallback, useState, useReducer } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import useGetTemplates from "./customHooks/useGetTemplates";
import { ACTION as TEMPLATES_ACTION } from "./stateMachines/templatesState";
import {
  reducer as resumeReducer,
  createInitialResumeState,
} from "./stateMachines/resumeEditorState";
import type { ResumeEditorActionType } from "./stateMachines/resumeEditorState";
import TemplateBuilder from "./components/Templates/TemplateBuilder";
import ResumeBuilder from "./components/Resumes/ResumeBuilder";
import { Template } from "./types/Template";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

type Props = {
  baseUrl: string;
};

const ResumeManagement = ({ baseUrl }: Props) => {
  const [tabValue, setTabValue] = useState(0);
  const [resumeState, resumeSend] = useReducer(
    resumeReducer,
    createInitialResumeState()
  );

  const {
    send: templatesSend,
    state: templatesState,
    refetch: templatesRetry,
  } = useGetTemplates({ baseUrl });

  const onCreateTemplate = useCallback(
    (template: Template) => {
      templatesSend({
        type: TEMPLATES_ACTION.ADD_TEMPLATE,
        template,
      });
    },
    [templatesSend]
  );

  const onUpdateTemplate = useCallback(
    (template: Template) => {
      templatesSend({
        type: TEMPLATES_ACTION.EDIT_TEMPLATE,
        template,
      });
    },
    [templatesSend]
  );

  const onDeleteTemplate = useCallback(
    (templateId: string) => {
      templatesSend({
        type: TEMPLATES_ACTION.DELETE_TEMPLATE,
        templateId,
      });
    },
    [templatesSend]
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleResumeAction = (action: ResumeEditorActionType) => {
    resumeSend(action);
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" gutterBottom>
          Resume Management
        </Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="resume management tabs"
        >
          <Tab label="Template Builder" />
          <Tab label="Resume Builder" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <TemplateBuilder
          templatesState={templatesState}
          templatesRetry={templatesRetry}
          baseUrl={baseUrl}
          onAddTemplate={onCreateTemplate}
          onUpdateTemplate={onUpdateTemplate}
          onDeleteTemplate={onDeleteTemplate}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ResumeBuilder
          resumeState={resumeState}
          onResumeAction={handleResumeAction}
          templatesState={templatesState}
          templatesRetry={templatesRetry}
          baseUrl={baseUrl}
        />
      </TabPanel>
    </Box>
  );
};

export default ResumeManagement;
