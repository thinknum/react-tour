import {ReactTourConsumer} from "components/ReactTour/ReactTourProvider";
import React, {Dispatch} from "react";
import {IState, Action} from "state/reactTour/types";

export interface DispatchProps {
  dispatch: Dispatch<Action>;
}

export function connectReactTour<Props, OuterProps>(
  mapStateToProps: (state: IState, props: OuterProps) => Props,
) {
  return (Comp: React.ComponentType<Props & OuterProps & DispatchProps>) => {
    return class WithReactTourConsumer extends React.Component<OuterProps> {
      public render() {
        return (
          <ReactTourConsumer>
            {(value) => {
              const {dispatch} = value;

              return (
                <Comp
                  {...this.props}
                  {...mapStateToProps(value.state, this.props)}
                  dispatch={dispatch}
                />
              );
            }}
          </ReactTourConsumer>
        );
      }
    };
  };
}
