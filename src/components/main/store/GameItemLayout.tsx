import React, { memo, useState, useEffect } from "react";
import { GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, width, wScale } from "../../../utils/scailing";
import shadows from "../../../theme/shadows";
import { useTranslation } from "react-i18next";
import "../../../utils/i18n";
import Dollar from "../../../../assets/images/dollar.svg";

interface GameItemLayoutProps {
  style?: ViewStyle
  onPress: (event: GestureResponderEvent) => void
  itemInfo: GameItemDataType
  purchased?: boolean
  bean?: boolean
}

export default memo(({ style, onPress, itemInfo, purchased = false, bean = false }: GameItemLayoutProps) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={[bean == true ? { opacity: 0.2 } : { opacity: 1 }, defStyle.container, style]} onPress={onPress}>
      <Image style={defStyle.image} source={{ uri: itemInfo.pictureUrl }} />
      {purchased === false ?
        <View style={{ flexDirection: 'row', marginTop: hScaleRatio(20) }}>
          <Dollar width={20} height={20} />
          <Text style={defStyle.text}>
            {itemInfo.kokoPrice}
          </Text>
        </View>
        :
        <Text style={defStyle.purchasedText}>購入済み</Text>
      }
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  container: {
    width: (width - wScale(42) * 2) / 3,
    height: hScaleRatio(140),
    alignItems: "center",
    paddingHorizontal: wScale(11),
    paddingVertical: hScaleRatio(10),
    backgroundColor: colors.onBg,
    borderRadius: 10,
    marginHorizontal: 9,
    ...shadows.default,
  },
  image: {
    width: wScale(47),
    height: hScaleRatio(80),
  },
  text: {
    fontFamily: "Noto Sans",
    fontSize: 20,
    fontWeight: '900',
    color: colors.yellow,
    lineHeight: 22,
    marginLeft: wScale(4),
  },
  purchasedText: {
    fontFamily: "Noto Sans",
    fontSize: 15,
    fontWeight: '700',
    color: colors.onPurchasedText,
    lineHeight: 18,
    marginTop: hScaleRatio(20)
  }
});
