import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, Text, Image, View, ViewStyle, GestureResponderEvent } from "react-native";
import colors from "../theme/colors";
import { hScaleRatio, wScale } from "../utils/scailing";
import shadows from "../theme/shadows";
import Copy from "../../assets/images/copy.svg";
import { useTranslation } from "react-i18next";
import "../utils/i18n";
import { GAME_LINK } from "../consts/config";
import SponsorImage from '../../assets/images/sponsor.png';

interface SponsorProps {
  style: ViewStyle
  onPress: (event: GestureResponderEvent) => void
  onCopyLink: (event: GestureResponderEvent) => void
}

export default memo(({ style, onPress, onCopyLink }: SponsorProps) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={[defStyle.container, style]} onPress={onPress}>
      <Image style={defStyle.image} source={SponsorImage} />
      <Text style={defStyle.support}>Supported By Cloud7</Text>
      <View style={defStyle.subContainer}>
        <View>
          <Text style={defStyle.kokoText}>{t('sponsor.more_info')}</Text>
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
    alignSelf: 'center',
    ...shadows.default
  },
  image: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  support: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 14,
    fontFamily: "Noto Sans",
    paddingHorizontal: wScale(10)
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: hScaleRatio(10),
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
