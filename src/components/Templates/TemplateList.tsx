import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { STATE } from "../../stateMachines/templatesState";
import { Template } from "../../types/Template";

interface TemplateListProps {
  templates: Template[];
  templatesRetry: () => void;
  templatesState: any;
  handleNewTemplate: () => void;
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
  selectedTemplateId?: string;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  templatesState,
  templatesRetry,
  onEditTemplate,
  onDeleteTemplate,
  selectedTemplateId,
  handleNewTemplate,
}) => {
  if (templatesState === STATE.LOADING) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (templatesState === STATE.ERROR) {
    return (
      <div>
        Error fetching templates.
        <Button variant="contained" onClick={templatesRetry} sx={{ mt: 2 }}>
          Try again
        </Button>
      </div>
    );
  }
  return (
    <>
      {templates?.length === 0 ? (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No templates available
          </Typography>
        </Box>
      ) : (
        <>
          <List>
            {templates?.map((template) => (
              <Card key={template.id} sx={{ my: 1, position: "relative" }}>
                <ListItem
                  data-testid="template-list-item"
                  onClick={() => onEditTemplate(template)}
                  selected={template.id === selectedTemplateId}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTemplate(template);
                      }}
                      sx={{
                        alignSelf: "flex-end",
                        position: "absolute",
                        top: 0,
                        right: 0,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <CardContent sx={{ width: "100%" }}>
                      <ListItemText primary={template.name} />
                      <ListItemText secondary={template.description} />
                    </CardContent>
                  </Box>
                </ListItem>
              </Card>
            ))}
          </List>
        </>
      )}

      <Button
        variant="contained"
        onClick={handleNewTemplate}
        fullWidth
        sx={{ mt: 2 }}
      >
        New Template
      </Button>
    </>
  );
};
