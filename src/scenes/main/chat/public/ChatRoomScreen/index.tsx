import React, { useState, useEffect, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Text, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import * as reduxChatActions from "../../../../../redux/actions/chatActions";
import ChatBackButton from "../../../../../components/chat/ChatBackButton";
import ChatMessageComposer from "../../../../../components/chat/ChatMessageComposer";
import ChatMessage from "../../../../../components/chat/ChatMessage";
import { ChatType } from "../../../../../consts/chatConfig";

import { GO_TO_STORE, REFRESH_CHAT_MESSAGES } from "../../../../../events/types";
import { getUserInfo, getDMThreads } from "../../../../../redux/selectors";
import { ChatMessageDataType, ChatThreadDataType } from "../../../../../@types/spec";
import EventBus from "react-native-event-bus";
import { wScale } from "../../../../../utils/scailing";

interface ChatRoomScreenProps {
  thread: ChatThreadDataType
  chatActions: any
  onBack: any
  me: any
  setTab:any
  dmThreads:any
}

const ChatRoomScreen = ({ thread, dmThreads, chatActions, onBack, me ,setTab}: ChatRoomScreenProps) => {
  const [messages, setMessages] = useState<ChatMessageDataType[]>([]);
  const [dmList, setDmList] = useState([]);
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    loadChatData();
    EventBus.getInstance().addListener(REFRESH_CHAT_MESSAGES, (data: any) => {
      if (data.thread === thread.threadID) {
        loadChatData();
      }
    });
  }, []);

  
  useEffect(() => {
    console.log("thread",thread)
  }, []);

  const loadChatData = () => {
    chatActions.setThreadReadAt(thread.threadID);
    chatActions.fetchChatThreadMessages(thread.threadID, onThreadMessagesSuccess, onThreadMessagesFail);
  };

  const onThreadMessagesSuccess = (messages: ChatMessageDataType[]) => {
    setMessages(messages);
  };

  const onThreadMessagesFail = (error: any) => {

  };

  const onBackPress = () => {
    chatActions.setThreadReadAt(thread.threadID);
    onBack();
  };

  const onSendMessage = (message: string) => {
    chatActions.sendMessage(thread.threadID, message, me, ChatType.Room, onSendMessageSuccess);
  };

  const onSendMessageSuccess = (message: ChatMessageDataType) => {
    const newMessages = [message, ...messages];
    setMessages(newMessages);
    chatActions.fetchChatThreads(ChatType.Room);
    ref?.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const onUserAvatarPress = (user: any) => {
    var isThere: boolean = false;
    if(user.id === me.id) 
      return;
    console.log("dmthreads", dmThreads)
    console.log("memberDetail",  dmThreads.filter( (thread:any) => {
      const participant = thread.membersDetail.filter((member:any) => member.id !== me.id)[0];
      console.log("participantid",participant?.id)
      console.log("userid",user.id)
      if(participant?.id === user.id){
         isThere = true; 
      }
    }))
    console.log("isthere",isThere)
    if(isThere) {
       setTab(ChatType.DM)
    } 
    else{
    chatActions.sendDirectMessage(me,user , onSendDirectMessageSuccess,onSendDirectMessageFailed)
}
  };

  
  const onSendDirectMessageSuccess = () => {
    setTab(ChatType.DM)
    console.log("success")
  };

  const onSendDirectMessageFailed = () => {
    console.log("failed")
  };

  const renderMessageItem = (item: any) => {
    console.log(item)
    return <ChatMessage message={item.item} onPress = {() => 
    onUserAvatarPress(item.item.author)
    } />;
  }

  const renderSeparator = () => {
    return <View style={styles.messageSeparator} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <ChatBackButton style={styles.back} onPress={onBackPress} />
        <Text style={styles.title}>{thread.name}</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ marginBottom: wScale(58) }} >
          <FlatList
            ref={ref}
            data={messages}
            style={styles.messageList}
            renderItem={renderMessageItem}
            ItemSeparatorComponent={renderSeparator}
            showsVerticalScrollIndicator={false}
            inverted={true}
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
    me: getUserInfo(state),
    dmThreads: getDMThreads(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    chatActions: bindActionCreators(reduxChatActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomScreen);
