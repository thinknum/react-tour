import {ReactStoryStep} from "components/ReactTour/types";

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

/* Action types
-------------------------------------------------------------------------*/

export enum ActionType {
  SET_STEPS = "React Tour - Set steps",
  SET_STEP_IDX = "React Tour - Set step index",
  ADD_INTERACTION = "React Tour - Add interaction",
  ADD_EVENT = "React Tour - Add Event",
  MINIMALIZE = "React Tour - Minimalize",
  SHOW = "React Tour - Show",
  HIDE = "React Tour - Hide",
  FINISH = "React Tour - Finish",
  START_AUTOMATION = "React Tour - Start Automation",
  INTERRUPT_AUTOMATION = "React Tour - Interrupt Automation",
}

/* Action payloads
-------------------------------------------------------------------------*/

export interface ISetStepsPayload {
  steps: ReactStoryStep[];
}

export interface ISetStepIdxPayload {
  idx: number;
}

export interface IAddInteractionPayload {
  interactionKey: string;
}

export interface IAddEventPayload {
  eventKey: string;
}

export interface IEmptyPayload {}
