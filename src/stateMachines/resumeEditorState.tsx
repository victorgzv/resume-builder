import {
  BaseActionType,
  BaseStateType,
  StateGraph,
  StateTransition,
} from "../types/stateMachine";
import { Template } from "../types/Template";

const STATE = {
  SELECT_TEMPLATE: "SELECT_TEMPLATE",
  PERSONAL_INFO: "PERSONAL_INFO",
  EXPERIENCE: "EXPERIENCE",
  EDUCATION: "EDUCATION",
  SKILLS: "SKILLS",
  SUBMITTING: "SUBMITTING",
} as const;

const ACTION = {
  NEXT: "NEXT",
  PREVIOUS: "PREVIOUS",
  SELECT_TEMPLATE: "SELECT_TEMPLATE",
  UPDATE_PERSONAL_INFO: "UPDATE_PERSONAL_INFO",
  ADD_EXPERIENCE: "ADD_EXPERIENCE",
  UPDATE_EXPERIENCE: "UPDATE_EXPERIENCE",
  REMOVE_EXPERIENCE: "REMOVE_EXPERIENCE",
  ADD_EDUCATION: "ADD_EDUCATION",
  UPDATE_EDUCATION: "UPDATE_EDUCATION",
  REMOVE_EDUCATION: "REMOVE_EDUCATION",
  ADD_SKILL: "ADD_SKILL",
  UPDATE_SKILL: "UPDATE_SKILL",
  REMOVE_SKILL: "REMOVE_SKILL",
  SUBMIT: "SUBMIT",
} as const;

export type StateType = typeof STATE;
export type ActionType = typeof ACTION;

export type ResumeEditorStateType = {
  state: string;
  selectedTemplateId?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    description: string;
    profilePicture: string;
  };
  experiences: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    degree: string;
    major: string;
    university: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: {
    name: string;
    score: number;
  }[];
};

export type ResumeEditorActionType = {
  type: keyof typeof ACTION;
  state?: string;
  template?: Template;
  personalInfo?: Partial<ResumeEditorStateType["personalInfo"]>;
  experience?: ResumeEditorStateType["experiences"][0];
  experienceIndex?: number;
  education?: ResumeEditorStateType["education"][0];
  educationIndex?: number;
  skill?: ResumeEditorStateType["skills"][0];
  skillIndex?: number;
};

const getNextStage: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = (_, stage) => {
  const currentState = stage.state;
  let nextState: StateType = STATE.SELECT_TEMPLATE;
  switch (currentState) {
    case STATE.SELECT_TEMPLATE:
      nextState = STATE.PERSONAL_INFO;
      break;
    case STATE.PERSONAL_INFO:
      nextState = STATE.EXPERIENCE;
      break;
    case STATE.EXPERIENCE:
      nextState = STATE.EDUCATION;
      break;
    case STATE.EDUCATION:
      nextState = STATE.SKILLS;
      break;
    case STATE.SKILLS:
      nextState = STATE.SUBMITTING;
      break;
  }
  return { ...stage, state: nextState };
};

const getPreviousStage: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = (_, stage) => {
  const currentState = stage.state;
  let previousState: StateType = STATE.SELECT_TEMPLATE;
  switch (currentState) {
    case STATE.PERSONAL_INFO:
      previousState = STATE.SELECT_TEMPLATE;
      break;
    case STATE.EXPERIENCE:
      previousState = STATE.PERSONAL_INFO;
      break;
    case STATE.EDUCATION:
      previousState = STATE.EXPERIENCE;
      break;
    case STATE.SKILLS:
      previousState = STATE.EDUCATION;
      break;
  }
  return { ...stage, state: previousState };
};

const selectTemplate: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ template }, stage) => ({
  ...stage,
  selectedTemplateId: template?.id,
});

const updatePersonalInfo: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ personalInfo }, stage) => ({
  ...stage,
  personalInfo: { ...stage.personalInfo, ...personalInfo },
});

