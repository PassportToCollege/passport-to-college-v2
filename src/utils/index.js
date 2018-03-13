import Cookies from "universal-cookie";
import moment from "moment";

const cookies = new Cookies();

export const activeUser = () => {
  if (isAuthorized())
    return cookies.get("ssid").uid;

  return null;
};

export const isAuthorized = () => {
  return !!cookies.get("ssid");
};

export const isAdmin = () => {
  if (isAuthorized())
    return cookies.get("ssid").isAdmin;
  
    return false;
};

export const isApplicant = () => {
  if (isAuthorized())
    return cookies.get("ssid").isApplicant;
  
    return false;
};

export const sessionAge = () => {
  const { createdAt } = cookies.get("ssid");
  const end = moment(new Date());
  const age = moment.duration(end.diff(createdAt));

  return age.asHours();
};

export const getTestKey = test => {
  let key = test.subject.toLowerCase().replace(/\s/g, "-");
  key += `-${test.board.toLowerCase().replace(/\s/g, "-")}`;
  key += `-${test.examination.toLowerCase().replace(/\s/g, "-")}`;

  return key;
};

export const getWordCount = blocks => {
  let count = 0;

  if (blocks.length) {
    blocks.map(block => {
      let { text } = block;
      text = text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ")
        .split(" ");

      count += text.length;
      return count;
    });
  }

  return count;
};

export const queryToObject = query => {
  query = query.replace("?", "")
    .split("&");

  let output = {};

  query.map(q => {
    q = q.split("=");
    output[q[0]] = q[1];
  });

  return output;
}