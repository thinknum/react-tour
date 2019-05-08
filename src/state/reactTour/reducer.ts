import {ReactStoryStep} from "components/ReactTour/types";
import {Reducer} from "react";
import * as Types from "./types";
import {ActionType, IState, TourStatus} from "./types";

export const initialState: IState = {
  steps: [],
  stepIdx: 0,
  tourInteractionKeys: new Set<string>(),
  eventKeys: new Set<string>(),
  status: TourStatus.PREPARE_TO_SHOW,
};

const getNewStatus = (
  status: TourStatus,
  currentStep: ReactStoryStep,
  newSet: Set<string>,
): TourStatus => {
  if (status === TourStatus.AUTOMATION) {
    return status;
  }

  const hasInteractionStarted =
    currentStep.interactionStartKey !== undefined
      ? newSet.has(currentStep.interactionStartKey)
      : false;
  const hasInteractionFinished =
    currentStep.interactionEndKey !== undefined ? newSet.has(currentStep.interactionEndKey) : false;

  if (status !== TourStatus.INTERACTION_FINISHED && hasInteractionFinished) {
    return TourStatus.INTERACTION_FINISHED;
  }

  if (status === TourStatus.MODAL_VISIBLE && hasInteractionStarted) {
    return TourStatus.INTERACTION_STARTED;
  }

  return status;
};

export const reducer: Reducer<IState, Types.Action> = (state, action) => {
  switch (action.type) {
    case ActionType.SET_STEPS: {
      const steps = action.payload.steps;

      return {
        steps,
        stepIdx: 0,
        tourInteractionKeys: new Set<string>(),
        eventKeys: new Set<string>(),
        status: TourStatus.PREPARE_TO_SHOW,
      };
    }

    case ActionType.SET_STEP_IDX: {
      const newIdx = action.payload!.idx;

      return {
        ...state,
        status: TourStatus.PREPARE_TO_SHOW,
        stepIdx: newIdx,
      };
    }

    case ActionType.ADD_INTERACTION: {
      const currentStep = state.steps[state.stepIdx];
      if (!currentStep) {
        return state;
      }

      const newKey = action.payload!.interactionKey;
      const newSet = new Set(state.tourInteractionKeys).add(newKey);
      const newStatus = getNewStatus(state.status, currentStep, newSet);
      return {
        ...state,
        tourInteractionKeys: newSet,
        status: newStatus,
      };
    }

    case ActionType.ADD_EVENT: {
      const newKey = action.payload!.eventKey;
      const newSet = new Set(state.eventKeys).add(newKey);

      return {
        ...state,
        eventKeys: newSet,
      };
    }

    case ActionType.REMOVE_EVENT: {
      const keyToRemove = action.payload!.eventKey;
      const newSet = new Set(state.eventKeys);
      newSet.delete(keyToRemove);

      return {
        ...state,
        eventKeys: newSet,
      };
    }

    case ActionType.MINIMALIZE: {
      if (
        state.status === TourStatus.INTERACTION_STARTED ||
        state.status === TourStatus.INTERACTION_FINISHED
      ) {
        return state;
      }

      if (state.steps.length === 0) {
        return state;
      }

      if (state.status === TourStatus.AUTOMATION) {
        return state;
      }

      return {
        ...state,
        status: TourStatus.MINIMALIZED,
      };
    }

    case ActionType.SHOW: {
      return {
        ...state,
        status: TourStatus.MODAL_VISIBLE,
      };
    }

    case ActionType.HIDE: {
      if (state.status === TourStatus.MODAL_VISIBLE) {
        return {
          ...state,
          status: TourStatus.PREPARE_TO_SHOW,
        };
      } else {
        return state;
      }
    }

    case ActionType.FINISH: {
      return {
        ...state,
        status: TourStatus.FINISH,
      };
    }

    case ActionType.START_AUTOMATION: {
      return {
        ...state,
        status: TourStatus.AUTOMATION,
      };
    }

    case ActionType.INTERRUPT_AUTOMATION: {
      return {
        ...state,
        status: TourStatus.MINIMALIZED,
        eventKeys: new Set(),
      };
    }

    default:
      return state;
  }
};
