import {STORE_KEY} from "components/ReactTour/ReactTourProvider";
import * as PropTypes from "prop-types";
import {connect, DispatchProp} from "react-redux";
import {branch, compose, getContext, mapProps, withHandlers} from "recompose";
import * as Actions from "state/reactTour/actions";

export interface ITourActionsHandlers {
  actionStarted: (key: string) => void;
  eventOccured: (key: string) => void;
  minimalizeTour: () => void;
}

const withConnect = connect(
  undefined,
  undefined,
  undefined,
  {
    storeKey: STORE_KEY,
  },
);

type IHandlersInputProps = DispatchProp<any>;

const withStatusHandlers = withHandlers<IHandlersInputProps, ITourActionsHandlers>({
  actionStarted: ({dispatch}) => (key) => {
    dispatch(Actions.addInteraction({interactionKey: key}));
  },
  eventOccured: ({dispatch}) => (key) => {
    dispatch(Actions.addEvent({eventKey: key}));
  },
  minimalizeTour: ({dispatch}) => () => {
    setTimeout(() => {
      dispatch(Actions.minimalize({}));
    }, 300);
  },
});

const realDispatcher = compose(
  withConnect,
  withStatusHandlers,
);

const fakeDispatcher = withHandlers<IHandlersInputProps, ITourActionsHandlers>({
  actionStarted: ({dispatch}) => (key) => {},
  eventOccured: ({dispatch}) => (key) => {},
  minimalizeTour: ({dispatch}) => () => {},
});

const withFindContext = getContext({
  reactTourStore: PropTypes.object,
});

const withExtractStoreAvailable = mapProps((props: any) => {
  const {reactTourStore, ...remainingProps} = props;
  return {
    _tourStoreAvailable: !!reactTourStore,
    ...remainingProps,
  };
});

const withDecidedDispatcher = branch(
  (props: any) => {
    return props._tourStoreAvailable;
  },
  realDispatcher as any,
  fakeDispatcher as any,
);

export const withTourActionsDispatcher = compose(
  withFindContext,
  withExtractStoreAvailable,
  withDecidedDispatcher,
);
