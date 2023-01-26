import React, { memo } from "react";
import { StyleSheet, TouchableOpacity ,Text, ViewStyle, GestureResponderEvent} from "react-native";
import colors from "../theme/colors";
import { hScaleRatio, wScale } from "../utils/scailing";

interface LogoutButtonProps {
  style: ViewStyle
  onPress: (event: GestureResponderEvent) => void
}

export default memo(({ style, onPress }: LogoutButtonProps) => {
  return (
    <TouchableOpacity style={[defStyle.wrapper, style]} onPress={onPress}>
       <Text style={defStyle.text}>LOGOUT</Text>
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    borderRadius: wScale(15),
    borderColor: colors.loginColor,
    borderWidth: 1,
    width: wScale(80),
    height: hScaleRatio(48),
    alignItems: 'center',
    justifyContent: 'center'
  },
  text:{
    fontFamily: "Noto Sans",
    fontSize: 12,
    fontWeight:'400',
    textAlign: 'center',
    color: 'white'
  }
});
