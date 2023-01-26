import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, Text, Image, View, GestureResponderEvent } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, wScale } from "../../../utils/scailing";
import shadows from "../../../theme/shadows";
import Copy from "../../../../assets/images/copy.svg";
import { GAME_LINK } from "../../../consts/config";
import { ViewStyle } from "react-native";
import StoreEnergyBg from "../../../../assets/images/store_energy_bg.png";

interface StoreEnergyAndroidCardProps {
  style: ViewStyle
  onPress: (event: GestureResponderEvent) => void
  onCopyLink: (event: GestureResponderEvent) => void
}

export default memo(({ style, onPress, onCopyLink }: StoreEnergyAndroidCardProps) => {
  return (
    <TouchableOpacity style={[defStyle.container, style]} onPress={onPress}>
      <Image style={defStyle.image} source={StoreEnergyBg} />
      <View style={defStyle.subContainer}>
        <View>
          <Text style={defStyle.kokoText}>KOKO GAMES</Text>
          <Text style={defStyle.link}>{GAME_LINK}</Text>
        </View>
        <View style={{flex: 1}}/>
        <TouchableOpacity style={defStyle.copyContainer} onPress={onCopyLink}>
          <Copy width={30} height={30}/>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  container: {
    width: wScale(295),
    height: hScaleRatio(200),
    borderRadius: wScale(10),
    backgroundColor: colors.onBg,
    ...shadows.default
  },
  image: {
    width: '100%',
    borderRadius: 10
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: -hScaleRatio(20),
    marginHorizontal: wScale(20),
    alignItems: 'center'
  },
  kokoText: {
    fontFamily: "Noto Sans",
    fontSize: 14,
    color: colors.textGray
  },
  link: {
    fontFamily: "Noto Sans",
    fontSize: 14,
    color: colors.white
  },
  copyContainer: {
    width: wScale(40),
    height: hScaleRatio(40),
    borderRadius: wScale(20),
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
