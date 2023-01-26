import Immutable from 'seamless-immutable';
import {
  FETCH_BLOCK_LIST_SUCCESS,
  FETCH_USER_INFO_SUCCESS,
  GET_USERNAME_AMOUNTSUM_SUCCESS,
  GET_USER_TOURNAMENT_HISTORY_SUCCESS,
  SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS,
  UPDATE_USER_INFO_SUCCESS,
} from "../actions/types";

const INITIAL_STATE = Immutable({
  me: {},
  history: [],
  blockedUsers: [],
  fcm_token: null,
  userInfo: []
});

const authReducer = (state = INITIAL_STATE, action: { type: any; params: any; }) => {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return state.merge({
        me: action.params
      }, { deep: true });
    case SIGN_OUT_SUCCESS:
      return INITIAL_STATE;
    case FETCH_USER_INFO_SUCCESS:
      return state.merge({
        me: action.params
      }, { deep: true });
    case UPDATE_USER_INFO_SUCCESS:
      return state.merge({
        me: action.params
      }, { deep: true });
    case FETCH_BLOCK_LIST_SUCCESS:
      return state.merge({
        blockedUsers: action.params
      }, { deep: true });
    case GET_USER_TOURNAMENT_HISTORY_SUCCESS:
      return state.merge({
        history: action.params
      }, { deep: true });
    case GET_USERNAME_AMOUNTSUM_SUCCESS:
      return state.merge({
        userInfo: action.params
      }, { deep: true });
    default:
      return state;
  }
}

export default authReducer;
