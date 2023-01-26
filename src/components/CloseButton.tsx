import React, { memo } from "react";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import colors from "../theme/colors";
import { hScaleRatio, wScale } from "../utils/scailing";
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CloseButtonProps {
  style?: ViewStyle
  onPress: (event: GestureResponderEvent) => void
}

export default memo(({ style, onPress }: CloseButtonProps) => {
  return (
    <TouchableOpacity style={[defStyle.container, style]} onPress={onPress}>
      <Ionicons
        name="close"
        style={defStyle.icon} />
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(196, 196, 196, 0.3)',
    borderRadius: wScale(20),
    width: wScale(40),
    height: hScaleRatio(40),
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: 24,
    color: colors.gray
  }
});
