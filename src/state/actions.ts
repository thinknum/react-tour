import {createAction} from "redux-actions";
import * as Types from "./types";

export const test = createAction<Types.ITestPayload>(Types.ActionType.TEST);
