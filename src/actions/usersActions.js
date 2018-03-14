import { db } from "../utils/firebase";
import * as types from "./actionTypes";

const Console = console;

// GET actions
export const usersGetInitiated = (page, userType) => {
  return {
    type: types.USERS_GET_INITIATED,
    page, userType
  };
}

export const usersGetDone = (users, page, userType) => {
  return {
    type: types.USERS_GET_SUCCESS,
    page, userType, users
  };
}

export const usersGetFailed = (error, page, userType) => {
  return {
    type: types.USERS_GET_FAILED,
    page, userType, error
  };
}

export const doUsersGet = (page, userType) => {
  /*
  * USER TYPES
  * all, admins, students, applicants, staff
  */ 

  return dispatch => {
    dispatch(usersGetInitiated(page, userType));

    let type = "";

    switch (userType) {
      case "admins":
        type = "isAdmin";
        break;
      case "students":
        type = "isStudent";
        break;
      case "applicants":
        type = "isApplicant";
        break;
      case "staff":
        type = "isStaff";
        break;
      case "all":
      default:
        type = "all";
    }

    if (page === 1) {
      if (type === "all") {
        return db.collection("users")
          .orderBy("name.last")
          .limit(50)
          .get()
          .then(snapshots => {
            if (snapshots.empty)
              return dispatch(usersGetFailed({ empty: true }, page, userType));

            const data = [];
            snapshots.forEach(snapshot => {
              data.push(snapshot.data());
            });

            dispatch(usersGetDone(data, page, userType));
          })
          .catch(error => {
            Console.log(error);
            dispatch(usersGetFailed(error, page, userType));
          });
      } else {
        return db.collection("users")
          .where(type, "==", true)
          .orderBy("name.last")
          .limit(50)
          .get()
          .then(snapshots => {
            if (snapshots.empty)
              return dispatch(usersGetFailed({ empty: true }, page, userType));

            const data = [];
            snapshots.forEach(snapshot => {
              data.push(snapshot.data());
            });

            dispatch(usersGetDone(data, page, userType));
          })
          .catch(error => {
            Console.log(error);
            dispatch(usersGetFailed(error, page, userType));
          });
      }
    } else {
      if (type === "all") {
        return db.collection("users")
          .orderBy("name.last")
          .limit((page - 1) * 50)
          .get()
          .then(tempSnapshots => {
            const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

            return db.collection("users")
              .orderBy("name.last")
              .startAfter(lastVisible)
              .limit(50)
              .get()
              .then(snapshots => {
                if (snapshots.empty)
                  return dispatch(usersGetFailed({ empty: true }, page, userType));

                const data = [];
                snapshots.forEach(snapshot => {
                  data.push(snapshot.data());
                });

                dispatch(usersGetDone(data, page, userType));
              })
              .catch(error => {
                Console.log(error);
                dispatch(usersGetFailed(error, page, userType));
              });
          })
          .catch(error => {
            Console.log(error);
            dispatch(usersGetFailed(error, page, userType));
          });
      } else {
        return db.collection("users")
          .where(type, "==", true)
          .orderBy("name.last")
          .limit((page - 1) * 50)
          .get()
          .then(tempSnapshots => {
            const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

            return db.collection("users")
              .where(type, "==", true)
              .orderBy("name.last")
              .startAfter(lastVisible)
              .limit(50)
              .get()
              .then(snapshots => {
                if (snapshots.empty)
                  return dispatch(usersGetFailed({ empty: true }, page, userType));

                const data = [];
                snapshots.forEach(snapshot => {
                  data.push(snapshot.data());
                });

                dispatch(usersGetDone(data, page, userType));
              })
              .catch(error => {
                Console.log(error);
                dispatch(usersGetFailed(error, page, userType));
              });
          })
          .catch(error => {
            Console.log(error);
            dispatch(usersGetFailed(error, page, userType));
          });
      }
    }
  }
}