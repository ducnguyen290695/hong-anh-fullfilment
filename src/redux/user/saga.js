import { takeEvery } from 'redux-saga/effects';
import { generateSaga, generateActions } from 'utils/reduxGenerator';
import { createUser, fetchUser, getUser, updateUser, updateUserStatus } from './services';

const { CREATE, FETCH, GET, UPDATE } = generateActions('user');
const { UPDATE: UPDATE_STATUS } = generateActions('user_status');

const { create, fetch, get, update } = generateSaga({
  modelName: 'user',
  createApi: createUser,
  fetchApi: fetchUser,
  getApi: getUser,
  updateApi: updateUser,
});

const { update: updateStatus } = generateSaga({
  modelName: 'user_status',
  updateApi: updateUserStatus,
});

const userSaga = [
  takeEvery(CREATE.CREATE_REQUEST, create),
  takeEvery(FETCH.FETCH_REQUEST, fetch),
  takeEvery(GET.GET_REQUEST, get),
  takeEvery(UPDATE.UPDATE_REQUEST, update),
  takeEvery(UPDATE_STATUS.UPDATE_REQUEST, updateStatus),
];

export default userSaga;
