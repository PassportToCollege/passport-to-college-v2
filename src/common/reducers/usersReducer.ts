import iAppState from "../imodels/iAppState";
import iAction from "../imodels/iAction";

import initialState from "./initialState";
import ActionTypes from "../actions/actionTypes";

const UsersActions = ActionTypes.Users;

const users = (state : iAppState["Users"] = initialState.Users, action : iAction) : iAppState["Users"] => {
  switch (action.type) {
    case UsersActions.GettingUsers:
      return Object.assign({}, state, {
        isGettingUsers: true,
        failedToGetUsers: false,
        hasGottenUsers: false,
        page: action.page,
        userType: action.userType
      });
    case UsersActions.GettingUsersFailed:
      return Object.assign({}, state, {
        isGettingUsers: false,
        failedToGetUsers: true,
        hasGottenUsers: false,
        page: action.page,
        userType: action.userType,
        error: action.error
      });
    case UsersActions.GotUsers:
      return Object.assign({}, state, {
        isGettingUsers: false,
        failedToGetUsers: false,
        hasGottenUsers: true,
        page: action.page,
        userType: action.userType,
        users: action.users
      });
    case UsersActions.CreatingUser:
      return Object.assign({}, state, {
        isCreating: true,
        hasCreated: false,
        failedToCreateUser: false,
        data: action.data
      });
    case UsersActions.CreatingUserFailed:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: false,
        failedToCreateUser: true,
        data: action.data,
        error: action.error
      });
    case UsersActions.CreatedUser:
      return Object.assign({}, state, {
        isCreating: false,
        hasCreated: true,
        failedToCreateUser: false,
        data: action.data
      });
    case UsersActions.SendingSignUpEmail:
      return Object.assign({}, state, {
        isSending: true,
        hasSent: false,
        failedToSend: false,
        email: action.email
      });
    case UsersActions.SendingSignUpEmailFailed:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: false,
        failedToSend: true,
        email: action.email,
        error: action.error
      });
    case UsersActions.SentSignUpEmail:
      return Object.assign({}, state, {
        isSending: false,
        hasSent: true,
        failedToSend: false,
        email: action.email
      });
    case UsersActions.GettingUser:
      return Object.assign({}, state, {
        isGettingUser: true,
        hasGottenUser: false,
        failedToGetByUserId: false,
        id: action.id
      });
    case UsersActions.GettingUserFailed:
      return Object.assign({}, state, {
        isGettingUser: false,
        hasGottenUser: false,
        failedToGetByUserId: true,
        id: action.id,
        error: action.error
      });
    case UsersActions.GotUser:
      return Object.assign({}, state, {
        isGettingUser: false,
        hasGottenUser: true,
        failedToGetByUserId: false,
        user: action.user
      });
    case UsersActions.GettingUsers_ByUid:
      return Object.assign({}, state, {
        isGettingUsersByUid: true,
        hasGottenUsersByUid: false,
        failedToGetUsersByUid: false,
        ids: action.ids
      });
    case UsersActions.GettingUsersFailed_ByUid:
      return Object.assign({}, state, {
        isGettingUsersByUid: false,
        hasGottenUsersByUid: false,
        failedToGetUsersByUid: true,
        ids: action.ids,
        error: action.error
      });
    case UsersActions.GotUsers_ByUid:
      return Object.assign({}, state, {
        isGettingUsersByUid: false,
        hasGottenUsersByUid: true,
        failedToGetUsersByUid: false,
        users: action.users
      });
    case UsersActions.UpdatingUser:
      return Object.assign({}, state, {
        isUpdating: true,
        hasUpdated: false,
        updateFailed: false,
        data: action.data,
        id: action.id
      });
    case UsersActions.UpdatingUserFailed:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: false,
        updateFailed: true,
        data: action.data,
        id: action.id,
        error: action.error
      });
    case UsersActions.UpdatedUser:
      return Object.assign({}, state, {
        isUpdating: false,
        hasUpdated: true,
        updateFailed: false,
        data: action.data,
        id: action.id
      });
    case UsersActions.AddingBio:
      return Object.assign({}, state, {
        addingBio: true,
        addedBio: false,
        failedToAddBio: false,
        id: action.id,
        bio: action.bio
      });
    case UsersActions.AddingBioFailed:
      return Object.assign({}, state, {
        addingBio: false,
        addedBio: false,
        failedToAddBio: true,
        error: action.error,
        id: action.id,
        bio: action.bio
      });
    case UsersActions.AddedBio:
      return Object.assign({}, state, {
        addingBio: false,
        addedBio: true,
        failedToAddBio: false,
        uid: action.user,
        bio: action.bio
      });
    case UsersActions.GettingFounder:
      return Object.assign({}, state, {
        gettingFounder: true,
        gotFounder: false,
        failedToGetFounder: false
      });
    case UsersActions.GettingFounderFailed:
      return Object.assign({}, state, {
        gettingFounder: false,
        gotFounder: false,
        failedToGetFounder: true,
        error: action.error
      });
    case UsersActions.GotFounder:
      return Object.assign({}, state, {
        gettingFounder: false,
        gotFounder: true,
        failedToGetFounder: false,
        founder: action.founder
      });
    case UsersActions.GettingStaff:
      return Object.assign({}, state, {
        gettingStaff: true,
        gotStaff: false,
        failedToGetStaff: false
      });
    case UsersActions.GettingStaffFailed:
      return Object.assign({}, state, {
        gettingStaff: false,
        gotStaff: false,
        failedToGetStaff: true,
        error: action.error
      });
    case UsersActions.GotStaff:
      return Object.assign({}, state, {
        gettingStaff: false,
        gotStaff: true,
        failedToGetStaff: false,
        staff: action.staff
      });
    default:
      return state;
  }
}

export default users;