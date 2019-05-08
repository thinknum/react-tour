import {
  ISetStepsAction,
  ActionType,
  IAddInteractionAction,
  ISetStepIdxAction,
  IAddEventAction,
  IRemoveEventAction,
  IMinimalizeAction,
  IShowAction,
  IHideAction,
  IFinishAction,
  IStartAutomationAction,
  IInterruptAutomationAction,
} from "./types";

interface Action<Payload> {
  type: ActionType;
  payload?: Payload;
}

function createAction<A extends Action<any>>(type: A["type"]) {
  return (payload: A["payload"]) => {
    return {
      type,
      payload,
    };
  };
}

export const setSteps = createAction<ISetStepsAction>(ActionType.SET_STEPS);
export const setStepIndex = createAction<ISetStepIdxAction>(ActionType.SET_STEP_IDX);
export const addInteraction = createAction<IAddInteractionAction>(ActionType.ADD_INTERACTION);
export const addEvent = createAction<IAddEventAction>(ActionType.ADD_EVENT);
export const removeEvent = createAction<IRemoveEventAction>(ActionType.REMOVE_EVENT);
export const minimalize = createAction<IMinimalizeAction>(ActionType.MINIMALIZE);
export const show = createAction<IShowAction>(ActionType.SHOW);
export const hide = createAction<IHideAction>(ActionType.HIDE);
export const finish = createAction<IFinishAction>(ActionType.FINISH);
export const startAutomation = createAction<IStartAutomationAction>(ActionType.START_AUTOMATION);
export const interruptAutomation = createAction<IInterruptAutomationAction>(
  ActionType.INTERRUPT_AUTOMATION,
);
