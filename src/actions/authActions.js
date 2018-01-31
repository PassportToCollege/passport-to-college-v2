import * as types from "./actionTypes";
import { auth } from "../firebase";

export const doSignIn = (email, password) => {
  auth.doSignInWithEmailAndPassword(email, password)
    .then(user => {
      return { type: types.SIGN_IN, user }
    });
}