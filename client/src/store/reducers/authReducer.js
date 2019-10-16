import { REHYDRATE } from 'redux-persist';
import { LOGOUT, SET_CURRENT_USER } from '../types';

const initialState = {
  loading: true,
  user: null,
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case REHYDRATE:
      return { ...state, ...payload.authReducer, loading: false };
    case SET_CURRENT_USER:
      return { ...state, user: payload };
    case LOGOUT:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default authReducer;
