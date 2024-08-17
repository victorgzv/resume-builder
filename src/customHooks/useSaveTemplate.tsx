import { useCallback } from "react";
import { Template } from "../types/Template";

type UseAddTemplateProps = {
  baseUrl: string;
};

const useSaveTemplate = ({ baseUrl }: UseAddTemplateProps) => {
  const onSaveTemplate = useCallback(
    async (template: Template, onSuccess: (template: Template) => void) => {
      const isUpdate = !!template?.id;
      const url = isUpdate
        ? `${baseUrl}/api/templates/${template.id}`
        : `${baseUrl}/api/templates`;
      const method = isUpdate ? "PUT" : "POST";

      try {
        const response = await fetch(url, {
          method,
          body: JSON.stringify(template),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to ${isUpdate ? "update" : "add"} template`);
        }

        const savedTemplate: Template = await response.json();

        onSuccess(savedTemplate);
      } catch (error) {
        console.error("Failed to save template", error);
      }
    },
    [baseUrl]
  );

  return onSaveTemplate;
};

export default useSaveTemplate;
