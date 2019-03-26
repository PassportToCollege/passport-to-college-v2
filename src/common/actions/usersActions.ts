import { uid } from "rand-token";
import axios from "axios";
import _ from "lodash";

import ActionTypes from "./actionTypes";
import iContentEditable from "../imodels/iContentEditable";
import User from "../models/User";
import Student from "../models/Student";
import { UserType } from "../imodels/iUser";

import { isEmail } from "../utils";
import { db } from "../utils/firebase";
import { doCreateStudent } from "./studentActions";

const UsersActions = ActionTypes.Users;
const EMAIL_API = process.env.REACT_APP_EMAIL_API;
const Console = console;

// GET actions
export const usersGetInitiated = (page : number, userType : UserType) : any => {
  return {
    type: UsersActions.GettingUsers,
    page, userType
  };
}

export const usersGetDone = (users : Array<User>, page : number, userType : UserType) : any => {
  return {
    type: UsersActions.GotUsers,
    page, userType, users
  };
}

export const usersGetFailed = (error : any, page : number, userType : UserType) => {
  return {
    type: UsersActions.GettingUsersFailed,
    page, userType, error
  };
}

export const doUsersGet = (page : number, userType : UserType) : any => {
  return (dispatch : any) => {
    dispatch(usersGetInitiated(page, userType));

    if (userType === UserType.Any) {
      getUsersOfAnyType(dispatch, page);
    } else {
      getUsersByType(dispatch, page, userType);
    }
  }
}

const getUsersOfAnyType = (dispatch : any, page : number) : any => {
  if (page === 1) {
    return db.collection("users")
      .orderBy("name.last")
      .limit(50)
      .get()
      .then((snapshots: any) => {
        if (snapshots.empty)
          return dispatch(usersGetFailed({ message: "No users found." }, page, UserType.Any));
  
        const users = getUsersFromSnapshot(snapshots);
        dispatch(usersGetDone(users, page, UserType.Any));
      })
      .catch((error: any) => {
        Console.log(error);
        dispatch(usersGetFailed(error, page, UserType.Any));
      });
  }

  return db.collection("users")
    .orderBy("name.last")
    .limit((page - 1) * 50)
    .get()
    .then((tempSnapshots : any) => {
      const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

      return db.collection("users")
        .orderBy("name.last")
        .startAfter(lastVisible)
        .limit(50)
        .get()
        .then((snapshots : any) => {
          if (snapshots.empty)
            return dispatch(usersGetFailed({ message: "No users found." }, page, UserType.Any));

          const users = getUsersFromSnapshot(snapshots);
          dispatch(usersGetDone(users, page, UserType.Any));
        })
        .catch((error : any) => {
          Console.log(error);
          dispatch(usersGetFailed(error, page, UserType.Any));
        });
    })
    .catch((error : any) => {
      Console.log(error);
      dispatch(usersGetFailed(error, page, UserType.Any));
    });
}

const getUsersByType = (dispatch : any, page : number, userType : UserType) => {
  let type = "any";

  switch (userType) {
    case UserType.Admin:
      type = "isAdmin";
      break;
    case UserType.Student:
      type = "isStudent";
      break;
    case UserType.Applicant:
      type = "isApplicant";
      break;
    case UserType.Staff:
      type = "isStaff";
      break;
    case UserType.Any:
    default:
      type = "any";
  }

  if (page === 1) {
    return db.collection("users")
      .where(type, "==", true)
      .orderBy("name.last")
      .limit(50)
      .get()
      .then((snapshots : any) => {
        if (snapshots.empty)
          return dispatch(usersGetFailed({ message: "No users found." }, page, userType));
  
        const users = getUsersFromSnapshot(snapshots);
        dispatch(usersGetDone(users, page, userType));
      })
      .catch((error : any) => {
        Console.log(error);
        dispatch(usersGetFailed(error, page, userType));
      });
  }

  return db.collection("users")
    .where(type, "==", true)
    .orderBy("name.last")
    .limit((page - 1) * 50)
    .get()
    .then((tempSnapshots : any) => {
      const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

      return db.collection("users")
        .where(type, "==", true)
        .orderBy("name.last")
        .startAfter(lastVisible)
        .limit(50)
        .get()
        .then((snapshots : any) => {
          if (snapshots.empty)
            return dispatch(usersGetFailed({ message: "No users found." }, page, userType));

          const users = getUsersFromSnapshot(snapshots);
          dispatch(usersGetDone(users, page, userType));
        })
        .catch((error : any) => {
          Console.log(error);
          dispatch(usersGetFailed(error, page, userType));
        });
    })
    .catch((error : any) => {
      Console.log(error);
      dispatch(usersGetFailed(error, page, userType));
    });
}

