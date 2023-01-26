import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, wScale } from "../../../utils/scailing";
import dimensions from "../../../theme/dimensions";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: 'column',
  },
  backButton: {
    marginTop: dimensions.paddingTop,
    flexDirection: 'row',
    width: '100%',
    paddingLeft: wScale(24)
  },
  title: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 41,
    fontFamily: "Noto Sans",
    marginLeft: wScale(10),
  },
  webView: {
    marginTop: dimensions.paddingTop,
    width: Dimensions.get('window').width
  }
});

export default styles;
