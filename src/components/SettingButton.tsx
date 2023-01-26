import React, { memo } from "react";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import colors from "../theme/colors";
import { hScaleRatio, wScale } from "../utils/scailing";
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

interface SettingButtonProps {
  style: ViewStyle
  onPress: (event: GestureResponderEvent) => void
}

export default memo(({ style, onPress }: SettingButtonProps) => {
  return (
    <TouchableOpacity style={[defStyle.wrapper, style]} onPress={onPress}>
      <IoniconsIcon name='settings-sharp' style={defStyle.setting} />
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
    borderRadius: wScale(15),
    borderColor: colors.loginColor,
    borderWidth: 1,
    width: wScale(48),
    height: hScaleRatio(48),
    alignItems: 'center',
    justifyContent: 'center'
  },
  setting:{
    color: colors.white,
    fontSize:20,
  }
});
