import React, { memo } from "react";
import { StyleSheet, Text, ViewStyle } from "react-native";
import colors from "../../theme/colors";
import { hScaleRatio, wScale } from "../../utils/scailing";
import AutoScroll from "@homielab/react-native-auto-scroll";
import LinearGradient from "react-native-linear-gradient";
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";

interface KokoMarqueeProps {
  style: ViewStyle,
  userName: string,
  amountData: number
}

export default memo(({ style, userName, amountData }: KokoMarqueeProps) => {
  return (
    <LinearGradient colors={['#0038F5', '#9F03FF']} start={{ x: 0.4, y: 0 }} end={{ x: 0.9, y: 1 }} style={[defStyle.container, style]}>
      <AutoScroll>
        <Text style={defStyle.text}>おめでとうございます! {userName}さん<Text style={defStyle.number}>{amountData?.toLocaleString()}ココ</Text>獲得! おめでとうございます!</Text>
      </AutoScroll>
    </LinearGradient>
  );
});

const defStyle = StyleSheet.create({
  container: {
    height: hScaleRatio(33),
    backgroundColor: colors.background,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: wScale(10)
  },
  text: {
    fontSize: 10,
    color: colors.white
  },
  number: {
    fontSize: 10,
    color: colors.yellow,
    fontWeight: "bold"
  }
});
