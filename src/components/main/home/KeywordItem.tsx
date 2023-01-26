import React, { memo } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, wScale } from "../../../utils/scailing";
import { Chip } from 'react-native-paper';

interface KeywordItemProps {
  style?:      ViewStyle
  keyword:    string
}

export default memo(({ style, keyword}: KeywordItemProps) => {

  return (
    <View style={[defStyle.container, style]}><Text style={defStyle.text}>{keyword}</Text></View>
  );
});

const defStyle = StyleSheet.create({
  container: {
    height: hScaleRatio(20),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wScale(8),
    paddingVertical: hScaleRatio(2),
    backgroundColor: colors.keywordBg,
    borderRadius: 10,
    marginRight: wScale(10),
  },
  text: {
    fontFamily: "Noto Sans",
    fontSize: 12,
    color: colors.green,
    lineHeight: 14,
    alignSelf: 'center'
  }
});