const getUsersFromSnapshot = (snapshots: any): Array<User> => {
  let users: Array<User> = [];

  snapshots.forEach((snapshot: any) => {
    const userData = snapshot.data();
    users.push(new User(userData));
  });

  return users;
}

export const userGetByIdInitiated = (user : string) : any => {
  return {
    type: UsersActions.GettingUser,
    user
  };
}

export const userGetByIdDone = (user : User) : any => {
  return {
    type: UsersActions.GotUsers,
    user
  };
}

export const userGetByIdFailed = (error : any, user : string) : any => {
  return {
    type: UsersActions.GettingUserFailed,
    user, error
  };
}

export const doGetUserByUid = (uid : string) : any => {
  return (dispatch : any) => {
    dispatch(userGetByIdInitiated(uid));

    db.collection("users")
      .doc(uid)
      .get()
      .then((snapshot : any) => {
        if (snapshot.exists) {
          const user = new User(snapshot.data());
          return dispatch(userGetByIdDone(user));
        }

        dispatch(userGetByIdFailed({message: "no user found"}, uid));
      })
      .catch((error : any) => {
        dispatch(userGetByIdFailed(error, uid));
      })
  }
}

export const usersGetByIdInitiated = (users : Array<string>) : any => {
  return {
    type: UsersActions.GettingUsers_ByUid,
    users
  };
}

export const usersGetByIdDone = (users : Array<User>) : any => {
  return {
    type: UsersActions.GotUsers_ByUid,
    users
  };
}

export const usersGetByIdFailed = (error : any, users : Array<string>) : any => {
  return {
    type: UsersActions.GettingUsersFailed_ByUid,
    users, error
  };
}

export const doGetUsersByUid = (users : Array<string> = []) : any => {
  return (dispatch : any) => {
    if (users.length < 1)
      return dispatch(usersGetByIdFailed({ message: "no uids provided" }, []));

    dispatch(usersGetByIdInitiated(users));

    let promises : any = [];
    for (let user of users) {
      promises.push(db.collection("users").doc(user).get());
    }

    Promise.all(promises)
      .then((snapshots : any) => {
        let users : Array<User> = [];
        for (let snapshot of snapshots) {
          if (!snapshot.empty) {
            let user = new User(snapshot.data());
            users.push(user);
          }
        }

        dispatch(usersGetByIdDone(users));
      })
      .catch((error : any) => {
        Console.log(error);
        dispatch(usersGetByIdFailed(error, users));
      })
  }
}

export const getFounderInitiated = () : any => {
  return {
    type: UsersActions.GettingFounder
  };
};

export const getFounderFailed = (error : any) : any =>  {
  return {
    type: UsersActions.GettingFounderFailed,
    error
  };
};

export const gotFounder = (founder : User) : any => {
  return {
    type: UsersActions.GotFounder,
    founder
  };
};

export const doGetFounder = () : any => {
  return (dispatch : any) => {
    dispatch(getFounderInitiated());

    db.collection("users")
      .where("isStaff", "==", true)
      .where("role", "==", "Founder")
      .get()
      .then((snapshots : any) => {
        if (snapshots.empty)
          dispatch(getFounderFailed({ message: "Founder not found." }));

        let founder : any;
        snapshots.forEach((snapshot : any) => {
          founder = new User(snapshot.data());
        });

        dispatch(gotFounder(<User>founder));
      })
      .catch((error : any) => {
        dispatch(getFounderFailed(error));
      })
  };
};

export const getStaffInitiated = () : any => {
  return {
    type: UsersActions.GettingStaff
  };
};

export const getStaffFailed = (error : any) => {
  return {
    type: UsersActions.GettingStaffFailed,
    error
  };
};

export const gotStaff = (staff : Array<User>) : any => {
  return {
    type: UsersActions.GotStaff,
    staff
  };
};

