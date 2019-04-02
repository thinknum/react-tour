import {Action, handleActions} from "redux-actions";
import * as Types from "./types";
import {ActionType, IState} from "./types";

export const initialState: IState = {
  startedActions: [],
};

type Payload = Types.ITestPayload;

export const reducer = handleActions<IState, Payload>(
  {
    [ActionType.TEST]: (
      state: IState,
      action: Action<Types.ITestPayload>,
    ): IState => {
      return {
        ...state,
      };
    },
  },
  initialState,
);
