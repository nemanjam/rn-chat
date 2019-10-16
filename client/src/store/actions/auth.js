import { client } from '../../App';
import { SET_CURRENT_USER, LOGOUT } from '../types';

export const setCurrentUser = user => (dispatch, getState) => {
  dispatch({
    type: SET_CURRENT_USER,
    payload: user,
  });
};

export const logout = () => {
  client.resetStore();
  return { type: LOGOUT };
};
