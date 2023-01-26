import React, { memo } from "react";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import Back from "../../assets/images/back.svg";
import colors from "../theme/colors";
import { hScaleRatio, wScale } from "../utils/scailing";

interface BackButtonProps {
  style?: ViewStyle
  onPress: (event: GestureResponderEvent) => void
}

export default memo(({ style, onPress }: BackButtonProps) => {
  return (
    <TouchableOpacity style={[defStyle.container, style]} onPress={onPress}>
      <Back width={23} height={23}/>
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    borderRadius: wScale(15),
    borderColor: colors.loginColor,
    borderWidth: 1,
    width: wScale(48),
    height: hScaleRatio(48),
    alignItems: 'center',
    justifyContent: 'center'
  },
});
