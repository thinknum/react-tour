import * as React from "react";
import {Dispatch, useReducer} from "react";
import {initialState, reducer} from "state/reactTour/reducer";
import {Action, IState} from "../../state/reactTour/types";
import * as Actions from "state/reactTour/actions";
import {TourActionsHandlers} from "./types";

// Debugging setup

enum Environment {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}
const environment = process.env.NODE_ENV as Environment;

interface TourContext {
  state: IState;
  dispatch: Dispatch<Action>;
  handlers: TourActionsHandlers;
}

// Default value of context - will be used when Provider isn't
// present at the root. All calls will be quietly ignored.
const defaultValue: TourContext = {
  state: initialState,
  dispatch: () => {},
  handlers: {
    actionStarted: () => {},
    eventOccured: () => {},
    minimalizeTour: () => {},
  },
};

const ReactTourContext = React.createContext<TourContext>(defaultValue);

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

  const value: TourContext = {
    state,
    dispatch: dispatchWithLog,
    handlers: {
      actionStarted: (key) => {
        dispatch(Actions.addInteraction({interactionKey: key}));
      },
      eventOccured: (key) => {
        dispatch(Actions.addEvent({eventKey: key}));
      },
      minimalizeTour: () => {
        setTimeout(() => {
          dispatch(Actions.minimalize({}));
        }, 300);
      },
    },
  };

  return <ReactTourContext.Provider value={value}>{props.children}</ReactTourContext.Provider>;
};

export const ReactTourConsumer = ReactTourContext.Consumer;
