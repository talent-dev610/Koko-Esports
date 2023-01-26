import { StyleSheet } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, wScale } from "../../../utils/scailing";
import dimensions from "../../../theme/dimensions";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  backButton: {
    marginTop: dimensions.paddingTop,
    width: '100%',
    paddingLeft: wScale(24)
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontFamily: "Noto Sans",
    marginVertical: hScaleRatio(30)
  },
  secondary: {
    flexDirection: 'row',
    marginTop: hScaleRatio(30)
  },
  footer: {
    fontSize: 11,
    color: colors.textGray,
    textAlign: 'center'
  },
  linker: {
    fontSize: 11,
    color: colors.white,
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  htmlText: {
    marginBottom: hScaleRatio(50),
  }
});

export default styles;
