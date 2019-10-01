import * as React from "react";
import {ReactTourConsumer} from "../../components/ReactTour/ReactTourProvider";
import {TourActionsHandlers} from "../../components/ReactTour/types";

export function withTourActionsDispatcher<T>(Comp: React.ComponentType<TourActionsHandlers & T>) {
  return class TourActionsComp extends React.Component<T> {
    public render() {
      return (
        <ReactTourConsumer>
          {(value) => {
            const {handlers} = value;

            return <Comp {...this.props} {...handlers} />;
          }}
        </ReactTourConsumer>
      );
    }
  }
}
