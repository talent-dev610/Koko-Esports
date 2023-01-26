import React, { useState, useEffect } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import { getBlockedUsers, getDMThreads, getUnreadCount, getUserInfo } from "../../../../../redux/selectors";
import ChatDMScreen from "../ChatDMScreen";
import ChatDMThreadItem from "../../../../../components/chat/dm/ChatDMThreadItem";
import { calcUnreadMessagesThreads } from "../../../../../utils/chatUtils";
import * as reduxChatActions from '../../../../../redux/actions/chatActions';
import { ConfirmDialogType } from "../../../../../consts/config";
import KokoConfirmDialog from "../../../../../components/KokoConfirmDialog";
import { useTranslation } from "react-i18next";
import "../../../../../utils/i18n";
import { BlockedUserDataType, ChatThreadDataType } from "../../../../../@types/spec";

interface ChatDMListScreenProps {
  threads:        ChatThreadDataType[]
  blockedUsers:   BlockedUserDataType[]
  me: any
  unreadMessages: any
  chatActions: any
}

const ChatDMListScreen = ({threads, blockedUsers, me, unreadMessages, chatActions}: ChatDMListScreenProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedThread, setSelectedThread] = useState(null);
  const [temp, setTemp] = useState<ChatThreadDataType|null>(null);
  const [userName, setUserName] = useState("");
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  useEffect(() => {
    if (temp) {
      const participant = temp.membersDetail.filter(value => value.id !== me.id)[0];
      setUserName(participant ? participant.userName : "");
    } else {
      setUserName("");
    }
  }, [temp]);

  let tmp = null as any;

  const renderThreadItem = (item: any) => {
    return <ChatDMThreadItem thread={item.item} myID={me.id} unread={calcUnreadMessagesThreads(unreadMessages, [item.item.threadID])} onPress={() => onPressThread(item.item)} />;
  };

  const renderSeparator = () => {
    return <View style={styles.threadSeparator}/>;
  }

  const onPressThread = (thread: ChatThreadDataType) => {
    tmp = thread;
    setTemp(thread);
    const participantId = thread.members.filter(value => value !== me.id)[0];
    chatActions.checkBlocked(participantId, onCheckSuccess, onCheckFail);
  };

  const onCheckSuccess = (blocked: any) => {
    if (blocked) {
      setShowBlockDialog(true);
    } else {
      setSelectedThread(tmp);
    }
  };

  const onCheckFail = () => {
    setSelectedThread(tmp);
  };

  const onBackBlockDialog = () => {
    setShowBlockDialog(false);
  };

  const onOkBlockDialog = () => {
    setShowBlockDialog(false);
  };

  const filterThreads = () => {
    return threads.filter(thread => {
      const participant = thread.membersDetail.filter(member => member.id !== me.id)[0];
      const users = blockedUsers.filter(user => user.id === participant.id);
      const isBlocked = users.length > 0;
      if (isBlocked) return false;
      if (search === "") return true;
      return participant.userName.toLowerCase().includes(search.toLowerCase());
    });
  };

  return (
    <View style={styles.container}>
      {
        !selectedThread && <TextInput style={styles.search}
                                      underlineColorAndroid="transparent"
                                      placeholder="Enter User name"
                                      placeholderTextColor="rgba(0, 0, 0, 0.3)"
                                      onChangeText={text => setSearch(text)}
                                      autoCapitalize="none" />
      }
      {
        !selectedThread && <FlatList
          data={filterThreads()}
          style={styles.threadList}
          ItemSeparatorComponent={renderSeparator}
          renderItem={renderThreadItem}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}/>
      }
      {
        selectedThread && <ChatDMScreen thread={selectedThread} onBack={() => setSelectedThread(null)}/>
      }
      <KokoConfirmDialog
        visible={showBlockDialog}
        type={ConfirmDialogType.close}
        title={t("chat.block_title")}
        message={t("chat.blocked_by", { username: userName })}
        onCancel={onBackBlockDialog}
        onOk={onOkBlockDialog} />
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    threads: getDMThreads(state),
    unreadMessages: getUnreadCount(state),
    me: getUserInfo(state),
    blockedUsers: getBlockedUsers(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    chatActions: bindActionCreators(reduxChatActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatDMListScreen);
