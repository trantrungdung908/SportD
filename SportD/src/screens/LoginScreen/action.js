import {LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT} from './constant';

export const loginStart = () => {
  return {
    type: LOGIN_START,
  };
};
export const loginSuccess = user => {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
};
export const loginFail = () => {
  return {
    type: LOGIN_FAIL,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};
