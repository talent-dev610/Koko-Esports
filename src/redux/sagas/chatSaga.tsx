import {put, takeEvery, call, takeLatest} from 'redux-saga/effects';
import {
  CHAT_BLOCK_CHECK, CHAT_CREATE_SUPPORT_THREAD,
  CHAT_FETCH_THREAD_MESSAGES,
  CHAT_FETCH_THREAD_UNREAD_MESSAGE_COUNT,
  CHAT_FETCH_THREADS, CHAT_SEND_MESSAGE, CHAT_SET_THREAD_READ_AT, CHAT_SEND_DIRECT_MESSAGE
} from "../actions/types";
import * as chatApi from "../services/chatApi";
import { getUserId } from "../utils/localDataManager";
import {
  createSupportThreadSuccess,
  fetchChatThreadsSuccess,
  fetchThreadUnreadMessageCount,
  fetchThreadUnreadMessageCountSuccess, sendDirectMessageSuccess, setThreadReadAt
} from "../actions/chatActions";
import * as authApi from "../services/authApi";
import { blockUserSuccess } from "../actions/authActions";

export function* fetchChatThreadsSaga(action) {
  const userId = yield call(getUserId);
  const threads = yield call(chatApi.fetchChatThread, action.chatType, userId);
  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i];
    yield put(fetchThreadUnreadMessageCount(thread.threadID));
  }
  yield put(fetchChatThreadsSuccess(action.chatType, threads));
}

export function* watchFetchChatThreads() {
  yield takeEvery(CHAT_FETCH_THREADS, fetchChatThreadsSaga);
}

export function* fetchChatThreadMessageSaga(action) {
  const response = yield call(chatApi.fetchChatThreadMessages, action.threadID);
  action.onSuccess && action.onSuccess(response);
}

export function* watchFetchChatThreadMessage() {
  yield takeLatest(CHAT_FETCH_THREAD_MESSAGES, fetchChatThreadMessageSaga);
}

export function* fetchThreadUnreadMessageCountSaga(action) {
  const count = yield call(chatApi.fetchThreadUnreadMessageCount, action.threadID);
  yield put(fetchThreadUnreadMessageCountSuccess(action.threadID, count));
}

export function* watchFetchThreadUnreadMessageCount() {
  yield takeEvery(CHAT_FETCH_THREAD_UNREAD_MESSAGE_COUNT, fetchThreadUnreadMessageCountSaga);
}

export function* setThreadReadAtSaga(action) {
  const result = yield call(chatApi.setThreadReadAt, action.threadID);
  yield put(fetchThreadUnreadMessageCount(action.threadID));
}

export function* watchSetThreadReadAt() {
  yield takeEvery(CHAT_SET_THREAD_READ_AT, setThreadReadAtSaga);
}

export function* sendMessageSaga(action) {
  const message = yield call(chatApi.sendMessage, action.threadID, action.body, action.user, action.chatType);
  yield put(setThreadReadAt(action.threadID));
  action.onSuccess && action.onSuccess(message);
}

export function* watchSendMessage() {
  yield takeLatest(CHAT_SEND_MESSAGE, sendMessageSaga);
}

export function* checkBlockSaga(action) {
  try {
    const response = yield call(chatApi.checkBlocked, action.userId);
    action.onSuccess && action.onSuccess(response.data.blocked);
  } catch (error) {
    action.onFail && action.onFail(error);
  }
}

export function* watchCheckBlock() {
  yield takeLatest(CHAT_BLOCK_CHECK, checkBlockSaga);
}

export function* sendDirectMessageSaga(action: any) {
  try {
    const thread = yield call(chatApi.sendDirectMessage,action.me, action.user);
    if (thread) {
      yield put(sendDirectMessageSuccess());
      action.onSuccess && action.onSuccess(thread);
    } else {
      action.onFail && action.onFail("Cannot send direct message");
    }
  } catch (error) {
    action.onFail && action.onFail(error);
  }
}

export function* watchSendDirectMessage() {
  yield takeLatest(CHAT_SEND_DIRECT_MESSAGE, sendDirectMessageSaga);
}


export function* createSupportThreadSaga(action: any) {
  try {
    const thread = yield call(chatApi.createSupportThread, action.user);
    if (thread) {
      yield put(createSupportThreadSuccess(thread));
      action.onSuccess && action.onSuccess(thread);
    } else {
      action.onFail && action.onFail("Cannot create cs thread");
    }
  } catch (error) {
    action.onFail && action.onFail(error);
  }
}

export function* watchCreateSupportThread() {
  yield takeLatest(CHAT_CREATE_SUPPORT_THREAD, createSupportThreadSaga);
}
