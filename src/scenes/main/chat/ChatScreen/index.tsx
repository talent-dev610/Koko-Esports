import React, { useState, useEffect } from "react";
import { TextInput, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import CloseButton from "../../../../components/CloseButton";
import { ChatType } from "../../../../consts/chatConfig";
import ChatTab from "../../../../components/chat/ChatTab";
import ChatRoomListScreen from "../public/ChatRoomListScreen";
import ChatDMListScreen from "../dm/ChatDMListScreen";
import ChatCSScreen from "../cs/ChatCSScreen";
import { getCSThreads, getDMThreads, getPublicThreads, getUnreadCount } from "../../../../redux/selectors";
import { calcUnreadMessagesThreads } from "../../../../utils/chatUtils";
import { ChatThreadDataType } from "../../../../@types/spec";

interface ChatScreenProps {
  navigation: any
  unreadMessages: Array<{ [threadId: string]: number }>
  publicThreads: ChatThreadDataType[]
  dmThreads: ChatThreadDataType[]
  csThreads: ChatThreadDataType[]
}

const ChatScreen = ({ navigation, unreadMessages, publicThreads, dmThreads, csThreads }: ChatScreenProps) => {
  const [tab, setTab] = useState(ChatType.Room);

  const onClose = () => {
    navigation.goBack();
  };

  const onTabPress = (type: any) => {
    setTab(type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <View style={{ flex: 1 }} />
        <CloseButton onPress={onClose} />
      </View>
      <View style={styles.tabBar}>
        <ChatTab type={ChatType.Room} selected={tab === ChatType.Room} onPress={() => onTabPress(ChatType.Room)}
          unread={calcUnreadMessagesThreads(unreadMessages, publicThreads.map(thread => thread.threadID))} />
        <ChatTab type={ChatType.DM} selected={tab === ChatType.DM} onPress={() => onTabPress(ChatType.DM)}
          style={styles.tabItem}
          unread={calcUnreadMessagesThreads(unreadMessages, dmThreads.map(thread => thread.threadID))} />
        <ChatTab type={ChatType.CS} selected={tab === ChatType.CS} onPress={() => onTabPress(ChatType.CS)}
          unread={calcUnreadMessagesThreads(unreadMessages, csThreads.map(thread => thread.threadID))} />
      </View>

      {
        tab === ChatType.Room && <ChatRoomListScreen setTab={setTab} />
      }
      {
        tab === ChatType.DM && <ChatDMListScreen />
      }
      {
        tab === ChatType.CS && <ChatCSScreen />
      }
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    publicThreads: getPublicThreads(state),
    dmThreads: getDMThreads(state),
    csThreads: getCSThreads(state),
    unreadMessages: getUnreadCount(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
