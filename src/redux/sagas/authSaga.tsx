import { put, call, takeLatest } from "redux-saga/effects";
import {
  BLOCK_USER,
  FETCH_BLOCK_LIST,
  FETCH_USER_INFO,
  GET_USERNAME_AMOUNTSUM,
  GET_USER_TOURNAMENT_HISTORY, PROFILE_SUSPEND, REGISTER_FCM_TOKEN,
  SIGN_IN, SIGN_OUT, UNBLOCK_USER,
  UPDATE_USER_INFO,
} from "../actions/types";
import * as authApi from "../services/authApi";
import { clearAppData, getFCMToken, saveIdToken, saveUserId, setLaunched } from "../utils/localDataManager";
import {
  fetchBlockListSuccess,
  fetchUserInfoSuccess,
  signInSuccess,
  updateUserInfoSuccess,
  getUserTournamentHistorySuccess, signOutSuccess, fetchBlockList,
  getUserNameAmountSumSuccess
} from "../actions/authActions";
import { setAuthorization } from "../services/api";
import { loadAppData } from "../actions/appActions";
import { Platform } from "react-native";

export function* signInSaga(action: { params: { type?: any; idToken?: any; anonymousToken?: any; }; onSuccess: (arg0: any) => any; onFail: (arg0: unknown) => any; }) {
  try {
    const { idToken, anonymousToken } = action.params;
    const response = yield call(authApi.signIn, {
      url: action.params.type.url,
      params: {
        idToken,
        anonymousToken
      },
    });

    yield call(saveIdToken, idToken);
    setAuthorization(idToken);
    const userData = response.data;
    yield call(saveUserId, userData.id);
    yield put(signInSuccess(userData));

    yield put(loadAppData());

    action.onSuccess && action.onSuccess(response);
  } catch (error) {
    action.onFail && action.onFail(error);
  }
}

export function* watchSignIn() {
  yield takeLatest(SIGN_IN, signInSaga);
}

export function* signOutSaga(action: { onSuccess: () => any; }) {
  yield call(clearAppData);
  yield call(setLaunched);
  yield put(signOutSuccess());
  action.onSuccess && action.onSuccess();
}

export function* watchSignOut() {
  yield takeLatest(SIGN_OUT, signOutSaga)
}

export function* fetchUserInfoSaga(action: any) {
  try {
    const response = yield call(authApi.fetchUserInfo);
    yield put(fetchUserInfoSuccess(response.data));
  } catch (error) {
  }
}

export function* watchFetchUserInfo() {
  yield takeLatest(FETCH_USER_INFO, fetchUserInfoSaga);
}

export function* fetchBlockListSaga(action: any) {
  try {
    const response = yield call(authApi.fetchBlockList);
    yield put(fetchBlockListSuccess(response.data.blockedUsers));
  } catch (e) {

  }
}

export function* watchFetchBlockList() {
  yield takeLatest(FETCH_BLOCK_LIST, fetchBlockListSaga);
}

export function* updateUserInfoSaga(action: { params: any; onSuccess: () => any; onFail: (arg0: unknown) => any; }) {
  try {
    const response = yield call(authApi.updateUserInfo, action.params);
    yield put(updateUserInfoSuccess(response.data));
    action.onSuccess && action.onSuccess();
  } catch (error) {
    action.onFail && action.onFail(error);
  }
}

export function* watchUpdateUserInfo() {
  yield takeLatest(UPDATE_USER_INFO, updateUserInfoSaga);
}

export function* getUserTournamentHistorySaga(action: any) {
  try {
    const response = yield call(authApi.getUserTournamentHistory);
    yield put(getUserTournamentHistorySuccess(response.data));
  } catch (e) {

  }
}

export function* watchGetUserTournamentHistory() {
  yield takeLatest(GET_USER_TOURNAMENT_HISTORY, getUserTournamentHistorySaga);
}

export function* getUserNameAmountSumSaga(action: any) {
  try {
    const response = yield call(authApi.getUserNameAmountSum);
    yield put(getUserNameAmountSumSuccess(response.data));
  } catch (e) {

  }
}
export function* watchGetUserNameAmountSum() {
  yield takeLatest(GET_USERNAME_AMOUNTSUM, getUserNameAmountSumSaga);
}

export function* registerFCMTokenSaga(action: any) {
  try {
    const fcmToken = yield call(getFCMToken);
    const os = Platform.OS;
    const response = yield call(authApi.registerFCMToken, {
      deviceToken: fcmToken,
      platform: os
    });
  } catch (e) {

  }
}

export function* watchRegisterFCMToken() {
  yield takeLatest(REGISTER_FCM_TOKEN, registerFCMTokenSaga);
}

export function* blockUserSaga(action: { userId: any; onSuccess: () => any; onFail: (arg0: unknown) => any; }) {
  try {
    const response = yield call(authApi.blockUser, action.userId);
    yield put(fetchBlockList());
    action.onSuccess && action.onSuccess();
  } catch (error) {
    action.onFail && action.onFail(error);
  }
}

export function* watchBlockUser() {
  yield takeLatest(BLOCK_USER, blockUserSaga);
}

export function* unblockUserSaga(action: { userId: any; }) {
  try {
    const response = yield call(authApi.unblockUser, action.userId);
    yield put(fetchBlockList());
  } catch (error) {
  }
}

export function* watchUnblockUser() {
  yield takeLatest(UNBLOCK_USER, unblockUserSaga);
}

export function* suspendAccountSaga(action: { onSuccess: () => any; onFail: (arg0: unknown) => any; }) {
  try {
    const response = yield call(authApi.suspendAccount);
    action.onSuccess && action.onSuccess();
  } catch (error) {
    action.onFail && action.onFail(error);
  }
}

export function* watchSuspendAccount() {
  yield takeLatest(PROFILE_SUSPEND, suspendAccountSaga);
}
