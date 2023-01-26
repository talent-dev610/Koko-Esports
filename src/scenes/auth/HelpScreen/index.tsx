import "react-native-get-random-values";
import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import styles from "./styles";
import "../../../utils/i18n";
import { useTranslation } from "react-i18next";
import { WebView } from "react-native-webview"
import BackButton from "../../../components/BackButton";
import { PRICACY, TERMS } from "../../../consts/config";


const HelpScreen = (props: { navigation?: any }) => {
  const { privacy } = props.navigation.state.params;

  const { t } = useTranslation();

  const onBackPress = () => {
    props.navigation.goBack();
    console.log(privacy);
  }

  return (
    privacy === true ?
      <View style={styles.container}>
        <View style={styles.backButton}>
          <BackButton onPress={onBackPress} />
          <Text style={styles.title}>{t("auth.privacy")}</Text>
        </View>
        <WebView
          source={{ uri: PRICACY }}
          style={styles.webView} />
      </View>
      :
      <View style={styles.container}>
        <View style={styles.backButton}>
          <BackButton onPress={onBackPress} />
          <Text style={styles.title}>{t("auth.terms")}</Text>
        </View>
        <WebView
          source={{ uri: TERMS }}
          style={styles.webView} />
      </View>
  );
};

const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HelpScreen);
