import React from 'react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import cookieParser from "cookie-parser";
import { renderToString } from 'react-dom/server';

import reducers from "../common/reducers";
import App from "../common/containers/App";

import handleRedirects from "./middleware/handle-redirects";

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(cookieParser())
  .get('/*', (req, res) => {
    const context = {};
    const store = createStore(reducers);

    const markup = renderToString(
      <Provider store={store}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    );

    handleRedirects(context, req, res, markup);
  });

export default server;
