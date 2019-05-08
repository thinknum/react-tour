import {ReactTourConsumer} from "components/ReactTour/ReactTourProvider";
import React, {Dispatch} from "react";
import {IState, Action} from "state/reactTour/types";

export interface DispatchProps {
  dispatch: Dispatch<Action>;
}

export function connectReactTour<MappedProps, OuterProps>(
  mapStateToProps: ((state: IState, props: OuterProps) => MappedProps) | undefined,
) {
  return (Comp: React.ComponentType<MappedProps & OuterProps & DispatchProps>) => {
    return class WithReactTourConsumer extends React.Component<OuterProps> {
      public render() {
        return (
          <ReactTourConsumer>
            {(value) => {
              const mappedProps: MappedProps = mapStateToProps
                ? mapStateToProps(value.state, this.props)
                : ({} as MappedProps);
              const {dispatch} = value;

              return <Comp {...this.props} {...mappedProps} dispatch={dispatch} />;
            }}
          </ReactTourConsumer>
        );
      }
    };
  };
}
