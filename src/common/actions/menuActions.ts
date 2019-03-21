import ActionTypes from "./actionTypes";

export const makeDashMenuFull = () => {
  return {
    type: ActionTypes.Menu.Full
  };
}

export const makeDashMenuCompact = () => {
  return {
    type: ActionTypes.Menu.Compact
  };
}

export const closeDashMenu = () => {
  return {
    type: ActionTypes.Menu.Closed
  };
}