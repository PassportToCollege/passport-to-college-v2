import iAppState from '../../imodels/iAppState';

export interface ApplyProps {

}

export interface ApplyState {

}

export const mapStateToProps = (state: iAppState) => {
  return {
    auth: state.Auth
  };
};