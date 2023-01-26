import firestore from "@react-native-firebase/firestore";
import {
  CHAT_MESSAGE_COLLECTION,
  CHAT_READ_COLLECTION,
  CHAT_THREAD_COLLECTION,
  ChatType,
} from "../../consts/chatConfig";
import { getUserId } from "../utils/localDataManager";
import moment from "moment";
import { api } from "./api";

const threadCollection = firestore().collection(CHAT_THREAD_COLLECTION);
const messageCollection = firestore().collection(CHAT_MESSAGE_COLLECTION);
const readAtCollection = firestore().collection(CHAT_READ_COLLECTION);

export const fetchChatThread = async (type, userId) => {
  const querySnapshot = type === ChatType.Room ?
    await threadCollection.where('type', '==', type.type).get()
  : await threadCollection.where('type', '==', type.type).where('members', 'array-contains', userId).get();
  return querySnapshot.docs.map(value => {return {threadID: value.id, ...value.data()};});
}

export const fetchChatThreadMessages = async (threadID) => {
  const threadDoc = (await messageCollection.doc(threadID).collection("messages").get()).docs;
  return threadDoc.map(document => document.data()).sort((a, b) => b.sentAt - a.sentAt);
}

export const fetchThreadUnreadMessageCount = async (threadID) => {
  const userId = await getUserId();
  const readAtData = (await readAtCollection.doc(`${userId}`).get()).data();
  const readAt = readAtData && readAtData[threadID] ? moment(readAtData[threadID]) : moment("2000-01-01");
  const messages = await fetchChatThreadMessages(threadID);
  const unreadMessages = messages.filter(message => message.author.id !== userId && readAt.isBefore(moment(message.sentAt)));
  return unreadMessages.length;
}

export const setThreadReadAt = async (threadID) => {
  const userId = await getUserId();
  const readAtData = (await readAtCollection.doc(`${userId}`).get()).data();
  if (readAtData) {
    await readAtCollection.doc(`${userId}`).update({[threadID]: firestore.FieldValue.serverTimestamp()});
  } else {
    await readAtCollection.doc(`${userId}`).set({[threadID]: firestore.FieldValue.serverTimestamp()});
  }
  return true;
}

export const sendDirectMessage = async (me,user) => {
   const documentSnapshot = await (await threadCollection.add({
    createdAt: firestore.FieldValue.serverTimestamp(),
    lastSentAt: firestore.FieldValue.serverTimestamp(),
    lastSentAuthorId: me.id,
    members: [me.id, user.id],
    membersDetail: [
      {
        id: me.id,
        picture: me.picture,
        userName: me.userName
      },
      {
        id: user.id,
        picture: user.picture,
        userName: user.userName
      }
    ],
    name: `${me.id}_${user.id}`,
    type: "DM"
  })).get();
 const data = documentSnapshot.data();
 console.log(data)
  return true;
  // return {threadID: documentSnapshot.id, ...data};
}

export const sendMessage = async (threadID, body, user, chatType) => {
  console.log('[User]', user);
  await messageCollection.doc(threadID).collection("messages").add({
    author: {
      id: user.id,
      picture: user.picture,
      userName: user.userName
    },
    body: body,
    sentAt: firestore.FieldValue.serverTimestamp()
  });
  await threadCollection.doc(threadID).update({"lastSentAt": firestore.FieldValue.serverTimestamp(), "lastSentAuthorId": user.id});
  const documentData = (await threadCollection.doc(threadID).get()).data();
  const threadMembers = documentData.members ?? [];
  const threadMemberDetails = documentData.membersDetail ?? [];
  if (!threadMembers.includes(user.id)) {
    threadMembers.push(user.id);
    threadMemberDetails.push({
      id: user.id,
      picture: user.picture,
      userName: user.userName
    });
    await threadCollection.doc(threadID).update({"members": threadMembers, "membersDetail": threadMemberDetails});
  }
  if (chatType === ChatType.DM) {
    const response = api.post(`push/dm/notify`, {
      targetUserId: user.id,
      msgContent: body,
      msgTemplateId: 0
    });
  }
  const messages = await fetchChatThreadMessages(threadID);
  return messages[0];
}

export const checkBlocked = async (userId) => {
  return api.post(`chat/block/check`, {targetUserId: userId});
}

export const createSupportThread = async (user: UserDataType) => {
  const documentSnapshot = await (await threadCollection.add({
    createdAt: firestore.FieldValue.serverTimestamp(),
    lastSentAt: firestore.FieldValue.serverTimestamp(),
    lastSentAuthorId: user.id,
    members: [0, user.id],
    membersDetail: [
      {
        id: 0,
        picture: "0",
        userName: "KOKO_CS_1"
      },
      {
        id: user.id,
        picture: user.picture,
        userName: user.userName
      }
    ],
    name: `${user.id}_0`,
    type: "CS"
  })).get();
  const data = documentSnapshot.data();
  return {threadID: documentSnapshot.id, ...data};
}
