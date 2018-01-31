import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import configureStore from "./store/configureStore";
import App from "./containers/App";
import registerServiceWorker from './utils/registerServiceWorker';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>    , 
  document.getElementById('root')
);

registerServiceWorker();
