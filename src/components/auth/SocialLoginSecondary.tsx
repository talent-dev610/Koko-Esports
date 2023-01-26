import React, { memo } from "react";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import colors from "../../theme/colors";
import { hScaleRatio, wScale } from "../../utils/scailing";
import Google from "../../../assets/images/google.svg";
import Twitter from "../../../assets/images/twitter.svg";
import { LoginType } from "../../consts/authConfig";
import { SocialLoginType } from "../../@types/app";

interface SocialLoginSecondaryProps {
  style?: ViewStyle
  type: SocialLoginType
  onPress: (event: GestureResponderEvent) => void
}

export default memo(({ style, type, onPress }: SocialLoginSecondaryProps) => {
  return (
    <TouchableOpacity style={[defStyle.wrapper, style]} onPress={onPress}>
      {
        type === LoginType.Google && <Google width={18} height={18}/>
      }
      {
        type === LoginType.Twitter && <Twitter width={21} height={17}/>
      }
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.loginColor,
    borderRadius: wScale(34),
    width: wScale(68),
    height: hScaleRatio(68),
    alignItems: 'center',
    justifyContent: 'center'
  },
});
