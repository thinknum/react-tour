import {IState} from "./types";

export const getCurrentStepIndex = (state: IState) => {
  return state.stepIdx;
};

export const containsInteractionKey = (state: IState, key: string | undefined) => {
  if (key === undefined) {
    return false;
  }

  return state.tourInteractionKeys.has(key);
};

export const getTourStatus = (state: IState) => {
  return state.status;
};

export const getInteractionKeys = (state: IState) => {
  return state.tourInteractionKeys;
};

export const getEventKeys = (state: IState) => {
  return state.eventKeys;
};
