import {initialState, reducer} from "state/reactTour/reducer";
import * as React from "react";
import {createProvider} from "react-redux";
import {applyMiddleware, compose, createStore, Middleware} from "redux";

// Debugging setup

const environment = process.env.NODE_ENV as Environment;
const REDUX_DEVTOOLS_COMPOSE = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

enum Environment {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

const ENHANCER_COMPOSERS = {
  [Environment.PRODUCTION]: compose,
  [Environment.DEVELOPMENT]: REDUX_DEVTOOLS_COMPOSE || compose,
};
const composeEnhancers = ENHANCER_COMPOSERS[environment];

const allMiddlewares: Middleware[] = [];
if (environment === Environment.DEVELOPMENT) {
  const {createLogger} = require("redux-logger");
  allMiddlewares.push(
    createLogger({
      collapsed: true,
      timestamp: false,
      colors: {
        title: (action: any) => "blue",
      },
    }),
  );
}

// End debugging setup

export const STORE_KEY = "reactTourStore";
const Provider = createProvider(STORE_KEY);

const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(...allMiddlewares)));

const ReactTourProvider: React.SFC = (props) => <Provider store={store}>{props.children}</Provider>;

export default ReactTourProvider;
