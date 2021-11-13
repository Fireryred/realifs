import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
const rootReducer = combineReducers({
  authReducer: AuthReducer,
});
export default rootReducer;
