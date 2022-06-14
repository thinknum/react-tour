import {ReactTourContext} from "components/ReactTour/ReactTourProvider";
import {useContext} from "react";

export function useTourActionsDispatcher() {
  const context = useContext(ReactTourContext);

  if (!context) {
    throw new Error("missing ReactTourContext context");
  }

  return context.handlers;
}
