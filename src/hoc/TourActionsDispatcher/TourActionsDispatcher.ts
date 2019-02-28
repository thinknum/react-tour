import { connect, DispatchProp } from "react-redux";
import { compose, setDisplayName, withHandlers } from "recompose";
import * as Actions from "../../state/actions";
import { IState as IReduxState } from "../../state/types";
import * as Types from "./types";

const withStatusProps = connect<
  undefined,
  undefined,
  {} & DispatchProp<any>,
  IReduxState
>((state, {}) => {
  return undefined;
});

const withStatusHandlers = withHandlers<
  DispatchProp<any>,
  Types.ITourActionsHandlers
>({
  actionStarted: ({dispatch}) => (key) => {
    console.log("ACTION: ", key);
    dispatch(Actions.test({}));
  },
});

export const withTourActionsDispatcher = compose<
  undefined,
  Types.ITourActionsHandlers
>(
  setDisplayName("TourActionsDispatcher"),
  withStatusProps,
  withStatusHandlers
);
