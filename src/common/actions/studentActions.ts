import firebase from "firebase";
import { db } from "../utils/firebase";
import ActionTypes from "./actionTypes";
import Student from "../models/Student";

const StudentActions = ActionTypes.Student;

// GET actions
export const studentGetInitiated = (uid : string) : any => {
  return {
    type: StudentActions.GettingStudent,
    student: uid
  };
};

export const studentGetFailed = (error : any, uid : string) : any => {
  return {
    type: StudentActions.GettingStudentFailed,
    error,
    student: uid
  };
};

export const studentGetSuccess = (student : Student) : any => {
  return {
    type: StudentActions.GotStudent,
    student
  };
};

export const doStudentGet = (uid : string) : any => {
  return (dispatch : any) => {
    dispatch(studentGetInitiated(uid));

    db.collection("students")
      .doc(uid)
      .get()
      .then((snapshot : any) => {
        if (snapshot.exists) {
          let data : any = snapshot.data;
          let student = new Student(data, data.user);

          return dispatch(studentGetSuccess(student));
        }

        return dispatch(studentGetFailed({ message: "no student found" }, uid));
      })
      .catch((error : any) => {
        dispatch(studentGetFailed(error, uid));
      });
  }
}

// CREATE actions
export const studentCreateInitiated = () : any => {
  return {
    type: StudentActions.CreatingStudent
  };
};

export const studentCreateFailed = (error : any, student : Student) : any => {
  return {
    type: StudentActions.CreatingStudentFailed,
    error, 
    newStudent: student
  };
};

export const studentCreated = (student : Student) : any => {
  return {
    type: StudentActions.CreatedStudent,
    newStudent: student
  };
};

export const doCreateStudent = (student : Student) : any => {
  return (dispatch : any) => {
    dispatch(studentCreateInitiated());

    return db.collection("students")
      .doc(student.uid)
      .set(student.data)
      .then(() => {
        dispatch(studentCreated(student));
      })
      .catch((error : any) => {
        dispatch(studentCreateFailed(error, student));
      });
  }
}

// UPDATE actions
export const studentUpdateInitiated = (student : Student, newData : any) : any => {
  return {
    type: StudentActions.UpdatingStudent,
    student,
    data : newData
  };
};

export const studentUpdateFailed = (error : any, student : Student, newData : any) : any => {
  return {
    type: StudentActions.UpdatingStudentFailed,
    student, error,
    data : newData
  };
};

export const studentUpdated = (student : Student, newData : any) : any => {
  return {
    type: StudentActions.UpdatedStudent,
    student, 
    data : newData
  };
};

export const doStudentUpdate = (student : Student, newData : any = {}) : any => {
  return (dispatch : any) => {
    dispatch(studentUpdateInitiated(student, newData));

    db.collection("students")
      .doc(student.uid)
      .update(newData)
      .then(() => {
        dispatch(studentUpdated(student, newData));

        // get student
        dispatch(doStudentGet(student.uid));
      })
      .catch((error : any) => {
        dispatch(studentUpdateFailed(error, student, newData));
      })
  }
}

export const doStudentUpdateWithoutGet = (student : Student, newData : any = {}) : any => {
  return (dispatch : any) => {
    dispatch(studentUpdateInitiated(student, newData));

    db.collection("students")
      .doc(student.uid)
      .update(newData)
      .then(() => {
        dispatch(studentUpdated(student, newData));
      })
      .catch((error : any) => {
        dispatch(studentUpdateFailed(error, student, newData));
      })
  }
}

// DELETE actions
export const accomplishmentDeleteInitiated = (student : Student, slug : string) : any => {
  return {
    type: StudentActions.DeletingStudentAccomplishment,
    student, slug
  };
};

export const accomplishmentDeleted = (student : Student, slug : string) : any => {
  return {
    type: StudentActions.DeletedStudentAccomplishment,
    student, slug
  };
};

export const accomplishmentDeleteFailed = (error : any, student : Student, slug : string) => {
  return {
    type: StudentActions.DeletingStudentAccomplishmentFailed,
    student, slug, error
  };
};

export const doAccomplishmentDelete = (student : Student, slug : string, options : any = {}) : any => {
  return (dispatch : any) => {
    dispatch(accomplishmentDeleteInitiated(student, slug));
    
    db.collection("students")
      .doc(student.uid)
      .update({
        [`accomplishments.${slug}`]: firebase.firestore.FieldValue.delete()
      })
      .then(() => {
        dispatch(accomplishmentDeleted(student, slug));

        if (options.refresh)
          return dispatch(doStudentGet(student.uid));
      })
      .catch((error : any) => {
        dispatch(accomplishmentDeleteFailed(error, student, slug));
      })
  }
}