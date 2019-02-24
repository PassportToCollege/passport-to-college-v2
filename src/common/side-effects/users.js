import { db } from "../utils/firebase";

export default  {
  updateStudentFromUser : (uid, user) => {
    return new Promise((resolve, reject) => {
      if (!uid.length) 
        return reject({ message:  "no uid provided" });

      db
        .collection("students")
        .doc(uid)
        .update({
          user: user
        })
        .then(() => resolve())
        .catch(error => reject(error))
    });
  },

  updateApplicationFromUser : (uid, user) => {
    return new Promise((resolve, reject) => {
      if (!uid.length) 
        return reject({ message:  "no uid provided" });

      db
        .collection("applications")
        .doc(uid)
        .update({
          user: user
        })
        .then(() => resolve())
        .catch(error => reject(error))
    });
  }
}
