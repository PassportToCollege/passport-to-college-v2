import { db } from "../utils/firebase";

export default  {
  updateStudentFromUser : user => {
    return new Promise((resolve, reject) => {
      const { uid } = user;
  
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

  updateApplicationFromUser : user => {
    return new Promise((resolve, reject) => {
      const { uid } = user;

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
