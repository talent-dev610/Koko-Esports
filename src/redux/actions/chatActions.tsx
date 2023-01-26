import {
  CHAT_BLOCK_CHECK, CHAT_CREATE_SUPPORT_THREAD, CHAT_CREATE_SUPPORT_THREAD_SUCCESS,
  CHAT_FETCH_THREAD_MESSAGES, CHAT_FETCH_THREAD_UNREAD_MESSAGE_COUNT, CHAT_FETCH_THREAD_UNREAD_MESSAGE_COUNT_SUCCESS,
  CHAT_FETCH_THREADS,
  CHAT_FETCH_THREADS_SUCCESS, CHAT_SEND_MESSAGE,
  CHAT_SET_THREAD_READ_AT,
  CHAT_SEND_DIRECT_MESSAGE,
  CHAT_SEND_DIRECT_MESSAGE_SUCCESS
} from "./types";
import { ChatThreadDataType } from "../../@types/spec";
import { AnyAction } from "redux";

export const fetchChatThreads = (chatType: { translate: string; type: string; }) => ({
  type: CHAT_FETCH_THREADS,
  chatType
});

export const fetchChatThreadsSuccess = (chatType: { translate: string; type: string; }, threads: ChatThreadDataType[]) => ({
  type: CHAT_FETCH_THREADS_SUCCESS,
  chatType,
  threads
});

export const fetchChatThreadMessages = (threadID: string, onSuccess: any, onFail: any) => ({
  type: CHAT_FETCH_THREAD_MESSAGES,
  threadID,
  onSuccess,
  onFail
});

export const setThreadReadAt = (threadID: string) => ({
  type: CHAT_SET_THREAD_READ_AT,
  threadID
});

export const fetchThreadUnreadMessageCount = (threadID: string) => ({
  type: CHAT_FETCH_THREAD_UNREAD_MESSAGE_COUNT,
  threadID
});

export const fetchThreadUnreadMessageCountSuccess = (threadID: string, count: number) => ({
  type: CHAT_FETCH_THREAD_UNREAD_MESSAGE_COUNT_SUCCESS,
  threadID,
  count
});

export const sendMessage = (threadID: string, body: string, user: UserDataType, chatType: { translate: string; type: string; }, onSuccess: any) => ({
  type: CHAT_SEND_MESSAGE,
  threadID,
  body,
  user,
  chatType,
  onSuccess
});

export const checkBlocked = (userId: number, onSuccess: any, onFail: any) => ({
  type: CHAT_BLOCK_CHECK,
  userId,
  onSuccess,
  onFail
});


export const sendDirectMessage = (me: any, user: any, onSuccess: any, onFail: any) => ({
  type: CHAT_SEND_DIRECT_MESSAGE,
  me,
  user,
  onSuccess,
  onFail
});
export const sendDirectMessageSuccess = () => ({
  type: CHAT_SEND_DIRECT_MESSAGE_SUCCESS,
});

export const createSupportThread = (user: UserDataType, onSuccess: any, onFail: any) => ({
  type: CHAT_CREATE_SUPPORT_THREAD,
  user,
  onSuccess,
  onFail
});


export const createSupportThreadSuccess = (thread: ChatThreadDataType) => ({
  type: CHAT_CREATE_SUPPORT_THREAD_SUCCESS,
  thread
});
