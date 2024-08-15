import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Template } from "../../types/Template";
import {
  getTemplates,
  createTemplate,
  updateTemplate,
} from "../../services/api";
import { TemplateList } from "./TemplateList";
import { TemplateEditor } from "./TemplateEditor";
import { TemplatePreview } from "./TemplatePreview";

const TemplatePageContainer = styled(Box)(({ theme }) => ({
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

export const TemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] =
    useState<Partial<Template> | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const loadedTemplates = await getTemplates();
    setTemplates(loadedTemplates);
  };

  const handleCreateTemplate = async () => {
    if (currentTemplate?.name) {
      const newTemplate = await createTemplate({
        name: currentTemplate.name,
        description: currentTemplate.description,
        fontFamily: currentTemplate.fontFamily || "Arial, sans-serif",
        fontSize: currentTemplate.fontSize || "11",
        color: currentTemplate.color || "#000000",
      });

      setTemplates([...templates, newTemplate]);
      setCurrentTemplate(newTemplate);
    }
  };

  const handleUpdateTemplate = async () => {
    if (currentTemplate?.id) {
      const updatedTemplate = await updateTemplate(currentTemplate as Template);
      setTemplates(
        templates.map((t) =>
          t.id === updatedTemplate.id ? updatedTemplate : t
        )
      );
      setCurrentTemplate(updatedTemplate);
    }
  };

  const handleSaveTemplate = () => {
    if (currentTemplate?.id) {
      handleUpdateTemplate();
    } else {
      handleCreateTemplate();
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

  const handleCloseEditor = () => {
    setCurrentTemplate(null);
  };

  const handleTemplateChange = (updatedTemplate: Partial<Template>) => {
    setCurrentTemplate((prev) => ({ ...prev, ...updatedTemplate }));
  };

  return (
    <TemplatePageContainer>
      <SidebarContainer>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Templates
        </Typography>
        {templates.length > 0 ? (
          <TemplateList
            templates={templates}
            onEditTemplate={handleEditTemplate}
            selectedTemplateId={currentTemplate?.id}
          />
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No templates available
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          onClick={handleNewTemplate}
          fullWidth
          sx={{ mt: 2 }}
        >
          New Template
        </Button>
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
    </TemplatePageContainer>
  );
};
