import React, {useReducer, Dispatch} from "react";
import {initialState, reducer} from "state/reactTour/reducer";
import {IState, Action} from "state/reactTour/types";

// Debugging setup

const defaultValue = {
  state: initialState,
  dispatch: () => {
    throw new Error(
      "defalt dispatch called, did you forget to wrap your app in ReactTourProvider?",
    );
  },
};

const TourContext = React.createContext<{state: IState; dispatch: Dispatch<Action>}>(defaultValue);

export const ReactTourProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {state, dispatch};

  return <TourContext.Provider value={value}>{props.children}</TourContext.Provider>;
};