const addExperience: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = (_, stage) => ({
  ...stage,
  experiences: [
    ...stage.experiences,
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
});

const updateExperience: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ experience, experienceIndex }, stage) => ({
  ...stage,
  experiences: stage.experiences.map((exp, index) =>
    index === experienceIndex ? { ...exp, ...experience } : exp
  ),
});

const removeExperience: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ experienceIndex }, stage) => ({
  ...stage,
  experiences: stage.experiences.filter(
    (_, index) => index !== experienceIndex
  ),
});

const addEducation: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = (_, stage) => ({
  ...stage,
  education: [
    ...stage.education,
    {
      degree: "",
      major: "",
      university: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
});

const updateEducation: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ education, educationIndex }, stage) => ({
  ...stage,
  education: stage.education.map((edu, index) =>
    index === educationIndex ? { ...edu, ...education } : edu
  ),
});

const removeEducation: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ educationIndex }, stage) => ({
  ...stage,
  education: stage.education.filter((_, index) => index !== educationIndex),
});

const addSkill: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = (_, stage) => ({
  ...stage,
  skills: [...stage.skills, { name: "", score: 0 }],
});

const updateSkill: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ skill, skillIndex }, stage) => ({
  ...stage,
  skills: stage.skills.map((sk, index) =>
    index === skillIndex ? { ...sk, ...skill } : sk
  ),
});

const removeSkill: StateTransition<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = ({ skillIndex }, stage) => ({
  ...stage,
  skills: stage.skills.filter((_, index) => index !== skillIndex),
});

const NEXT_STATE_GRAPH: StateGraph<
  StateType,
  ResumeEditorStateType,
  ActionType,
  ResumeEditorActionType
> = {
  [STATE.SELECT_TEMPLATE]: {
    [ACTION.NEXT]: getNextStage,
    [ACTION.SELECT_TEMPLATE]: selectTemplate,
  },
  [STATE.PERSONAL_INFO]: {
    [ACTION.NEXT]: getNextStage,
    [ACTION.PREVIOUS]: getPreviousStage,
    [ACTION.UPDATE_PERSONAL_INFO]: updatePersonalInfo,
  },
  [STATE.EXPERIENCE]: {
    [ACTION.NEXT]: getNextStage,
    [ACTION.PREVIOUS]: getPreviousStage,
    [ACTION.ADD_EXPERIENCE]: addExperience,
    [ACTION.UPDATE_EXPERIENCE]: updateExperience,
    [ACTION.REMOVE_EXPERIENCE]: removeExperience,
  },
  [STATE.EDUCATION]: {
    [ACTION.NEXT]: getNextStage,
    [ACTION.PREVIOUS]: getPreviousStage,
    [ACTION.ADD_EDUCATION]: addEducation,
    [ACTION.UPDATE_EDUCATION]: updateEducation,
    [ACTION.REMOVE_EDUCATION]: removeEducation,
  },
  [STATE.SKILLS]: {
    [ACTION.PREVIOUS]: getPreviousStage,
    [ACTION.SUBMIT]: getNextStage,
    [ACTION.ADD_SKILL]: addSkill,
    [ACTION.UPDATE_SKILL]: updateSkill,
    [ACTION.REMOVE_SKILL]: removeSkill,
  },
  [STATE.SUBMITTING]: {
    // Add any necessary actions for the submitting state
  },
};

const createInitialResumeState = () => ({
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    description: "",
    profilePicture: "",
  },
  experiences: [
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  education: [
    {
      degree: "",
      major: "",
      university: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  skills: [{ name: "", score: 0 }],
  state: STATE.SELECT_TEMPLATE,
});

const reducer = (
  lastStage: BaseStateType<StateType, ResumeEditorStateType>,
  event: BaseActionType<ActionType, ResumeEditorActionType>
) => {
  const nextStageBuilder = NEXT_STATE_GRAPH[lastStage.state]?.[event.type];
  return nextStageBuilder !== undefined
    ? nextStageBuilder(event, lastStage)
    : lastStage;
};

export { ACTION, STATE, reducer, createInitialResumeState };
