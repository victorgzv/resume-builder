import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TemplateFetchingStateType } from "../../stateMachines/templatesState";
import { Template } from "../../types/Template";
import { TemplateList } from "./TemplateList";
import { TemplateEditor } from "./TemplateEditor";
import { TemplatePreview } from "./TemplatePreview";

import useSaveTemplate from "../../customHooks/useSaveTemplate";
import useDeleteTemplate from "../../customHooks/useDeleteTemplate";

const TemplateBuilderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "90vh",
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    width: "200px",
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: "none",
    paddingRight: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: 0,
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  [theme.breakpoints.up("md")]: {
    flexDirection: "row",
  },
}));

const EditorContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    flex: 1,
    marginRight: theme.spacing(2),
    marginBottom: 0,
  },
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  [theme.breakpoints.up("md")]: {
    flex: 1,
  },
}));

const ScrollablePreviewContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));

const EmptyStateContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
});

type TemplateBuilderProps = {
  baseUrl: string;
  templatesState: TemplateFetchingStateType;
  templatesRetry: () => void;
  onAddTemplate: (template: Template) => void;
  onUpdateTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: string) => void;
};

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  baseUrl,
  templatesState,
  onAddTemplate,
  onUpdateTemplate,
  templatesRetry,
  onDeleteTemplate: handleDelete,
}) => {
  const { templates = [] } = templatesState.data || {};

  const [currentTemplate, setCurrentTemplate] =
    useState<Partial<Template> | null>(null);

  const handleCloseEditor = () => {
    setCurrentTemplate(null);
  };

  const onSaveTemplate = useSaveTemplate({ baseUrl });
  const onDeleteTemplate = useDeleteTemplate({
    baseUrl,
    onSuccess: handleDelete,
    expandedTemplateId: currentTemplate?.id,
    onCloseEditor: handleCloseEditor,
  });

  const handleSaveTemplate = () => {
    const updatedTemplate = {
      ...currentTemplate,
      name: currentTemplate?.name,
      description: currentTemplate?.description,
      fontFamily: currentTemplate?.fontFamily || "Arial, sans-serif",
      fontSize: currentTemplate?.fontSize || "11",
      color: currentTemplate?.color || "#000000",
      layout: {
        showDividers: true,
        margins: {
          x: 0,
          y: 0,
        },
        headerStyle: "default",
        ...currentTemplate?.layout,
      },
    };

    if (currentTemplate?.id) {
      onSaveTemplate(updatedTemplate as Template, onUpdateTemplate);
    } else {
      onSaveTemplate(updatedTemplate as Template, onAddTemplate);
      handleCloseEditor();
    }
  };

  const handleNewTemplate = () => {
    setCurrentTemplate({
      name: "",
      description: "",
      fontFamily: "Arial, sans-serif",
      fontSize: "12",
      color: "#000000",
    });
  };

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate({ ...template });
  };

  const handleTemplateChange = (updatedTemplate: Partial<Template>) => {
    setCurrentTemplate((prev) => ({ ...prev, ...updatedTemplate }));
  };

  return (
    <TemplateBuilderContainer>
      <SidebarContainer>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Templates
        </Typography>
        <TemplateList
          templates={templates}
          templatesRetry={templatesRetry}
          templatesState={templatesState.state}
          onEditTemplate={handleEditTemplate}
          onDeleteTemplate={onDeleteTemplate}
          handleNewTemplate={handleNewTemplate}
          selectedTemplateId={currentTemplate?.id}
        />
      </SidebarContainer>
      <ContentContainer>
        {currentTemplate ? (
          <>
            <EditorContainer>
              <TemplateEditor
                template={currentTemplate}
                onTemplateChange={handleTemplateChange}
                onSave={handleSaveTemplate}
                onCancel={handleCloseEditor}
              />
            </EditorContainer>
            <PreviewContainer>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <ScrollablePreviewContainer>
                <TemplatePreview template={currentTemplate} />
              </ScrollablePreviewContainer>
            </PreviewContainer>
          </>
        ) : (
          <EmptyStateContainer>
            <Typography variant="h6" color="text.secondary">
              Select a template to edit or create a new one
            </Typography>
          </EmptyStateContainer>
        )}
      </ContentContainer>
    </TemplateBuilderContainer>
  );
};

export default TemplateBuilder;
