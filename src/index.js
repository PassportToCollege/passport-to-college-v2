import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import configureStore from "./store/configureStore";
import Routes from "./routes";
import registerServiceWorker from './utils/registerServiceWorker';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>    , 
  document.getElementById('root')
);

registerServiceWorker();
