import * as React from "react";
import {ReactTourConsumer, ReactTourContext} from "../../components/ReactTour/ReactTourProvider";
import {TourActionsHandlers} from "../../components/ReactTour/types";

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
