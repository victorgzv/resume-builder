import React from "react";
import { List, ListItem, ListItemText, Card, CardContent } from "@mui/material";
import { Template } from "../../types/Template";

interface TemplateListProps {
  templates: Template[];
  onEditTemplate: (template: Template) => void;
  selectedTemplateId?: string;
}

export const TemplateList: React.FC<TemplateListProps> = ({
  templates,
  onEditTemplate,
  selectedTemplateId,
}) => {
  return (
    <List>
      {templates.map((template) => (
        <Card key={template.id} sx={{ my: 1 }}>
          <ListItem
            data-testid="template-list-item"
            button
            onClick={() => onEditTemplate(template)}
            selected={template.id === selectedTemplateId}
          >
            <CardContent>
              <ListItemText primary={template.name} />
              <ListItemText secondary={template.description} />
            </CardContent>
          </ListItem>
        </Card>
      ))}
    </List>
  );
};
