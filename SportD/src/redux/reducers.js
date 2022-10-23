import {combineReducers} from 'redux';

import reducerLogin from '../screens/LoginScreen/reducer';
const RootReducer = combineReducers({
  login: reducerLogin,
});
export default RootReducer;
