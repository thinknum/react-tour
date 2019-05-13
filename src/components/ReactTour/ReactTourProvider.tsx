import * as React from "react";
import {Dispatch, useReducer} from "react";
import {initialState, reducer} from "state/reactTour/reducer";
import {Action, IState} from "../../state/reactTour/types";
import * as Actions from "../../state/reactTour/actions";
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

export const ReactTourContext = React.createContext<TourContext>(defaultValue);

export const ReactTourProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dispatchWithLog = React.useCallback(
    (action) => {
      if (environment === Environment.DEVELOPMENT) {
        console.groupCollapsed(`%c Tour Action: [${action.type}]`, "color: blue;");
        console.log("action", action);
        console.groupEnd();
      }

      dispatch(action);
    },
    [dispatch],
  );

  const actionStarted = React.useCallback(
    (key) => {
      dispatchWithLog(Actions.addInteraction({interactionKey: key}));
    },
    [dispatch],
  );

  const eventOccured = React.useCallback(
    (key) => {
      dispatchWithLog(Actions.addEvent({eventKey: key}));
    },
    [dispatch],
  );

  const minimalizeTour = React.useCallback(() => {
    setTimeout(() => {
      dispatchWithLog(Actions.minimalize({}));
    }, 300);
  }, [dispatch]);

  return (
    <ReactTourContext.Provider
      value={{
        dispatch: dispatchWithLog,
        state,
        handlers: {
          actionStarted,
          eventOccured,
          minimalizeTour,
        },
      }}
    >
      {props.children}
    </ReactTourContext.Provider>
  );
};

export const ReactTourConsumer = ReactTourContext.Consumer;
