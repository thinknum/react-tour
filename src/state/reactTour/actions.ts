import {createAction} from "redux-actions";
import * as Types from "./types";

export const setSteps = createAction<Types.ISetStepsPayload>(Types.ActionType.SET_STEPS);
export const setStepIndex = createAction<Types.ISetStepIdxPayload>(Types.ActionType.SET_STEP_IDX);
export const addInteraction = createAction<Types.IAddInteractionPayload>(Types.ActionType.ADD_INTERACTION);
export const addEvent = createAction<Types.IAddEventPayload>(Types.ActionType.ADD_EVENT);
export const minimalize = createAction<Types.IEmptyPayload>(Types.ActionType.MINIMALIZE);
export const show = createAction<Types.IEmptyPayload>(Types.ActionType.SHOW);
export const hide = createAction<Types.IEmptyPayload>(Types.ActionType.HIDE);
export const finish = createAction<Types.IEmptyPayload>(Types.ActionType.FINISH);
export const startAutomation = createAction<Types.IEmptyPayload>(Types.ActionType.START_AUTOMATION);
export const interruptAutomation = createAction<Types.IEmptyPayload>(Types.ActionType.INTERRUPT_AUTOMATION);
