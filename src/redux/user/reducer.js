import { generateReducer } from 'utils/reduxGenerator';
import { combineReducers } from 'redux';

const { create, fetch, get, update } = generateReducer('user');
const { update: updateStatus } = generateReducer('user_status');

const userReducer = combineReducers({
  create,
  fetch,
  get,
  update,
  updateStatus,
});

export default userReducer;
