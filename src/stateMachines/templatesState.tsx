import {
  BaseActionType,
  BaseStateType,
  StateGraph,
  StateTransition,
} from "../types/stateMachine";

import { Template } from "../types/Template";

// Define the state types
const STATE = {
  ERROR: "ERROR",
  IDLE: "IDLE",
  LOADED: "LOADED",
  LOADING: "LOADING",
} as const;

// Define the action types
const ACTION = {
  ADD_TEMPLATE: "ADD_TEMPLATE",
  DELETE_TEMPLATE: "DELETE_TEMPLATE",
  EDIT_TEMPLATE: "EDIT_TEMPLATE",
  FAIL: "FAIL",
  FETCH: "FETCH",
  REFETCH: "REFETCH",
  SUCCESS: "SUCCESS",
} as const;

export type StateType = typeof STATE;
export type ActionType = typeof ACTION;

// Define the state type for template management
type TemplateFetchingStateType = {
  data?: {
    templates: Template[];
  };
  error?: Error;
};

// Define the action type for template management
type TemplateFetchingStateActionType = {
  error?: Error;
  template?: Template;
  templateId?: string;
};

// State transition functions
const getLoadingStage: StateTransition<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = (_, stage) => ({
  ...stage,
  state: STATE.LOADING,
});

const getFailureStage: StateTransition<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = ({ error }, stage) => ({
  ...stage,
  error,
  state: STATE.ERROR,
});

const getSuccessStage: StateTransition<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = ({ data }, stage) => ({
  ...stage,
  data,
  state: STATE.LOADED,
});

const getIdleStage: StateTransition<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = (_, stage) => ({
  ...stage,
  state: STATE.IDLE,
});

const getAddTemplateStage: StateTransition<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = ({ template }, stage) => ({
  ...stage,
  data: {
    templates: [...(stage.data?.templates || []), template as Template],
  },
});

const getDeleteTemplateStage: StateTransition<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = ({ templateId }, stage) => {
  return {
    ...stage,
    data: {
      templates: stage.data?.templates.filter((t) => t.id !== templateId) || [],
    },
  };
};

const getEditTemplateStage: StateTransition<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = ({ template }, stage) => ({
  ...stage,
  data: {
    templates:
      stage.data?.templates.map((t) =>
        t.id === template?.id ? { ...t, ...template } : t
      ) || [],
  },
});

const NEXT_STATE_GRAPH: StateGraph<
  StateType,
  TemplateFetchingStateType,
  ActionType,
  TemplateFetchingStateActionType
> = {
  [STATE.IDLE]: {
    [ACTION.FETCH]: getLoadingStage,
  },
  [STATE.LOADING]: {
    [ACTION.FAIL]: getFailureStage,
    [ACTION.SUCCESS]: getSuccessStage,
  },
  [STATE.ERROR]: {
    [ACTION.REFETCH]: getIdleStage,
  },
  [STATE.LOADED]: {
    [ACTION.ADD_TEMPLATE]: getAddTemplateStage,
    [ACTION.DELETE_TEMPLATE]: getDeleteTemplateStage,
    [ACTION.EDIT_TEMPLATE]: getEditTemplateStage,
    [ACTION.REFETCH]: getIdleStage,
  },
};

const reducer = (
  lastStage: BaseStateType<StateType, TemplateFetchingStateType>,
  event: BaseActionType<ActionType, TemplateFetchingStateActionType>
) => {
  const nextStageBuilder = NEXT_STATE_GRAPH[lastStage.state]?.[event.type];
  return nextStageBuilder !== undefined
    ? nextStageBuilder(event, lastStage)
    : lastStage;
};

export { ACTION, STATE, reducer };
