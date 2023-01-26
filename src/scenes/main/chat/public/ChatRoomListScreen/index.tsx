import React, { useState, useEffect } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import { getPublicThreads, getUnreadCount } from "../../../../../redux/selectors";
import ChatPublicThreadItem from "../../../../../components/chat/public/ChatPublicThreadItem";
import ChatRoomScreen from "../ChatRoomScreen";
import { calcUnreadMessagesThreads } from "../../../../../utils/chatUtils";
import { ChatThreadDataType } from "../../../../../@types/spec";

interface ChatRoomListScreenDataType {
  threads: ChatThreadDataType[]
  unreadMessages: Array<{ [threadId: string]: number }>
  setTab: any
}

const ChatRoomListScreen = ({ threads, unreadMessages,setTab }: ChatRoomListScreenDataType) => {
  const [search, setSearch] = useState("");
  const [selectedThread, setSelectedThread] = useState<ChatThreadDataType | null>(null);

  const renderThreadItem = (item: { item: ChatThreadDataType, index: number }) => {
    return <ChatPublicThreadItem thread={item.item} unread={calcUnreadMessagesThreads(unreadMessages, [item.item.threadID])} onPress={() => setSelectedThread(item.item)} />;
  };

  const renderSeparator = () => {
    return <View style={styles.threadSeparator} />;
  };

  const filterThreads = () => {
    return threads.filter(thread => {
      if (search === "") return true;
      return thread.name.toLowerCase().includes(search.toLowerCase());
    });
  };

  return (
    <View style={styles.container}>
      {
        !selectedThread && <TextInput style={styles.search}
          underlineColorAndroid="transparent"
          placeholder="Enter Room Number"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          onChangeText={text => setSearch(text)}
          autoCapitalize="none" />
      }
      {
        !selectedThread && <FlatList
          data={filterThreads()}
          style={styles.threadList}
          renderItem={renderThreadItem}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false} />
      }
      {
        selectedThread && <ChatRoomScreen setTab={setTab} thread={selectedThread} onBack={() => setSelectedThread(null)} />
      }
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    threads: getPublicThreads(state),
    unreadMessages: getUnreadCount(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomListScreen);
