import {ReactStoryStep} from "components/ReactTour/types";
import {Action, handleActions} from "redux-actions";
import * as Types from "./types";
import {ActionType, IState, TourStatus} from "./types";

export const initialState: IState = {
  steps: [],
  stepIdx: 0,
  tourInteractionKeys: new Set<string>(),
  eventKeys: new Set<string>(),
  status: TourStatus.PREPARE_TO_SHOW,
};

const getNewStatus = (status: TourStatus, currentStep: ReactStoryStep, newSet: Set<string>): TourStatus => {
  if (status === TourStatus.AUTOMATION) {
    return status;
  }

  const hasInteractionStarted =
    currentStep.interactionStartKey !== undefined ? newSet.has(currentStep.interactionStartKey) : false;
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

type Payload =
  | Types.IAddInteractionPayload
  | Types.ISetStepIdxPayload
  | Types.ISetStepsPayload
  | Types.IAddEventPayload;

export const reducer = handleActions<IState, Payload>(
  {
    [ActionType.SET_STEPS]: (state: IState, action: Action<Types.ISetStepsPayload>): IState => {
      const steps = action.payload!.steps;

      return {
        steps,
        stepIdx: 0,
        tourInteractionKeys: new Set<string>(),
        eventKeys: new Set<string>(),
        status: TourStatus.PREPARE_TO_SHOW,
      };
    },

    [ActionType.SET_STEP_IDX]: (state: IState, action: Action<Types.ISetStepIdxPayload>): IState => {
      const newIdx = action.payload!.idx;

      return {
        ...state,
        status: TourStatus.PREPARE_TO_SHOW,
        stepIdx: newIdx,
      };
    },

    [ActionType.ADD_INTERACTION]: (state: IState, action: Action<Types.IAddInteractionPayload>): IState => {
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
    },

    [ActionType.ADD_EVENT]: (state: IState, action: Action<Types.IAddEventPayload>): IState => {
      const newKey = action.payload!.eventKey;
      const newSet = new Set(state.eventKeys).add(newKey);

      return {
        ...state,
        eventKeys: newSet,
      };
    },

    [ActionType.REMOVE_EVENT]: (state: IState, action: Action<Types.IRemoveEventPayload>): IState => {
      const keyToRemove = action.payload!.eventKey;
      const newSet = new Set(state.eventKeys);
      newSet.delete(keyToRemove);

      return {
        ...state,
        eventKeys: newSet,
      };
    },

    [ActionType.MINIMALIZE]: (state: IState, action: Action<Types.IEmptyPayload>): IState => {
      if (state.status === TourStatus.INTERACTION_STARTED || state.status === TourStatus.INTERACTION_FINISHED) {
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
    },

    [ActionType.SHOW]: (state: IState, action: Action<Types.IEmptyPayload>): IState => {
      return {
        ...state,
        status: TourStatus.MODAL_VISIBLE,
      };
    },

    [ActionType.HIDE]: (state: IState, action: Action<Types.IEmptyPayload>): IState => {
      if (state.status === TourStatus.MODAL_VISIBLE) {
        return {
          ...state,
          status: TourStatus.PREPARE_TO_SHOW,
        };
      } else {
        return state;
      }
    },

    [ActionType.FINISH]: (state: IState, action: Action<Types.IEmptyPayload>): IState => {
      return {
        ...state,
        status: TourStatus.FINISH,
      };
    },

    [ActionType.START_AUTOMATION]: (state: IState, action: Action<Types.IEmptyPayload>): IState => {
      return {
        ...state,
        status: TourStatus.AUTOMATION,
      };
    },

    [ActionType.INTERRUPT_AUTOMATION]: (state: IState, action: Action<Types.IEmptyPayload>): IState => {
      return {
        ...state,
        status: TourStatus.MINIMALIZED,
        eventKeys: new Set(),
      };
    },
  },
  initialState,
);
