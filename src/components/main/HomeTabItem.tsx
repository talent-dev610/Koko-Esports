import React, { memo } from "react";
import { StyleSheet, Image, TouchableOpacity, ImageSourcePropType, GestureResponderEvent } from "react-native";
import colors from "../../theme/colors";
import { hScaleRatio, wScale } from "../../utils/scailing";

interface HomeTabItemProps {
  image: ImageSourcePropType
  isSelected: boolean
  onPress: (event: GestureResponderEvent) => void
}

export default memo(({ image, isSelected, onPress }: HomeTabItemProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={[defStyle.image, {tintColor: isSelected ? colors.white : colors.unselectedItemColor}]}
        source={image}
      />
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  image: {
    height: wScale(24),
    width: hScaleRatio(24),
    margin: wScale(16),
  },
});
