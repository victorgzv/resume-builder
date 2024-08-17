import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Template } from "../../types/Template";
import { TemplateList } from "./TemplateList";
import { TemplateEditor } from "./TemplateEditor";
import { TemplatePreview } from "./TemplatePreview";

import useSaveTemplate from "../../customHooks/useSaveTemplate";
import useDeleteTemplate from "../../customHooks/useDeleteTemplate";

const TemplateBuilderContainer = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "auto auto 1fr",
  gap: theme.spacing(2),
  height: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "200px 1fr 1fr",
    gridTemplateRows: "1fr",
    padding: theme.spacing(3),
  },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    borderRight: `1px solid ${theme.palette.divider}`,
    borderBottom: "none",
    paddingRight: theme.spacing(2),
  },
}));

const ContentContainer = styled(Box)({
  display: "contents",
});

const EmptyStateContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

type TemplateBuilderProps = {
  baseUrl: string;
  templatesState: any;
  templatesRetry: () => void;
  onAddTemplate: (template: Template) => void;
  onUpdateTemplate: (template: Template) => void;
  onDeleteTemplate: (templateId: string) => void;
};

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
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
    if (currentTemplate?.id) {
      onSaveTemplate(currentTemplate as Template, onUpdateTemplate);
    } else {
      const newTemplate = {
        ...currentTemplate,
        name: currentTemplate?.name,
        description: currentTemplate?.description,
        fontFamily: currentTemplate?.fontFamily || "Arial, sans-serif",
        fontSize: currentTemplate?.fontSize || "11",
        color: currentTemplate?.color || "#000000",
        ...(currentTemplate?.watermark && { watermarkOpacity: 0.3 }),
      };

      onSaveTemplate(newTemplate as Template, onAddTemplate);
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
      {currentTemplate ? (
        <ContentContainer>
          <div>
            <TemplateEditor
              template={currentTemplate}
              onTemplateChange={handleTemplateChange}
              onSave={handleSaveTemplate}
              onCancel={handleCloseEditor}
            />
          </div>
          <Box>
            <TemplatePreview template={currentTemplate} />
          </Box>
        </ContentContainer>
      ) : (
        <EmptyStateContainer>
          <Typography variant="h6" color="text.secondary">
            Select a template to edit or create a new one
          </Typography>
        </EmptyStateContainer>
      )}
    </TemplateBuilderContainer>
  );
};
