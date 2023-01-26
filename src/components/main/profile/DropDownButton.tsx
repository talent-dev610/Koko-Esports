import React, { memo, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, wScale } from "../../../utils/scailing";
import { Dropdown } from 'react-native-element-dropdown';

interface DropDownButtonProps {
  data: HistoryDropdownDataType[]
  onPress: (value: string) => void
}

export default memo(({ onPress, data }: DropDownButtonProps) => {
  const [value, setValue] = useState("1");

  useEffect(() => {
    onPress(value);
  }, [value]);

  const renderItem = (item: HistoryDropdownDataType) => {
    return (
      <View style={defStyle.item} >
        <Text style={defStyle.text} numberOfLines={1} ellipsizeMode={"tail"}>{item.label}</Text>
      </View>
    )
  };

  return (
    <Dropdown
      statusBarIsTranslucent={true}
      style={defStyle.dropdown}
      containerStyle={defStyle.containerStyle}
      data={data}
      labelField="label"
      valueField="value"
      maxHeight={hScaleRatio(400)}
      placeholderStyle={defStyle.placeholderStyle}
      selectedTextStyle={defStyle.selectedTextStyle}
      selectedTextProps={{numberOfLines: 1, ellipsizeMode: "tail"}}
      value={value}
      placeholder={"All"}
      onChange={item => {
        setValue(item.value);
      }}
      renderItem={renderItem}
    />
  );
});

const defStyle = StyleSheet.create({
  text: {
    fontFamily: "Noto Sans",
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
  },
  dropdown: {
    backgroundColor: 'transparent',
    borderRadius: wScale(16),
    borderColor: colors.loginColor,
    borderWidth: 1,
    width: wScale(132),
    height: hScaleRatio(56),
    paddingHorizontal: 10,
    marginLeft: wScale(59),
    alignItems: "center",
    justifyContent: "center"
  },
  containerStyle: {
    backgroundColor: colors.background,
    borderColor: colors.onBg,
  },
  textItem: {
    fontFamily: "Noto Sans",
    fontSize: 12,
    textAlign: 'center'
  },
  item: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.onBg,
    height: hScaleRatio(40),
    paddingHorizontal: wScale(6)
  },
  selectedTextStyle: {
    color: colors.white,
    fontSize: 12,
    textAlign: "center",
  },
  placeholderStyle: {
    color: colors.white,
    fontSize: 12,
    textAlign: "center",
  }
});
