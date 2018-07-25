import { db, storage } from ".";
import { isBrowser } from "../index";

export const getUser = uid => {
  return new Promise((resolve, reject) => {
    if (!uid.length)
      return reject({ message: "no uid provided" });

      db.collection("users")
        .doc(uid)
        .get()
        .then(snapshot => {
          if (!snapshot.exists)
            return reject({ message: "user not found" });

          resolve(snapshot.data);
        })
        .catch(error => {
          reject(error);
        });
  });
}

export const getPostHero = id => {
  return new Promise((resolve, reject) => {
    if (!id.length)
      return reject({ message: "no id provided" });

    if (storage && isBrowser) {
      storage.ref("posts/heros")
        .child(`${id}.png`)
        .getDownloadURL()
        .then(url => {
          resolve(url);
        })
        .catch(error => {
          reject(error);
        })
    } else {
      reject({ message: "unsupported environment" });
    }
  });
}