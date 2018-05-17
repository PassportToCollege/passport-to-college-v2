import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer from "../reducers/index";

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(thunkMiddleware)
  );

  if (module.hot) {
    module.hot.accept("../reducers", () => {
      const nextReducer = require("../reducers").default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default configureStore;