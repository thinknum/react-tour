import React, {useReducer, Dispatch} from "react";
import {initialState, reducer} from "state/reactTour/reducer";
import {IState, Action} from "state/reactTour/types";

console.log("hoho provider lives!");

// Debugging setup

const defaultValue = {
  state: initialState,
  dispatch: () => {
    throw new Error(
      "defalt dispatch called, did you forget to wrap your app in ReactTourProvider?",
    );
  },
};

const ReactTourContext = React.createContext<{state: IState; dispatch: Dispatch<Action>}>(
  defaultValue,
);

export const ReactTourProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = {state, dispatch};

  console.log("provider value:", value);

  return <ReactTourContext.Provider value={value}>{props.children}</ReactTourContext.Provider>;
};

export const ReactTourConsumer = ReactTourContext.Consumer;
