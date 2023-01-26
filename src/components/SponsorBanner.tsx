import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, Text, Image, ViewStyle, GestureResponderEvent } from "react-native";
import colors from "../theme/colors";
import { hScaleRatio, wScale } from "../utils/scailing";
import SponsorBannerImage from "../../assets/images/sponsor_banner.png";

interface SponsorBannerProps {
  style: ViewStyle
  onPress: (event: GestureResponderEvent) => void
}

export default memo(({ style, onPress }: SponsorBannerProps) => {
  return (
    <TouchableOpacity style={[defStyle.container, style]} onPress={onPress}>
      <Image style={defStyle.image} source={SponsorBannerImage} />
      <Text style={defStyle.text}>Supported By Cloud7</Text>
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  container: {
    borderRadius: wScale(10),
    width: wScale(297),
    height: hScaleRatio(60),
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  text:{
    fontFamily: "Noto Sans",
    fontSize: 14,
    textAlign: 'center',
    color: colors.black,
    backgroundColor: colors.white,
    paddingHorizontal: wScale(10),
    paddingVertical: hScaleRatio(5),
    lineHeight: 16
  }
});
