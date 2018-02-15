import Cookies from "universal-cookie";

const cookies = new Cookies();

export const activeUser = cookies.get("ssid").uid;

export const isAuthorized = () => {
  return !!cookies.get("ssid");
}

export const isAdmin = () => {
  return cookies.get("ssid").isAdmin;
}

export const isApplicant = () => {
  return cookies.get("ssid").isApplicant;
}