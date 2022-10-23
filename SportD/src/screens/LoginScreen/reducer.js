import {LOGIN_FAIL, LOGIN_START, LOGIN_SUCCESS, LOGOUT} from './constant';

export const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

export default function reducerLogin(state = initialState, action) {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        currentUser: action.user,
        loading: false,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        error: true,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
}
