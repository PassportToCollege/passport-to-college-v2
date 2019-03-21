import ActionTypes from "./actionTypes";

export const openHamburger = () => {
  return { type: ActionTypes.Hamburger.Open, hamburgerState: "open" };
};

export const closeHamburger = () => {
  return { type: ActionTypes.Hamburger.Close, hamburgerState: "closed" };
};