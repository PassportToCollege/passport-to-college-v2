import { uid } from "rand-token";
import axios from "axios";
import _ from "lodash";

import { db } from "../utils/firebase";
import * as types from "./actionTypes";
import { doCreateStudent } from "./studentActions";

const EMAIL_API = process.env.RAZZLE_EMAIL_API;
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
              return dispatch(usersGetDone({ empty: true }, page, userType));

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
              return dispatch(usersGetDone({ empty: true }, page, userType));

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
                  return dispatch(usersGetDone({ empty: true }, page, userType));

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
                  return dispatch(usersGetDone({ empty: true }, page, userType));

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

export const userGetByIdInitiated = user => {
  return {
    type: types.USER_GET_BY_ID_INITIATED,
    user
  };
}

export const userGetByIdDone = (user) => {
  return {
    type: types.USER_GET_BY_ID_SUCCESS,
    user
  };
}

export const userGetByIdFailed = (error, user) => {
  return {
    type: types.USER_GET_BY_ID_FAILED,
    user, error
  };
}

export const doGetUserByUid = uid => {
  return dispatch => {
    dispatch(userGetByIdInitiated(uid));

    db.collection("users")
      .doc(uid)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          return dispatch(userGetByIdDone(snapshot.data()));
        }

        dispatch(userGetByIdFailed({message: "no user found"}, uid));
      })
      .catch(error => {
        dispatch(userGetByIdFailed(error, uid));
      })
  }
}

export const usersGetByIdInitiated = users => {
  return {
    type: types.USERS_GET_BY_ID_INITIATED,
    users
  };
}

export const usersGetByIdDone = (users) => {
  return {
    type: types.USERS_GET_BY_ID_SUCCESS,
    users
  };
}

export const usersGetByIdFailed = (error, users) => {
  return {
    type: types.USERS_GET_BY_ID_FAILED,
    users, error
  };
}

export const doGetUsersByUid = (users = []) => {
  return dispatch => {
    if (!users.length)
      return dispatch(usersGetByIdFailed({ message: "no uids provided" }, []));

    dispatch(usersGetByIdInitiated(users));

    let promises = [];
    for (let user of users) {
      promises.push(db.collection("users").doc(user).get());
    }

    Promise.all(promises)
      .then(snapshots => {
        let users = [];

        for (let snapshot of snapshots) {
          if (!snapshot.empty)
            users.push(snapshot.data());
        }

        dispatch(usersGetByIdDone(users));
      })
      .catch(error => {
        Console.log(error);
        dispatch(usersGetByIdFailed(error, users));
      })
  }
}

export const getFounderInitiated = () => {
  return {
    type: types.USERS_GET_FOUNDER_FAILED
  };
};

export const getFounderFailed = error =>  {
  return {
    type: types.USERS_GET_FOUNDER_FAILED,
    error
  };
};

export const gotFounder = founder => {
  return {
    type: types.GOT_FOUNDER,
    founder
  };
};

export const doGetFounder = () => {
  return dispatch => {
    dispatch(getFounderInitiated());

    db.collection("users")
      .where("isStaff", "==", true)
      .where("role", "==", "Founder")
      .get()
      .then(snapshots => {
        if (snapshots.empty)
          dispatch(getFounderFailed({ message: "founder not found" }));

        let founder;
        snapshots.forEach(snapshot => {
          founder = snapshot.data();
        });

        dispatch(gotFounder(founder));
      })
      .catch(error => {
        dispatch(getFounderFailed(error));
      })
  };
};

export const getStaffInitiated = () => {
  return {
    type: types.USERS_GET_STAFF_INITIATED
  };
};

export const getStaffFailed = error => {
  return {
    type: types.USERS_GET_STAFF_FAILED,
    error
  };
};

export const gotStaff = staff => {
  return {
    type: types.GOT_STAFF,
    staff
  };
};

export const doGetStaff = () => {
  return dispatch => {
    dispatch(getStaffInitiated());

    db.collection("users")
      .where("isStaff", "==", true)
      .get()
      .then(staffSnaps => {
        if (staffSnaps.empty)
          return dispatch(getStaffFailed({ message: "no staff found" }));

        let staff = [];
        let studentStaff = [];

        staffSnaps.forEach(snap => {
          let data = snap.data();

          if (data.isStudent) {
            studentStaff.push(data.uid);
          } else if (!data.isStudent && data.role !== "Founder") {
            staff.push(data);
          }
        });

        if (studentStaff.length) {
          let promises = [];
          for (let student of studentStaff) {
            promises.push(db.collection("students").doc(student).get());
          }

          Promise.all(promises)
            .then(snapshots => {
              if (!snapshots.length)
                return dispatch(getStaffFailed({ message: "no student staff found" }));

              for (let snapshot of snapshots) {
                if (!snapshot.empty)
                  staff.push(snapshot.data());
              }

              dispatch(gotStaff(staff));
            })
            .catch(error => {
              dispatch(getStaffFailed(error));
            })
        } else {
          dispatch(gotStaff(staff));
        }
      })
      .catch(error => {
        dispatch(getStaffFailed(error));
      })
  };
};

// CREATE actions
export const createUserInitiated = data => {
  return {
    type: types.USERS_CREATE_USER_INITIATED,
    data
  };
};

export const createUserFailed = (error, data) => {
  return {
    type: types.USERS_CREATE_USER_FAILED,
    error, data
  };
};

