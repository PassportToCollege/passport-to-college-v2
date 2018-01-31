import * as types from "./actionTypes";

export const openHamburger = () => {
  return { type: types.OPEN_HAMBURGER, hamburgerOpen: true };
};

export const closeHamburger = () => {
  return { type: types.CLOSE_HAMBURGER, hamburgerOpen: false };
};