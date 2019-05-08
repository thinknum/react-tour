import * as PropTypes from "prop-types";
import {branch, compose, getContext, mapProps, withHandlers} from "recompose";
import * as Actions from "state/reactTour/actions";

export interface ITourActionsHandlers {
  actionStarted: (key: string) => void;
  eventOccured: (key: string) => void;
  minimalizeTour: () => void;
}

export interface ITourDispatch {
  _tourDispatch: any;
}

// const withConnect = connect(
//   undefined,
//   (dispatch) => {
//     return {
//       _tourDispatch: dispatch,
//     };
//   },
//   undefined,
//   {
//     storeKey: STORE_KEY,
//   },
// );

type IHandlersInputProps = ITourDispatch;

const withStatusHandlers = withHandlers<IHandlersInputProps, ITourActionsHandlers>({
  actionStarted: ({_tourDispatch}) => (key) => {
    // _tourDispatch(Actions.addInteraction({interactionKey: key}));
  },
  eventOccured: ({_tourDispatch}) => (key) => {
    // _tourDispatch(Actions.addEvent({eventKey: key}));
  },
  minimalizeTour: ({_tourDispatch}) => () => {
    // setTimeout(() => {
    //   _tourDispatch(Actions.minimalize({}));
    // }, 300);
  },
});

const realDispatcher = compose(
  // withConnect,
  withStatusHandlers,
);

const fakeDispatcher = withHandlers<IHandlersInputProps, ITourActionsHandlers>({
  actionStarted: () => (key) => {},
  eventOccured: () => (key) => {},
  minimalizeTour: () => () => {},
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
