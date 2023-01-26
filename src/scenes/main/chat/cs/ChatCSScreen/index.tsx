import React, { useState, useEffect, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Text, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import { getCSThreads, getPublicThreads, getUserInfo } from "../../../../../redux/selectors";
import * as reduxChatActions from "../../../../../redux/actions/chatActions";
import ChatMessage from "../../../../../components/chat/ChatMessage";
import ChatMessageComposer from "../../../../../components/chat/ChatMessageComposer";
import { ChatType } from "../../../../../consts/chatConfig";
import { ChatMessageDataType } from "../../../../../@types/spec";
import { createSupportThread } from "../../../../../redux/actions/chatActions";
import { wScale } from "../../../../../utils/scailing";
import { REFRESH_CHAT_MESSAGES } from "../../../../../events/types";
import EventBus from "react-native-event-bus";

interface ChatCSScreenProps {
  threads: any
  chatActions: any
  me: any
}

const ChatCSScreen = ({threads, chatActions, me}: ChatCSScreenProps) => {

  let thread = threads.length > 0 ? threads[0] : undefined;
  const [messages, setMessages] = useState<ChatMessageDataType[]>([]);
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    if (thread) {
      chatActions.setThreadReadAt(thread.threadID);
      chatActions.fetchChatThreadMessages(thread.threadID, onThreadMessagesSuccess, onThreadMessagesFail);
      //chatActions.fetchChatThreadMessages(thread.threadID, onThreadMessagesSuccess, onThreadMessagesFail);
    } else {
      chatActions.createSupportThread(me, onCreateThreadSuccess, onCreateThreadFail);
    }
    EventBus.getInstance().addListener(REFRESH_CHAT_MESSAGES, (data: any) => {
      if (data.thread === thread.threadID) {
        loadChatData();
      }
    });
  }, []);

 const loadChatData = () => {
    chatActions.setThreadReadAt(thread.threadID);
    chatActions.fetchChatThreadMessages(thread.threadID, onThreadMessagesSuccess, onThreadMessagesFail);
  };

  const onCreateThreadSuccess = (newThread: ChatMessageDataType) => {
    thread = newThread;
  };

  const onCreateThreadFail = (error: any) => {

  };

  const onThreadMessagesSuccess = (messages: ChatMessageDataType[]) => {
    setMessages(messages);
  };

  const onThreadMessagesFail = (error: any) => {

  };

  const onSendMessage = (message: string) => {
    if (thread) {
      chatActions.sendMessage(thread.threadID, message, me, ChatType.CS, onSendMessageSuccess);
    }
  };

  const onSendMessageSuccess = (message: ChatMessageDataType) => {
    const newMessages = [message, ...messages];
    setMessages(newMessages);
    chatActions.fetchChatThreads(ChatType.CS);
    ref?.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderMessageItem = (item: any) => {
    return <ChatMessage message={item.item} />;
  }

  const renderSeparator = () => {
    return <View style={styles.messageSeparator}/>;
  };

  return (
    <View style = {{flex:1}}>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginBottom: wScale(58) }} >
          <FlatList
            ref={ref}
            data={messages}
            style={styles.messageList}
            renderItem={renderMessageItem}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false} />
        </View>
        <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
          <ChatMessageComposer onSend={onSendMessage} />
        </View>
      </View>
      <KeyboardAvoidingView style={styles.keyboardAvoidView} behavior={'position'}>
      </KeyboardAvoidingView>
    </View>
      
  );
};

const mapStateToProps = (state: any) => {
  return {
    threads: getCSThreads(state),
    me: getUserInfo(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    chatActions: bindActionCreators(reduxChatActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatCSScreen);
