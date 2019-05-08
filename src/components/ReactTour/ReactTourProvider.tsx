import * as React from "react";
import {Dispatch, useReducer} from "react";
import {initialState, reducer} from "state/reactTour/reducer";
import {Action, IState} from "../../state/reactTour/types";

// Debugging setup

enum Environment {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}
const environment = process.env.NODE_ENV as Environment;

const defaultValue = {
  state: initialState,
  dispatch: () => {
    // ignore call to dispatch when component is not wrapped
  },
};

const ReactTourContext = React.createContext<{state: IState; dispatch: Dispatch<Action>}>(
  defaultValue,
);

export const ReactTourProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchWithLog: Dispatch<Action> = (action) => {
    if (environment === Environment.DEVELOPMENT) {
      console.groupCollapsed(`%c Tour Action: [${action.type}]`, "color: blue;");
      console.log(action);
      console.groupEnd();
    }

    dispatch(action);
  };

  const value = {state, dispatch: dispatchWithLog};

  return <ReactTourContext.Provider value={value}>{props.children}</ReactTourContext.Provider>;
};

export const ReactTourConsumer = ReactTourContext.Consumer;
