import {ReactTourConsumer} from "components/ReactTour/ReactTourProvider";
import * as React from "react";
import {TourActionsHandlers} from "components/ReactTour/types";

export const withTourActionsDispatcher = (Comp: React.ComponentType<TourActionsHandlers>) => {
  return class TourActionsComp extends React.Component {
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
  };
};