export const userCreated = (data, accountType = "temp") => {
  return {
    type: types.USERS_NEW_USER_CREATED,
    data,
    accountType
  };
};

export const sendSignupEmailInitiated = email => {
  return {
    type: types.USERS_SEND_SIGNUP_EMAIL_INITIATED,
    email
  };
};

export const signupEmailSent = email => {
  return {
    type: types.USERS_SIGNUP_EMAIL_SENT,
    email
  };
};

export const sendSignupEmailFailed = (error, email) => {
  return {
    type: types.USERS_SEND_SIGNUP_EMAIL_FAILED,
    error, email
  };
};

export const doCreateUser = data => {
  return dispatch => {
    dispatch(createUserInitiated(data));

    const { email } = data;

    db.collection("users")
      .where("email", "==", email)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          const tempUid = `temp_${uid(16)}`;
          let userData = {
            uid: tempUid,
            email: data.email,
            isAdmin: data.roles.admin || false,
            isApplicant: false,
            isStudent: data.roles.student || false,
            isStaff: data.roles.staff || false,
            emailConfirmed: false 
          }

          let name = data.name.split(" ");

          if (name.length === 3) {
            userData.name = {
              first: name[0],
              middle: name[1],
              last: name[2],
              full: [name[0], name[2]].join(" ")
            }
          } else {
            userData.name = {
              first: name[0],
              last: name[1],
              full: data.name
            }
          }

          return db.collection("users")
            .doc(tempUid)
            .set(userData)
            .then(() => {
              dispatch(userCreated(data));
              dispatch(sendSignupEmailInitiated(data.email));

              // send signup email
              axios.get(`${EMAIL_API}/s/signup/${tempUid}`)
                .then(() => {
                  dispatch(signupEmailSent(email));
                })
                .catch(error => {
                  dispatch(sendSignupEmailFailed(error, data.email))
                });
            })
            .catch(error => {
              dispatch(createUserFailed(error, data.email));
            });
        }

        return dispatch(createUserFailed({ message: "User found already exists" }, data));
      });
  }
}

export const doCreateFullUser = (user = {}, student = {}) => {
  return dispatch => {
    if (!Object.keys(user).length)
      return dispatch(createUserFailed({ message: "no user data provided" }, null));

    dispatch(createUserInitiated(user));

    const { email } = user;
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then(snapshot => {
        if (!snapshot.empty)
          return dispatch(createUserFailed({ message: "user already exists" }, user));

        if (!user.uid)
          user.uid = `${uid(24)}_ac_less`;

        return db.collection("users")
          .doc(user.uid)
          .set(user)
          .then(() => {
            dispatch(userCreated(user, "full"));

            if (Object.keys(student).length) {
              dispatch(doCreateStudent(student));
            }
          })
          .catch(error => {
            dispatch(createUserFailed(error, user));
          });
      })
  }
};

// UPDATE actions
export const userUpdateInitiated = (uid, data) => {
  return {
    type: types.USERS_UPDATE_INITIATED,
    user: uid,
    data
  };
};

export const userUpdated = (uid, data) => {
  return {
    type: types.USERS_UPDATED,
    user: uid,
    data
  };  
};

export const userUpdateFailed = (error, uid, data) => {
  return {
    type: types.USERS_UPDATED,
    user: uid,
    data, error
  };  
};

export const doUserUpdate = (uid, data, options) => {
  return dispatch => {
    dispatch(userUpdateInitiated(uid, data));

    options = options || {};

    if (data.name && "string" === typeof data.name) {
      let name = data.name.split(" ");

      if (name.length === 3) {
        data.name = {
          first: name[0],
          middle: name[1],
          last: name[2],
          full: [name[0], name[2]].join(" ")
        }
      } else {
        data.name = {
          first: name[0],
          last: name[1],
          full: data.name
        }
      }
    }

    db.collection("users")
      .doc(uid)
      .update(data)
      .then(() => {
        dispatch(userUpdated(uid, data));

        // dispatch user get to update props
        // with new user data
        if (options.refresh)
          return dispatch(doGetUserByUid(uid));
      })
      .catch(error => {
        return dispatch(userUpdateFailed(error, uid, data));
      })
  }
};

export const addBioInitiated = (user, bio) => {
  return {
    type: types.USERS_ADD_BIO_INITIATED,
    user,
    bio
  };
};

export const addBioFailed = (error, user, bio) => {
  return {
    type: types.USERS_ADD_BIO_FAILED,
    error,
    user,
    bio
  };
};

export const bioAdded = (user, bio) => {
  return {
    type: types.ADDED_BIO,
    user, bio
  };
};

export const doAddBio = (user = "", bio = {}, options = {}) => {
  return dispatch => {
    if (typeof user !== "string" && !user.length)
      return dispatch(addBioFailed({ message: "invalid/no user provided" }, user, bio));

    if (typeof bio !== "object" && _.isEmpty(bio))
      return dispatch(addBioFailed({ message: "invalid/no bio provided" }, user, bio));

    dispatch(addBioInitiated(user, bio));

    db.collection("users")
      .doc(user)
      .update({ bio })
      .then(() => {
        dispatch(bioAdded(user, bio));

        // dispatch user get to update props
        // with new user data
        if (options.refresh)
          return dispatch(doGetUserByUid(user));
      })
      .catch(error => {
        dispatch(addBioFailed(error, user, bio));
      });
  };
};