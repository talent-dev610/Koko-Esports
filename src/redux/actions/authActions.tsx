import { ReduxActionDefaultParamDataType } from "../../@types/app";
import {
  BLOCK_USER,
  FETCH_BLOCK_LIST, FETCH_BLOCK_LIST_SUCCESS,
  FETCH_USER_INFO,
  FETCH_USER_INFO_SUCCESS,
  GET_USER_TOURNAMENT_HISTORY,
  GET_USER_TOURNAMENT_HISTORY_SUCCESS, PROFILE_SUSPEND, REGISTER_FCM_TOKEN, REGISTER_FCM_TOKEN_SUCCESS,
  SIGN_IN,
  SIGN_IN_SUCCESS, SIGN_OUT, SIGN_OUT_SUCCESS, UNBLOCK_USER,
  UPDATE_USER_INFO,
  UPDATE_USER_INFO_SUCCESS,
  GET_USERNAME_AMOUNTSUM,
  GET_USERNAME_AMOUNTSUM_SUCCESS
} from "./types";

export const signIn = ({ params, onSuccess, onFail }: ReduxActionDefaultParamDataType) => ({
  type: SIGN_IN,
  params,
  onSuccess,
  onFail
});

export const signInSuccess = (params: any) => ({
  type: SIGN_IN_SUCCESS,
  params
});

export const signOut = ({ onSuccess, onFail }: ReduxActionDefaultParamDataType) => ({
  type: SIGN_OUT,
  onSuccess,
  onFail
});

export const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS
});

export const fetchUserInfo = () => ({
  type: FETCH_USER_INFO,
});

export const fetchUserInfoSuccess = (params: any) => ({
  type: FETCH_USER_INFO_SUCCESS,
  params
});

export const fetchBlockList = () => ({
  type: FETCH_BLOCK_LIST
});

export const fetchBlockListSuccess = (params: any) => ({
  type: FETCH_BLOCK_LIST_SUCCESS,
  params
});

export const updateUserInfo = ({ params, onSuccess, onFail }: ReduxActionDefaultParamDataType) => ({
  type: UPDATE_USER_INFO,
  params,
  onSuccess,
  onFail
});

export const updateUserInfoSuccess = (params: any) => ({
  type: UPDATE_USER_INFO_SUCCESS,
  params
});

export const getUserTournamentHistory = () => ({
  type: GET_USER_TOURNAMENT_HISTORY,
});

export const getUserTournamentHistorySuccess = (params: any) => ({
  type: GET_USER_TOURNAMENT_HISTORY_SUCCESS,
  params
});

export const registerFCMToken = () => ({
  type: REGISTER_FCM_TOKEN
});

export const getUserNameAmountSum = () => ({
  type: GET_USERNAME_AMOUNTSUM
});

export const getUserNameAmountSumSuccess = (params: any) => ({
  type: GET_USERNAME_AMOUNTSUM_SUCCESS,
  params
});

export const blockUser = (userId: any, onSuccess: any, onFail: any) => ({
  type: BLOCK_USER,
  userId,
  onSuccess,
  onFail
});

export const unblockUser = (userId: any) => ({
  type: UNBLOCK_USER,
  userId
});

export const suspendAccount = ({ onSuccess, onFail }: ReduxActionDefaultParamDataType) => ({
  type: PROFILE_SUSPEND,
  onSuccess,
  onFail
});