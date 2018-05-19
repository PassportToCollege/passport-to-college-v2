import React from 'react';
import { createStore } from "redux";
import { Provider } from "react-redux";
import { StaticRouter } from 'react-router-dom';
import express from 'express';
import cookieParser from "cookie-parser";
import { renderToString } from 'react-dom/server';

import reducers from "../common/reducers";
import App from "../common/containers/App";

import Renderer from "./middleware/renderer";

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
    
    if (context.url) {
      let { ssid } = req.cookies;
      const { url } = req;

      if (ssid === undefined) {
        return res.redirect(context.url);
      }
      
      ssid = JSON.parse(ssid);
      
      if (url.indexOf("admin") > -1) {
        if (ssid.isAdmin)
          return Renderer(req, res, markup);
        
        if (ssid.isApplicant)
          return res.redirect(`/apply/p/${ssid.uid}`);
      }

      if (url === "/") {
        if (ssid.isApplicant)
          return res.redirect(`/apply/p/${ssid.uid}`);

        if (ssid.isAdmin)
          return res.redirect("/admin/dashboard");
      }

      if (url.indexOf("apply") > -1) {
        if (ssid.isApplicant)
          return Renderer(req, res, markup);
        
        if (ssid.isAdmin)
          return res.redirect("/admin/dashboard");
      }

      return res.redirect(process.env.MAIN_URL);
    } else {
      Renderer(req, res, markup);
    }
  });

export default server;
