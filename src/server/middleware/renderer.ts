import Helmet from "react-helmet";
import postMeta from "./post-meta";

export default (req : any, res : any, markup : string) => {
  const { url } = req;
  const assets = process.env.RAZZLE_ASSETS_MANIFEST || "";
  const helmet = Helmet.renderStatic();

  if (url.indexOf("stories") > -1 && url.indexOf("read") > -1) {
    const id = url.split("/")[3];

    postMeta(id).then((results : any) => {
      if (results.error) {
        res.status(200).send(
            `
            <!doctype html>
            <html lang="">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content="${process.env.RAZZLE_URL}/${url}" />
                  ${helmet.meta.toString()}
                  ${helmet.title.toString()}
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <link href="//fonts.googleapis.com/css?family=Muli:400,600,700,800,900|Nunito:200,400,800,900|Roboto:100,400,400i,500,700,900|Playfair+Display:400,400i,700,700i,900,900i" rel="stylesheet" />
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
            </html>
          `
        )
      } else {
        res.status(200).send(
          `
            <!doctype html>
            <html lang="">
              <head>
                  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                  <meta charset="utf-8" />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content="${process.env.RAZZLE_URL}/${url}" />
                  ${results.metas}
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <link href="//fonts.googleapis.com/css?family=Muli:400,600,700,800,900|Nunito:200,400,800,900|Roboto:100,400,400i,500,700,900|Playfair+Display:400,400i,700,700i,900,900i" rel="stylesheet" />
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
            </html>
          `
        );
      }
    });
  } else {
    res.status(200).send(
      `
        <!doctype html>
        <html lang="">
          <head>
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta charset="utf-8" />
              ${helmet.meta.toString()}
              ${helmet.title.toString()}
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <link href="//fonts.googleapis.com/css?family=Muli:400,600,700,800,900|Nunito:200,400,800,900|Roboto:100,400,400i,500,700,900|Playfair+Display:400,400i,700,700i,900,900i" rel="stylesheet" />
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
        </html>
      `
    );
  }
};