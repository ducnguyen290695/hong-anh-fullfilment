import { call, put } from 'redux-saga/effects';

const initalState = Object.freeze({
  loading: null,
  data: null,
});

export const generateActions = (modelName) => {
  const GET = {
    GET_REQUEST: `GET_${modelName.toUpperCase()}_REQUEST`,
    GET_SUCCESS: `GET_${modelName.toUpperCase()}_SUCCESS`,
    GET_FAILURE: `GET_${modelName.toUpperCase()}_FAILURE`,
    GET_CLEANUP: `GET_${modelName.toUpperCase()}_CLEANUP`,
  };
  const FETCH = {
    FETCH_REQUEST: `FETCH_${modelName.toUpperCase()}_REQUEST`,
    FETCH_SUCCESS: `FETCH_${modelName.toUpperCase()}_SUCCESS`,
    FETCH_FAILURE: `FETCH_${modelName.toUpperCase()}_FAILURE`,
    FETCH_CLEANUP: `FETCH_${modelName.toUpperCase()}_CLEANUP`,
  };
  const CREATE = {
    CREATE_REQUEST: `CREATE_${modelName.toUpperCase()}_REQUEST`,
    CREATE_SUCCESS: `CREATE_${modelName.toUpperCase()}_SUCCESS`,
    CREATE_FAILURE: `CREATE_${modelName.toUpperCase()}_FAILURE`,
    CREATE_CLEANUP: `CREATE_${modelName.toUpperCase()}_CLEANUP`,
  };
  const UPDATE = {
    UPDATE_REQUEST: `UPDATE_${modelName.toUpperCase()}_REQUEST`,
    UPDATE_SUCCESS: `UPDATE_${modelName.toUpperCase()}_SUCCESS`,
    UPDATE_FAILURE: `UPDATE_${modelName.toUpperCase()}_FAILURE`,
    UPDATE_CLEANUP: `UPDATE_${modelName.toUpperCase()}_CLEANUP`,
  };
  const DELETE = {
    DELETE_REQUEST: `DELETE_${modelName.toUpperCase()}_REQUEST`,
    DELETE_SUCCESS: `DELETE_${modelName.toUpperCase()}_SUCCESS`,
    DELETE_FAILURE: `DELETE_${modelName.toUpperCase()}_FAILURE`,
    DELETE_CLEANUP: `DELETE_${modelName.toUpperCase()}_CLEANUP`,
  };
  return { GET, FETCH, CREATE, UPDATE, DELETE };
};

export const generateReducer = (modelName) => {
  const { GET, FETCH, CREATE, UPDATE, DELETE } = generateActions(modelName);

  function get(state = initalState, action) {
    switch (action.type) {
      case GET.GET_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case GET.GET_SUCCESS:
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case GET.GET_FAILURE:
        return {
          ...state,
          loading: false,
        };
      case GET.GET_CLEANUP:
        return {
          ...state,
          loading: null,
          data: null,
        };
      default:
        return state;
    }
  }

  function fetch(state = initalState, action) {
    switch (action.type) {
      case FETCH.FETCH_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH.FETCH_SUCCESS:
        console.log('success!');
        return {
          ...state,
          loading: false,
          data: action.payload,
        };
      case FETCH.FETCH_FAILURE:
        return {
          ...state,
          loading: false,
        };
      case FETCH.FETCH_CLEANUP:
        return {
          ...state,
          loading: null,
          data: null,
        };
      default:
        return state;
    }
  }

  function create(state = initalState, action) {
    switch (action.type) {
      case CREATE.CREATE_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case CREATE.CREATE_SUCCESS:
        return {
          ...state,
          loading: false,
        };
      case CREATE.CREATE_FAILURE:
        return {
          ...state,
          loading: false,
        };
      case CREATE.CREATE_CLEANUP:
        return {
          ...state,
          loading: null,
        };
      default:
        return state;
    }
  }

  function update(state = initalState, action) {
    switch (action.type) {
      case UPDATE.UPDATE_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case UPDATE.UPDATE_SUCCESS:
        return {
          ...state,
          loading: false,
        };
      case UPDATE.UPDATE_FAILURE:
        return {
          ...state,
          loading: false,
        };
      case UPDATE.UPDATE_CLEANUP:
        return {
          ...state,
          loading: null,
        };
      default:
        return state;
    }
  }

  function _delete(state = initalState, action) {
    switch (action.type) {
      case DELETE.DELETE_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case DELETE.DELETE_SUCCESS:
        return {
          ...state,
          loading: false,
        };
      case DELETE.DELETE_FAILURE:
        return {
          ...state,
          loading: false,
        };
      case DELETE.DELETE_CLEANUP:
        return {
          ...state,
          loading: null,
        };
      default:
        return state;
    }
  }
  return { get, fetch, create, update, _delete };
};

export const generateSaga = ({ modelName, getApi, fetchApi, createApi, updateApi, deleteApi }) => {
  const { GET, FETCH, CREATE, UPDATE, DELETE } = generateActions(modelName);
  function* get(action) {
    const { payload, onSuccess, onError } = action;
    try {
      const res = yield call(getApi, payload);
      yield put({
        type: GET.GET_SUCCESS,
        payload: res.data,
      });
      onSuccess && onSuccess(res);
    } catch (err) {
      yield put({ type: GET.GET_FAILURE, err });
      onError && onError(err);
    }
  }

  function* fetch(action) {
    const { payload, onSuccess, onError } = action;
    try {
      const res = yield call(fetchApi, payload);
      yield put({
        type: FETCH.FETCH_SUCCESS,
        payload: res.data,
      });
      onSuccess && onSuccess(res);
      console.log({ res });
    } catch (err) {
      yield put({ type: FETCH.FETCH_FAILURE, err });
      onError && onError(err);
    }
  }

  function* create(action) {
    const { payload, onSuccess, onError } = action;
    try {
      const res = yield call(createApi, payload);
      yield put({
        type: CREATE.CREATE_SUCCESS,
      });
      onSuccess && onSuccess(res);
    } catch (err) {
      yield put({ type: CREATE.CREATE_FAILURE, err });
      onError && onError(err);
    }
  }

  function* update(action) {
    const { payload, onSuccess, onError } = action;
    try {
      const res = yield call(updateApi, payload);
      yield put({
        type: UPDATE.UPDATE_SUCCESS,
      });
      onSuccess && onSuccess(res);
    } catch (err) {
      yield put({ type: UPDATE.UPDATE_FAILURE, err });
      onError && onError(err);
    }
  }

  function* _delete(action) {
    const { payload, onSuccess, onError } = action;
    try {
      const res = yield call(deleteApi, payload);
      yield put({
        type: DELETE.DELETE_SUCCESS,
      });
      onSuccess && onSuccess(res);
    } catch (err) {
      yield put({ type: DELETE.DELETE_FAILURE, err });
      onError && onError(err);
    }
  }
  return { get, fetch, create, update, _delete };
};
