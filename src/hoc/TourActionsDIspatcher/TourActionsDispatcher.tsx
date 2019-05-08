import {ReactTourConsumer} from "components/ReactTour/ReactTourProvider";
import * as React from "react";
import * as Actions from "state/reactTour/actions";

export interface ITourActionsHandlers {
  actionStarted: (key: string) => void;
  eventOccured: (key: string) => void;
  minimalizeTour: () => void;
}

export const withTourActionsDispatcher = (Comp: React.ComponentType<ITourActionsHandlers>) => {
  return class TourActionsComp extends React.Component {
    public render() {
      return (
        <ReactTourConsumer>
          {(value) => {
            const {dispatch} = value;

            const handlers: ITourActionsHandlers = {
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
            };

            return <Comp {...this.props} {...handlers} />;
          }}
        </ReactTourConsumer>
      );
    }
  };
};
