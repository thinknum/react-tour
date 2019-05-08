import {ReactStoryStep} from "../../components/ReactTour/types";

/* Types
-------------------------------------------------------------------------*/

export enum TourStatus {
  PREPARE_TO_SHOW = "PREPARE_TO_SHOW",
  MODAL_VISIBLE = "MODAL_VISIBLE",
  INTERACTION_STARTED = "INTERACTION_STARTED",
  INTERACTION_FINISHED = "INTERACTION_FINISHED",
  MINIMALIZED = "MINIMALIZED",
  FINISH = "FINISH",
  AUTOMATION = "AUTOMATION",
}

/* State
-------------------------------------------------------------------------*/

export interface IState {
  steps: ReactStoryStep[];
  stepIdx: number;
  tourInteractionKeys: Set<string>;
  eventKeys: Set<string>;
  status: TourStatus;
}

/* Actions
-------------------------------------------------------------------------*/

export enum ActionType {
  SET_STEPS = "React Tour - Set steps",
  SET_STEP_IDX = "React Tour - Set step index",
  ADD_INTERACTION = "React Tour - Add interaction",
  ADD_EVENT = "React Tour - Add Event",
  REMOVE_EVENT = "React Tour - Remove Event",
  MINIMALIZE = "React Tour - Minimalize",
  SHOW = "React Tour - Show",
  HIDE = "React Tour - Hide",
  FINISH = "React Tour - Finish",
  START_AUTOMATION = "React Tour - Start Automation",
  INTERRUPT_AUTOMATION = "React Tour - Interrupt Automation",
}

export interface ISetStepsAction {
  type: ActionType.SET_STEPS;
  payload: {
    steps: ReactStoryStep[];
  };
}

export interface ISetStepIdxAction {
  type: ActionType.SET_STEP_IDX;
  payload: {
    idx: number;
  };
}

export interface IAddInteractionAction {
  type: ActionType.ADD_INTERACTION;
  payload: {
    interactionKey: string;
  };
}

export interface IAddEventAction {
  type: ActionType.ADD_EVENT;
  payload: {
    eventKey: string;
  };
}

export interface IRemoveEventAction {
  type: ActionType.REMOVE_EVENT;
  payload: {
    eventKey: string;
  };
}

export interface IMinimalizeAction {
  type: ActionType.MINIMALIZE;
}

export interface IShowAction {
  type: ActionType.SHOW;
}

export interface IHideAction {
  type: ActionType.HIDE;
}

export interface IFinishAction {
  type: ActionType.FINISH;
}

export interface IStartAutomationAction {
  type: ActionType.START_AUTOMATION;
}

export interface IInterruptAutomationAction {
  type: ActionType.INTERRUPT_AUTOMATION;
}

export type Action =
  | ISetStepsAction
  | ISetStepIdxAction
  | IAddInteractionAction
  | IAddEventAction
  | IRemoveEventAction
  | IMinimalizeAction
  | IShowAction
  | IHideAction
  | IFinishAction
  | IStartAutomationAction
  | IInterruptAutomationAction;
