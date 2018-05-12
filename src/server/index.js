import React from 'react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import { renderToString } from 'react-dom/server';

import reducers from "../common/reducers";
import configureStore from "../common/store/configureStore";
import App from "../common/containers/App";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
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

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
          <html lang="">
            <head>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta charset="utf-8" />
                <title>Passport to College | ${req.url}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link href="//fonts.googleapis.com/css?family=Muli:400,600,700,800,900|Nunito:200,400,800,900|Roboto:100,400,400i,500,700,900" rel="stylesheet" />
                ${assets.client.css
                  ? `<link rel="stylesheet" href="${assets.client.css}">`
                  : ''}
                ${process.env.NODE_ENV === 'production'
                  ? `<script src="${assets.client.js}" defer></script>`
                  : `<script src="${assets.client.js}" defer crossorigin></script>`}
            </head>
            <body>
                <div id="root">${markup}</div>
            </body>
          </html>`
      );
    }
  });

export default server;
