export type BaseStateType<StateType, AdditionalStageData> = {
  state: keyof StateType;
} & AdditionalStageData;

export type BaseActionType<ActionType, AdditionalActionPayloadData> = {
  type: keyof ActionType;
} & AdditionalActionPayloadData;

export type StateTransition<
  StateType,
  AdditionalStageData,
  ActionType,
  AdditionalActionPayloadData,
> = (
  action: BaseActionType<ActionType, AdditionalActionPayloadData>,
  lastStage: BaseStateType<StateType, AdditionalStageData>
) => BaseStateType<StateType, AdditionalStageData>;

export type StateGraph<
  StateType,
  AdditionalStageData,
  ActionType,
  AdditionalActionPayloadData,
> = {
  [state in keyof StateType]?: {
    [action in keyof ActionType]?: StateTransition<
      StateType,
      AdditionalStageData,
      ActionType,
      AdditionalActionPayloadData
    >;
  };
};
