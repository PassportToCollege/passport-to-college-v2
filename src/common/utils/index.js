import Cookies from "universal-cookie";
import moment from "moment";
import { auth } from "./firebase";

const cookies = new Cookies();

export const isBrowser = typeof window !== "undefined";

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

export const isStudent = () => {
  if (isAuthorized())
    return cookies.get("ssid").isStudent;

  return false;
}

export const isEmail = str => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  let emails = str.split(",");

  for (let email of emails) {
    if (!re.test(email))
      return re.test(email);
  }

  return true;
}

export const makeClassString = (classes = []) => {
  let str = "";
  
  if (!classes.length)
    return str;
    
  for (let c of classes) {
    str += `${c} `;
  }

  return str.trimRight();
}

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

      if (!text.length)
        return count;

      text = text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .split(" ");

      count += text.length;
      return count;
    });
  }

  return count;
};

export const convertBlocksToText = blocks => {
  let result = "";

  if (blocks.length) {
    blocks.map(block => {
      let { text } = block;
      text = text.trim();
      result = `${result} ${text}`;

      return result;
    })
  }

  return result;
}

export const queryToObject = query => {
  if (query) {
    query = query.replace("?", "")
      .split("&");
  
    let output = {};
  
    query.map(q => {
      q = q.split("=");
      output[q[0]] = q[1];

      return q;
    });
  
    return output;
  }

  return null;
}

export const countLikes = likes => {
  likes = likes || {};
  const keys = Object.keys(likes);
  let count = 0;

  for (let key of keys) {
    if (likes[key])
      count++;
  }

  return count;
}

export const initializeFacebook = (d, s, id) => {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=${process.env.RAZZLE_FACEBOOK_APP_ID}&autoLogAppEvents=1`;
  fjs.parentNode.insertBefore(js, fjs);
}

export const getClassificationYear = classification => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  switch (classification) {
    case "freshman":
    case "freshmen":
      if (month <= 5)
        return year + 3;

      return year + 4;
    case "sophomore":
    case "sophomores":
      if (month <= 5)
        return year + 2;

      return year + 3;
    case "junior":
    case "juniors":
      if (month <= 5)
        return year + 1;

      return year + 2;
    case "senior":
    case "seniors":
      if (month <= 5)
        return year;

      return year + 1;
    default:
      return 0;
  }
}

export const shuffle = (arr = []) => {
  if (!arr.length)
    return arr;

  let m = arr.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr;
}

export const verifyImageDimensions = (image, ratio = 133) => {
  return new Promise((resolve, reject) => {
    let ni = image.files[0],
      reader = new FileReader();
  
    reader.readAsDataURL(ni);
    reader.onload = e => {
      let dUrl = e.target.result,
        image = new Image();
  
      image.src = dUrl;
      image.onload = () => {
        const { width, height } = image;
        
        if (((width / height) * 100) >= ratio) {
          return resolve({
            image: ni,
            url: dUrl
          })
        }

        return reject({
          message: "ratio not met",
          url: dUrl
        });
      };
    };
  });
}

export const isProviderLinked = provider => {
  provider = provider.toLowerCase();

  const pi = auth.currentUser.providerData.findIndex(p => {
    return p.providerId.indexOf(provider) > -1;
  });

  return pi > -1;
}