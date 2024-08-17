import React, { useCallback } from "react";
import useGetTemplates from "./customHooks/useGetTemplates";
import { ACTION, STATE } from "./stateMachines/templatesState";
import { TemplateBuilder } from "./components/Templates/TemplateBuilder";
import { Template } from "./types/Template";

type Props = {
  baseUrl: string;
};

const ResumeManagement = ({ baseUrl }: Props) => {
  const {
    send: templatesSend,
    state: templatesState,
    refetch: templatesRetry,
  } = useGetTemplates({ baseUrl });

  const onCreateTemplate = useCallback(
    (template: Template) => {
      templatesSend({
        type: ACTION.ADD_TEMPLATE,
        template,
      });
    },
    [templatesSend]
  );

  const onUpdateTemplate = useCallback(
    (template: Template) => {
      templatesSend({
        type: ACTION.EDIT_TEMPLATE,
        template,
      });
    },
    [templatesSend]
  );

  const onDeleteTemplate = useCallback(
    (templateId: string) => {
      templatesSend({
        type: ACTION.DELETE_TEMPLATE,
        templateId,
      });
    },
    [templatesSend]
  );

  return (
    <div>
      Resumes Management
      <TemplateBuilder
        templatesState={templatesState}
        templatesRetry={templatesRetry}
        baseUrl={baseUrl}
        onAddTemplate={onCreateTemplate}
        onUpdateTemplate={onUpdateTemplate}
        onDeleteTemplate={onDeleteTemplate}
      />
    </div>
  );
};

export default ResumeManagement;
