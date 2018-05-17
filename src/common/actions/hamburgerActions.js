import * as types from "./actionTypes";

export const openHamburger = () => {
  return { type: types.OPEN_HAMBURGER, hamburgerState: "open" };
};

export const closeHamburger = () => {
  return { type: types.CLOSE_HAMBURGER, hamburgerState: "closed" };
};