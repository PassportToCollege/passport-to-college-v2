import * as types from "./actionTypes";

export const makeDashMenuFull = () => {
  return {
    type: types.DASHBOARD_MENU_STATE_FULL
  };
}

export const makeDashMenuCompact = () => {
  return {
    type: types.DASHBOARD_MENU_STATE_COMPACT
  };
}

export const closeDashMenu = () => {
  return {
    type: types.DASHBOARD_MENU_STATE_CLOSED
  };
}