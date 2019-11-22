import User from '../../models/User';
import iAppState from '../../imodels/iAppState';
import { Dispatch } from 'react';
import { Action } from '../../actions';
import { doGetUsers, doGetFounder } from '../../actions/users/dispatchers';
import { UserType } from '../../imodels/iUser';

export interface AboutUsProps {
  founder: User;
  staff: User[];
  gotFounder: boolean;
  gotStaff: boolean;
  doGetStaff: () => void;
  doGetFounder: () => void;
  updateLocation: (location: string) => void;
}

export interface AboutUsState {
  founder?: User;
  staff?: User[];
}

export const mapStateToProps = (state: iAppState) => {
  return {
    founder: state.Users.founder,
    staff: state.Users.staff,
    gotFounder: state.Users.gotFounder,
    gotStaff: state.Users.gotStaff
  };
};

export const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    doGetStaff: () => doGetUsers(
      dispatch, 
      1 /* page */, 
      UserType.Staff, 
      true /* useStaffDispatch */
    ),
    doGetFounder: () => doGetFounder(dispatch)
  };
};