export const doGetStaff = () : any => {
  return (dispatch : any) => {
    dispatch(getStaffInitiated());

    db.collection("users")
      .where("isStaff", "==", true)
      .get()
      .then((staffSnaps : any) => {
        if (staffSnaps.empty)
          return dispatch(getStaffFailed({ message: "no staff found" }));

        let staff : Array<User> = [];
        let studentStaff : Array<string> = [];

        staffSnaps.forEach((snap : any) => {
          let data = snap.data();

          if (data.isStudent) {
            studentStaff.push(data.uid);
          } else if (!data.isStudent && data.role !== "Founder") {
            staff.push(new User(data));
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
                  staff.push(new User(snapshot.data()));
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
      .catch((error : any) => {
        dispatch(getStaffFailed(error));
      })
  };
};

// CREATE actions
export const createUserInitiated = (newData : any | User) : any => {
  return {
    type: UsersActions.CreatingUser,
    data: newData
  };
};

export const createUserFailed = (error : any, newData : any | User) : any => {
  return {
    type: UsersActions.CreatingUserFailed,
    error, 
    data: newData
  };
};

export const userCreated = (user : User) : any => {
  return {
    type: UsersActions.CreatedUser,
    data: user
  };
};

export const sendSignupEmailInitiated = (email : string) : any => {
  return {
    type: UsersActions.SendingSignUpEmail,
    email
  };
};

export const signupEmailSent = (email : string) : any => {
  return {
    type: UsersActions.SentSignUpEmail,
    email
  };
};

export const sendSignupEmailFailed = (error : any, email : string) : any => {
  return {
    type: UsersActions.SendingSignUpEmailFailed,
    error, email
  };
};

export const doCreateUser = (newData : any) : any => {
  return (dispatch : any) => {
    dispatch(createUserInitiated(newData));

    const { email } = newData;

    if (!isEmail(email))
      dispatch(createUserFailed({ message: "Invalid email provided." }, email));

    // check if user with email already exists
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot : any) => {
        if (snapshot.empty) {
          const tempUid : string = `temp_${uid(16)}`;
          let newUser = new User({uid: tempUid, ...newData});

          return db.collection("users")
            .doc(tempUid)
            .set(newUser.data)
            .then(() => {
              dispatch(userCreated(newUser));
              dispatch(sendSignupEmailInitiated(newUser.email));

              // send signup email
              axios.get(`${EMAIL_API}/s/signup/${tempUid}`)
                .then(() => {
                  dispatch(signupEmailSent(email));
                })
                .catch(error => {
                  dispatch(sendSignupEmailFailed(error, newUser.email))
                });
            })
            .catch((error : any) => {
              dispatch(createUserFailed(error, newUser.email));
            });
        }

        return dispatch(createUserFailed({ message: "User found already exists" }, newData));
      });
  }
}

export const doCreateFullUser = (user : User, student? : Student) : any => {
  return (dispatch : any) => {
    dispatch(createUserInitiated(user));

    const email = user.email;
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot : any) => {
        if (!snapshot.empty)
          return dispatch(createUserFailed({ message: "user already exists" }, user));

        if (!user.uid)
          user.uid = `${uid(24)}_ac_less`;

        return db.collection("users")
          .doc(user._uid)
          .set(user.data)
          .then(() => {
            dispatch(userCreated(user));

            if (user.isStudent && student)
              dispatch(doCreateStudent(student));
          })
          .catch((error : any) => {
            dispatch(createUserFailed(error, user));
          });
      })
  }
};

// UPDATE actions
export const userUpdateInitiated = (uid : string, newData : any) : any => {
  return {
    type: UsersActions.UpdatingUser,
    user: uid,
    data: newData
  };
};

export const userUpdated = (uid : string, newData : any) : any => {
  return {
    type: UsersActions.UpdatedUser,
    user: uid,
    data: newData
  };  
};

export const userUpdateFailed = (error: any, uid : string, newData : any) : any => {
  return {
    type: UsersActions.UpdatingUserFailed,
    user: uid,
    data: newData, 
    error
  };  
};

export const doUserUpdate = (uid: string, newData : any, options : any = {}) => {
  return (dispatch : any) => {
    dispatch(userUpdateInitiated(uid, newData));

    let updatedUser = new User({uid, ...newData});

    db.collection("users")
      .doc(uid)
      .update(newData)
      .then(() => {
        dispatch(userUpdated(uid, newData));

        // dispatch user get to update props
        // with new user data
        if (options.refresh)
          return dispatch(doGetUserByUid(uid));
      })
      .catch((error : any) => {
        return dispatch(userUpdateFailed(error, uid, newData));
      })
  }
};

export const addBioInitiated = (user : User, bio : iContentEditable) => {
  return {
    type: UsersActions.AddingBio,
    user,
    bio
  };
};

export const addBioFailed = (error : any, user : User, bio : iContentEditable) => {
  return {
    type: UsersActions.AddingBioFailed,
    error,
    user,
    bio
  };
};

export const bioAdded = (user : User, bio : iContentEditable) => {
  return {
    type: UsersActions.AddedBio,
    user, bio
  };
};

export const doAddBio = (user : User, bio : iContentEditable, options : any = {}) => {
  return (dispatch : any) => {
    if (_.isEmpty(bio.blocks))
      return dispatch(addBioFailed({ message: "invalid/no bio provided" }, user, bio));

    dispatch(addBioInitiated(user, bio));

    db.collection("users")
      .doc(user.uid)
      .update({ bio })
      .then(() => {
        dispatch(bioAdded(user, bio));

        // dispatch user get to update props
        // with new user data
        if (options.refresh)
          return dispatch(doGetUserByUid(user.uid));
      })
      .catch((error : any) => {
        dispatch(addBioFailed(error, user, bio));
      });
  };
};