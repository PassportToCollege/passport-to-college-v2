import Cookies from "universal-cookie";
import moment from "moment";
import { auth } from "./firebase";
import iTest from "../imodels/iTest";
import iContentEditableBlock from "../imodels/iContentEditableBlock";
import { iStringBooleanPair } from "../imodels/iObjectTypes";

const cookies = new Cookies();

export const isBrowser = typeof window !== "undefined";

export const activeUser = () : any => {
  if (isAuthorized())
    return JSON.parse(cookies.get("ssid"));

  return null;
};

export const isAuthorized = () : boolean => {
  return !!cookies.get("ssid");
};

export const isAdmin = () : boolean => {
  if (isAuthorized())
    return JSON.parse(cookies.get("ssid")).isAdmin;
  
    return false;
};

export const isApplicant = () : boolean => {
  if (isAuthorized())
    return JSON.parse(cookies.get("ssid")).isApplicant;
  
    return false;
};

export const isStudent = () : boolean => {
  if (isAuthorized())
    return JSON.parse(cookies.get("ssid")).isStudent;

  return false;
}

export const isEmail = (str : string) : boolean => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  let emails = str.split(",");

  for (let email of emails) {
    if (!re.test(email))
      return re.test(email);
  }

  return true;
}

export const makeClassString = (classes : string[] = []) : string => {
  let str = "";
  
  if (!classes.length)
    return str;
    
  for (let c of classes) {
    str += `${c} `;
  }

  return str.trimRight();
}

export const sessionAge = () : number => {
  const { createdAt } = JSON.parse(cookies.get("ssid"));
  const end = moment(new Date());
  const age = moment.duration(end.diff(createdAt));

  return age.asHours();
};

export const getTestKey = (test : iTest) : string => {
  let key = test.subject.toLowerCase().replace(/\s/g, "-");
  key += `-${test.board.toLowerCase().replace(/\s/g, "-")}`;
  key += `-${test.examination.toLowerCase().replace(/\s/g, "-")}`;

  return key;
};

export const getWordCount = (blocks : iContentEditableBlock[]) : number => {
  let count = 0;

  if (blocks.length) {
    blocks.map(block => {
      const { text } = block;

      if (!text.length)
        return count;

      let textArray : string[] = text.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ")
        .trim()
        .split(" ");

      count += textArray.length;
      return count;
    });
  }

  return count;
};

export const convertBlocksToText = (blocks : iContentEditableBlock[]) : string => {
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

export const queryToObject = (query : string) : any => {
  if (query) {
    let splitQuery = query.replace("?", "")
      .split("&");
  
    let output = {};
  
    splitQuery.map(q => {
      let splitQ = q.split("=");
      output[splitQ[0]] = splitQ[1];

      return splitQ;
    });
  
    return output;
  }

  return null;
}

export const countLikes = (likes : iStringBooleanPair) : number => {
  const keys = Object.keys(likes);
  let count = 0;

  for (let key of keys) {
    if (likes[key])
      count++;
  }

  return count;
}

export const initializeFacebook = (d : any, s : string, id : string) : void => {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); 
  js.id = id;
  js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=${process.env.RAZZLE_FACEBOOK_APP_ID}&autoLogAppEvents=1`;
  fjs.parentNode.insertBefore(js, fjs);
}

export const getClassificationYear = (classification : string) : number => {
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

export const shuffle = (arr : any[] = []) : any[] => {
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

export const verifyImageDimensions = (image : any, ratio = 133) : Promise<any> => {
  return new Promise((resolve, reject) => {
    let ni = image.files[0],
      reader = new FileReader();
  
    reader.readAsDataURL(ni);
    reader.onload = (e : any) : any => {
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
          url: dUrl,
          ratio: (width / height) * 100
        });
      };
    };
  });
}

export const isProviderLinked = (provider : string) : boolean => {
  provider = provider.toLowerCase();

  const pi = auth.currentUser.providerData.findIndex((p : any) => {
    return p.providerId.indexOf(provider) > -1;
  });

  return pi > -1;
}

export const makeRGB = (arr : number[] = [0,0,0], opacity : number = 1) : string => {
  if (arr.length < 3 || arr.length > 3)
    return "rgba(0,0,0,1)";

  return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${opacity})`;
}