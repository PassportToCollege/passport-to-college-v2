import iStudent from "../imodels/iStudent";
import iAction from "../imodels/iAction";
import iError from "../imodels/iError";
import Student from "../models/Student";

import ActionTypes from "./actionTypes";
import firebase from "firebase";
import { db } from "../utils/firebase";

const StudentActions = ActionTypes.Student;

// GET actions
export const studentGetInitiated = (id : string) : iAction => {
  return {
    type: StudentActions.GettingStudent,
    id
  };
};

export const studentGetFailed = (error : iError, id : string) : iAction => {
  return {
    type: StudentActions.GettingStudentFailed,
    error, id
  };
};

export const studentGetSuccess = (student : Student) : iAction => {
  return {
    type: StudentActions.GotStudent,
    student
  };
};

export const doStudentGet = (uid : string) : any => {
  return (dispatch : Function) => {
    dispatch(studentGetInitiated(uid));

    db.collection("students")
      .doc(uid)
      .get()
      .then((snapshot : firebase.firestore.QueryDocumentSnapshot) => {
        if (snapshot.exists) {
          const data : any = snapshot.data;
          const student = new Student(data, data.user);

          return dispatch(studentGetSuccess(student));
        }

        return dispatch(studentGetFailed({ message: "no student found" }, uid));
      })
      .catch((error : iError) => {
        dispatch(studentGetFailed(error, uid));
      });
  }
}

// CREATE actions
export const studentCreateInitiated = () : iAction => {
  return {
    type: StudentActions.CreatingStudent
  };
};

export const studentCreateFailed = (error : iError, data : iStudent) : iAction => {
  return {
    type: StudentActions.CreatingStudentFailed,
    error, data
  };
};

export const studentCreated = (data : iStudent) : iAction => {
  return {
    type: StudentActions.CreatedStudent,
    data
  };
};

export const doCreateStudent = (student : iStudent) : any => {
  return (dispatch : Function) => {
    dispatch(studentCreateInitiated());

    return db.collection("students")
      .doc(student.uid)
      .set(student)
      .then(() => {
        dispatch(studentCreated(student));
      })
      .catch((error : iError) => {
        dispatch(studentCreateFailed(error, student));
      });
  }
}

// UPDATE actions
export const studentUpdateInitiated = (student : Student, data : any) : iAction => {
  return {
    type: StudentActions.UpdatingStudent,
    student, data
  };
};

export const studentUpdateFailed = (error : any, student : Student, data : any) : iAction => {
  return {
    type: StudentActions.UpdatingStudentFailed,
    student, error, data
  };
};

export const studentUpdated = (student : Student, data : any) : iAction => {
  return {
    type: StudentActions.UpdatedStudent,
    student, data 
  };
};

export const doStudentUpdate = (student : Student, data : any) : any => {
  return (dispatch : Function) => {
    dispatch(studentUpdateInitiated(student, data));

    db.collection("students")
      .doc(student.uid)
      .update(data)
      .then(() => {
        dispatch(studentUpdated(student, data));

        // get student
        dispatch(doStudentGet(student.uid));
      })
      .catch((error : iError) => {
        dispatch(studentUpdateFailed(error, student, data));
      })
  }
}

export const doStudentUpdateWithoutGet = (student : Student, newData : any) : any => {
  return (dispatch : Function) => {
    dispatch(studentUpdateInitiated(student, newData));

    db.collection("students")
      .doc(student.uid)
      .update(newData)
      .then(() => {
        dispatch(studentUpdated(student, newData));
      })
      .catch((error : iError) => {
        dispatch(studentUpdateFailed(error, student, newData));
      })
  }
}

// DELETE actions
export const accomplishmentDeleteInitiated = (student : Student, slug : string) : iAction => {
  return {
    type: StudentActions.DeletingStudentAccomplishment,
    student, slug
  };
};

export const accomplishmentDeleted = (student : Student, slug : string) : iAction => {
  return {
    type: StudentActions.DeletedStudentAccomplishment,
    student, slug
  };
};

export const accomplishmentDeleteFailed = (error : iError, student : Student, slug : string) : iAction => {
  return {
    type: StudentActions.DeletingStudentAccomplishmentFailed,
    student, slug, error
  };
};

export const doAccomplishmentDelete = (student : Student, slug : string, refresh : boolean = false) : any => {
  return (dispatch : Function) => {
    dispatch(accomplishmentDeleteInitiated(student, slug));
    
    db.collection("students")
      .doc(student.uid)
      .update({
        [`accomplishments.${slug}`]: firebase.firestore.FieldValue.delete()
      })
      .then(() => {
        dispatch(accomplishmentDeleted(student, slug));

        if (refresh)
          return dispatch(doStudentGet(student.uid));
      })
      .catch((error : iError) => {
        dispatch(accomplishmentDeleteFailed(error, student, slug));
      })
  }
}