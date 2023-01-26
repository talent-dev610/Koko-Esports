import React, { memo } from "react";
import { StyleSheet, Text, View, ViewStyle , GestureResponderEvent, Pressable} from "react-native";
import { hScaleRatio, wScale } from "../../utils/scailing";
import UserAvatar from "../main/profile/UserAvatar";
import colors from "../../theme/colors";
import { kokoChatTimeFormat } from "../../utils/stringUtils";

interface ChatMessageProps {
  style?: ViewStyle
  message: {
    author: {
      id: number
      userName: string
      picture: string
    }
    body: string
    sentAt: any
  }
  onPress?: (event: GestureResponderEvent) => void
}


export default memo(({ style, message ,onPress}: ChatMessageProps) => {
  return (
    <View style={[defStyle.container, style]}>
        <UserAvatar avatar={message.author.picture} size={48} activeOpacity={0.2} selected={true} onPress = {onPress}/>
      <View style={defStyle.content}>
        <Text style={defStyle.username}>{message.author.userName}</Text>
        <Text style={defStyle.text}>{message.body}</Text>
      </View>
      <Text style={defStyle.time}>{kokoChatTimeFormat(message.sentAt)}</Text>
    </View>
  );
});

const defStyle = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
    marginHorizontal: wScale(20)
  },
  username: {
    fontFamily: "Noto Sans",
    fontWeight: "700",
    fontSize: 14,
    color: colors.white,
    marginBottom: hScaleRatio(5)
  },
  text: {
    fontFamily: "Noto Sans",
    fontWeight: "400",
    fontSize: 14,
    color: colors.white,
    backgroundColor: colors.loginColor,
    paddingHorizontal: wScale(10),
    paddingVertical: hScaleRatio(5),
    borderRadius: wScale(6)
  },
  time: {
    fontFamily: "Noto Sans",
    fontWeight: "500",
    fontSize: 11,
    color: colors.white
  },
  button:{
    backgroundColor: 'transparent',
    width:'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
