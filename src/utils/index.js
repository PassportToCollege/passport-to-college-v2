import Cookies from "universal-cookie";
import moment from "moment";

const cookies = new Cookies();

export const activeUser = () => {
  if (isAuthorized())
    return cookies.get("ssid").uid;

  return null;
}

export const isAuthorized = () => {
  return !!cookies.get("ssid");
}

export const isAdmin = () => {
  if (isAuthorized())
    return cookies.get("ssid").isAdmin;
  
    return false;
}

export const isApplicant = () => {
  if (isAuthorized())
    return cookies.get("ssid").isApplicant;
  
    return false;
}

export const sessionAge = () => {
  const { createdAt } = cookies.get("ssid");
  const end = moment(new Date());
  const age = moment.duration(end.diff(createdAt));

  return age.asHours();
}