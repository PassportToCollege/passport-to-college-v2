import app from "./server";
import http from "http";

const Console = console;
const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    Console.log(error);
  }

  Console.log("🚀 started");
});

if (module.hot) {
  Console.log("✅  Server-side HMR Enabled!");

  module.hot.accept("./server/index", () => {
    Console.log("🔁  HMR Reloading `./server`...");
    server.removeListener("request", currentApp);
    const newApp = require("./server").default;
    server.on("request", newApp);
    currentApp = newApp;
  });
}
