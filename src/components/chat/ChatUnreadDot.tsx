import React, { memo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import colors from "../../theme/colors";
import { hScaleRatio, width, wScale } from "../../utils/scailing";
import shadows from "../../theme/shadows";

interface ChatUnreadDotProps {
  style: ViewStyle
}

export default memo(({ style, /* type, selected, onPress */ }: ChatUnreadDotProps) => {

  return (
    <View style={[defStyle.container, style]}/>
  );
});

const defStyle = StyleSheet.create({
  container: {
    width: wScale(20),
    height: hScaleRatio(20),
    borderRadius: wScale(10),
    backgroundColor: colors.chatYellow,
    ...shadows.default
  }
});
