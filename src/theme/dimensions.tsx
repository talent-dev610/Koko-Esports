import { hScaleRatio, wScale } from "../utils/scailing";
import { Platform, StatusBar } from "react-native";

const dimensions = {
  statusBarHeight:
    Platform.OS === 'ios'
      ? 20
      : StatusBar.currentHeight
        ? StatusBar.currentHeight
        : 0,
  paddingTop: hScaleRatio(56),
  paddingHPrimary: wScale(24),
  paddingHSecondary: wScale(52),
};

export default dimensions;
