import { uid } from "rand-token";
import axios from "axios";
import _ from "lodash";

import ActionTypes from "./actionTypes";
import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
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
export const usersGetInitiated = (page : number, userType : UserType) : iAction => {
  return {
    type: UsersActions.GettingUsers,
    page, userType
  };
}

export const usersGetDone = (users : User[], page : number, userType : UserType) : iAction => {
  return {
    type: UsersActions.GotUsers,
    page, userType, users
  };
}

export const usersGetFailed = (error : iError, page : number, userType : UserType) : iAction => {
  return {
    type: UsersActions.GettingUsersFailed,
    page, userType, error
  };
}

export const doUsersGet = (page : number, userType : UserType) : any => {
  return (dispatch : Function) => {
    dispatch(usersGetInitiated(page, userType));

    if (userType === UserType.Any) {
      getUsersOfAnyType(dispatch, page);
    } else {
      getUsersByType(dispatch, page, userType);
    }
  }
}

const getUsersOfAnyType = (dispatch : Function, page : number) : any => {
  if (page === 1) {
    return db.collection("users")
      .orderBy("name.last")
      .limit(50)
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
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
    .then((tempSnapshots : firebase.firestore.QuerySnapshot) => {
      const lastVisible = tempSnapshots.docs[tempSnapshots.docs.length - 1];

      return db.collection("users")
        .orderBy("name.last")
        .startAfter(lastVisible)
        .limit(50)
        .get()
        .then((snapshots : firebase.firestore.QuerySnapshot) => {
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

const getUsersByType = (dispatch : Function, page : number, userType : UserType) : any => {
  let type : string;

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
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
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
    .then((tempSnapshots : firebase.firestore.QuerySnapshot) => {
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

const getUsersFromSnapshot = (snapshots : firebase.firestore.QuerySnapshot): User[] => {
  let users: User[] = [];

  snapshots.forEach((snapshot: any) => {
    const userData = snapshot.data();
    users.push(new User(userData));
  });

  return users;
}

export const userGetByIdInitiated = (id : string) : iAction => {
  return {
    type: UsersActions.GettingUser,
    id
  };
}

export const userGetByIdDone = (user : User) : iAction => {
  return {
    type: UsersActions.GotUsers,
    user
  };
}

export const userGetByIdFailed = (error : iError, id : string) : iAction => {
  return {
    type: UsersActions.GettingUserFailed,
    id, error
  };
}

export const doGetUserByUid = (uid : string) : any => {
  return (dispatch : Function) => {
    dispatch(userGetByIdInitiated(uid));

    db.collection("users")
      .doc(uid)
      .get()
      .then((snapshot : firebase.firestore.DocumentSnapshot) => {
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

export const usersGetByIdInitiated = (userIds : string[]) : iAction => {
  return {
    type: UsersActions.GettingUsers_ByUid,
    ids: userIds
  };
}

export const usersGetByIdDone = (users : User[]) : iAction => {
  return {
    type: UsersActions.GotUsers_ByUid,
    users
  };
}

export const usersGetByIdFailed = (error: iError, userIds : string[]) : iAction => {
  return {
    type: UsersActions.GettingUsersFailed_ByUid,
    ids: userIds, 
    error
  };
}

export const doGetUsersByUid = (userIds : string[] = []) : any => {
  return (dispatch : Function) => {
    if (userIds.length < 1)
      return dispatch(usersGetByIdFailed({ message: "no uids provided" }, []));

    dispatch(usersGetByIdInitiated(userIds));

    let promises : any = [];
    for (let user of userIds) {
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
        dispatch(usersGetByIdFailed(error, userIds));
      })
  }
}

export const getFounderInitiated = () : iAction => {
  return {
    type: UsersActions.GettingFounder
  };
};

export const getFounderFailed = (error : iError) : iAction =>  {
  return {
    type: UsersActions.GettingFounderFailed,
    error
  };
};

export const gotFounder = (founder : User) : iAction => {
  return {
    type: UsersActions.GotFounder,
    founder
  };
};

export const doGetFounder = () : any => {
  return (dispatch : Function) => {
    dispatch(getFounderInitiated());

    db.collection("users")
      .where("isStaff", "==", true)
      .where("role", "==", "Founder")
      .get()
      .then((snapshots : firebase.firestore.QuerySnapshot) => {
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

export const getStaffInitiated = () : iAction => {
  return {
    type: UsersActions.GettingStaff
  };
};

export const getStaffFailed = (error : iError) : iAction => {
  return {
    type: UsersActions.GettingStaffFailed,
    error
  };
};

export const gotStaff = (staff : User[]) : iAction => {
  return {
    type: UsersActions.GotStaff,
    staff
  };
};

export const doGetStaff = () : any => {
  return (dispatch : Function) => {
    dispatch(getStaffInitiated());

    db.collection("users")
      .where("isStaff", "==", true)
      .get()
      .then((staffSnaps : firebase.firestore.QuerySnapshot) => {
        if (staffSnaps.empty)
          return dispatch(getStaffFailed({ message: "no staff found" }));

        const staff : User[] = [];

        staffSnaps.forEach((snap : any) => {
          const data = snap.data();
          staff.push(new User(data));
        });

        dispatch(gotStaff(staff));
      })
      .catch((error : any) => {
        dispatch(getStaffFailed(error));
      })
  };
};

// CREATE actions
export const createUserInitiated = (newData : any) : iAction => {
  return {
    type: UsersActions.CreatingUser,
    data: newData
  };
};

export const createUserFailed = (error : iError, newData : any) : iAction => {
  return {
    type: UsersActions.CreatingUserFailed,
    error, 
    data: newData
  };
};

export const userCreated = (user : User) : iAction => {
  return {
    type: UsersActions.CreatedUser,
    data: user
  };
};

export const sendSignupEmailInitiated = (email : string) : iAction => {
  return {
    type: UsersActions.SendingSignUpEmail,
    email
  };
};

export const signupEmailSent = (email : string) : iAction => {
  return {
    type: UsersActions.SentSignUpEmail,
    email
  };
};

export const sendSignupEmailFailed = (error : iError, email : string) : iAction => {
  return {
    type: UsersActions.SendingSignUpEmailFailed,
    error, email
  };
};

export const doCreateUser = (newData : any) : any => {
  return (dispatch : Function) => {
    dispatch(createUserInitiated(newData));

    const { email } = newData;

    if (!isEmail(email))
      dispatch(createUserFailed({ message: "Invalid email provided." }, email));

    // check if user with email already exists
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot : firebase.firestore.QuerySnapshot) => {
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
  return (dispatch : Function) => {
    dispatch(createUserInitiated(user));

    const email = user.email;
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot : firebase.firestore.QuerySnapshot) => {
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
export const userUpdateInitiated = (id : string, newData : any) : iAction => {
  return {
    type: UsersActions.UpdatingUser,
    id,
    data: newData
  };
};

export const userUpdated = (id : string, newData : any) : iAction => {
  return {
    type: UsersActions.UpdatedUser,
    id,
    data: newData
  };  
};

export const userUpdateFailed = (error: iError, id : string, newData : any) : iAction => {
  return {
    type: UsersActions.UpdatingUserFailed,
    id,
    data: newData, 
    error
  };  
};

export const doUserUpdate = (uid: string, newData : any, refresh : boolean = false) : any => {
  return (dispatch : Function) => {
    dispatch(userUpdateInitiated(uid, newData));

    db.collection("users")
      .doc(uid)
      .update(newData)
      .then(() => {
        dispatch(userUpdated(uid, newData));

        // dispatch user get to update props
        // with new user data
        if (refresh)
          return dispatch(doGetUserByUid(uid));
      })
      .catch((error : any) => {
        return dispatch(userUpdateFailed(error, uid, newData));
      })
  }
};

export const addBioInitiated = (user : User, bio : iContentEditable) : iAction => {
  return {
    type: UsersActions.AddingBio,
    user,
    bio
  };
};

export const addBioFailed = (error : any, user : User, bio : iContentEditable) : iAction => {
  return {
    type: UsersActions.AddingBioFailed,
    error,
    user,
    bio
  };
};

export const bioAdded = (user : User, bio : iContentEditable) : iAction => {
  return {
    type: UsersActions.AddedBio,
    user, bio
  };
};

export const doAddBio = (user : User, bio : iContentEditable, refresh : boolean = false) : any => {
  return (dispatch : Function) => {
    dispatch(addBioInitiated(user, bio));

    db.collection("users")
      .doc(user.uid)
      .update({ bio })
      .then(() => {
        dispatch(bioAdded(user, bio));

        // dispatch user get to update props
        // with new user data
        if (refresh)
          return dispatch(doGetUserByUid(user.uid));
      })
      .catch((error : any) => {
        dispatch(addBioFailed(error, user, bio));
      });
  };
};