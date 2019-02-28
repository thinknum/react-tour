import * as React from "react";
import { createProvider } from 'react-redux';
import { createStore } from 'redux';
import { initialState, reducer } from "state/reducer";

const STORE_KEY = 'react-tour-store'
const Provider = createProvider(STORE_KEY)

const store = createStore(reducer, initialState)

const TourProvider: React.SFC = (props) => (
  <Provider store={store}>
    {props.children}
  </Provider>
);

export default TourProvider;
