import { useCallback } from "react";
import { Template } from "../types/Template";

type UseDeleteTemplateProps = {
  baseUrl: string;
  onSuccess: (templateId: string) => void;
  onCloseEditor: () => void;
  expandedTemplateId?: string;
};

const useDeleteTemplate = ({
  baseUrl,
  onSuccess,
  onCloseEditor,
  expandedTemplateId,
}: UseDeleteTemplateProps) => {
  const onDeleteTemplate = useCallback(
    async (template: Template) => {
      if (!template.id) {
        console.error("Cannot delete template without an id");
        return;
      }

      const url = `${baseUrl}/api/templates/${template.id}`;
      const method = "DELETE";

      try {
        const response = await fetch(url, {
          method,
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete template ${errorText}`);
        }

        onSuccess(template.id);
        if (expandedTemplateId === template?.id) {
          onCloseEditor();
        }
      } catch (error) {
        console.error("Failed to delete template", error);
      }
    },
    [baseUrl, onSuccess, expandedTemplateId, onCloseEditor]
  );

  return onDeleteTemplate;
};

export default useDeleteTemplate;
