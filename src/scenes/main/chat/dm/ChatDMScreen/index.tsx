import React, { useState, useEffect, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Text, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import "../../../../../utils/i18n";
import { useTranslation } from "react-i18next";
import ChatMessage from "../../../../../components/chat/ChatMessage";
import ChatBackButton from "../../../../../components/chat/ChatBackButton";
import ChatMessageComposer from "../../../../../components/chat/ChatMessageComposer";
import * as reduxChatActions from "../../../../../redux/actions/chatActions";
import * as reduxAuthActions from "../../../../../redux/actions/authActions";
import { getUserInfo } from "../../../../../redux/selectors";
import { ChatType } from "../../../../../consts/chatConfig";

import { REFRESH_CHAT_MESSAGES } from "../../../../../events/types";
import MoreButton from "../../../../../components/MoreButton";
import ActionSheet from "../../../../../components/ActionSheet";
import colors from "../../../../../theme/colors";
import { ActionSheetItemDataType, ChatMessageDataType, ChatThreadDataType } from "../../../../../@types/spec";
import EventBus from "react-native-event-bus";
import { wScale } from "../../../../../utils/scailing";

interface ChatDMScreenProps {
  thread: ChatThreadDataType
  me: any
  chatActions: any
  authActions: any
  onBack: Function
}

const ChatDMScreen = ({thread, me, chatActions, authActions, onBack}: ChatDMScreenProps) => {
  const { t } = useTranslation();
  const participant = (thread.membersDetail.filter((memberDetail:any) => memberDetail.id !== me.id))[0];
  const [messages, setMessages] = useState<ChatMessageDataType[]>([]);
  const [actionSheet, setActionSheet] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const ref = useRef<FlatList>(null);
  const actionItems: ActionSheetItemDataType[] = [
    {
      label: t("chat.report"),
      color: colors.red,
      onPress: () => onReport(),
    },
    {
      label: t("chat.block"),
      color: colors.red,
      onPress: () => onBlock(),
    }
  ];

  useEffect(() => {
    loadChatData();
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

  const onThreadMessagesSuccess = (messages: ChatMessageDataType[]) => {
    setMessages(messages);
  };

  const onThreadMessagesFail = (error: any) => {

  };

  const onBackPress = () => {
    onBack();
  };

  const onSendMessage = (message: string) => {
    chatActions.sendMessage(thread.threadID, message, me, ChatType.DM, onSendMessageSuccess);
  };

  const onSendMessageSuccess = (message: ChatMessageDataType) => {
    const newMessages = [message, ...messages];
    setMessages(newMessages);
    chatActions.fetchChatThreads(ChatType.DM);
    ref?.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const renderMessageItem = (item: any) => {
    return <ChatMessage message={item.item} />;
  };

  const renderSeparator = () => {
    return <View style={styles.messageSeparator} />;
  };

  const onMoreButtonPress = () => {
    setActionSheet(true);
  };

  const onCancelActionSheet = () => {
    setActionSheet(false);
  };

  const onReport = () => {
    setActionSheet(false);
  };

  const onBlock = () => {
    setActionSheet(false);
    authActions.blockUser(participant.id, onBlockSuccess, onBlockFail);
  };

  const onBlockSuccess = () => {
    onBack();
  };

  const onBlockFail = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <ChatBackButton style={styles.back} onPress={onBackPress} />
        <Text style={styles.title}>{participant.userName}</Text>
        <MoreButton style={styles.more} onPress={onMoreButtonPress} />
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
      <Modal transparent={true} visible={actionSheet} animationType="fade" >
        <ActionSheet
          actionItems={actionItems}
          onCancel={onCancelActionSheet}
        />
      </Modal>
    </View>
    
  );
};

const mapStateToProps = (state: any) => {
  return {
    me: getUserInfo(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    chatActions: bindActionCreators(reduxChatActions, dispatch),
    authActions: bindActionCreators(reduxAuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatDMScreen);
