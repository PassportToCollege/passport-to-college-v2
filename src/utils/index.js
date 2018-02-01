import Cookies from "universal-cookie";

const cookies = new Cookies();

export const isAuthorized = () => {
  return !!cookies.get("ssid");
}

export const isAdmin = () => {
  return cookies.get("ssid").isAdmin;
}