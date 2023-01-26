import "react-native-get-random-values";
import React, { useEffect, useState } from 'react';
import { Text, View, NativeModules, Platform, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styles from "./styles";
import Logo from "../../../../assets/images/logo.svg";
import SocialLoginPrimary from "../../../components/auth/SocialLoginPrimary";
import SocialLoginSecondary from "../../../components/auth/SocialLoginSecondary";
import BackButton from "../../../components/BackButton";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-community/google-signin';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import * as authActions from '../../../redux/actions/authActions';
import { LoginType } from '../../../consts/authConfig';
import { errorMessage } from '../../../utils/alerts';
import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
const { RNTwitterSignIn } = NativeModules;
import { stringify, v4 as uuid } from 'uuid';
import "../../../utils/i18n";
import { useTranslation } from "react-i18next";
import HelpScreen from "../HelpScreen";
import {isFirstLaunch} from "../../../redux/utils/localDataManager"

const HtmlText = (props: { navigation?: any, text: string, args: { [key: string]: string } }) => {
  const { t } = useTranslation();
  const [texts, setTexts] = React.useState<Array<{ text: string, bold: boolean }>>([]);

  React.useEffect(() => {
    setTexts(props.text.split(/(\{\{[^}]*\}\})/g).map(i => {
      if (i[0] === '{' && i[i.length - 1] === '}' && props.args[i.slice(2, -2)]) {
        return { text: props.args[i.slice(2, -2)], bold: true }
      }
      return { text: i, bold: false }
    }));
    console.log(texts);
  }, [props.text])

  const onPressPrivacy = () => {
    props.navigation.navigate('HelpScreen', { privacy: true });
  };

  const onPressTerms = () => {
    props.navigation.navigate('HelpScreen', { privacy: false });
  };

  return (
    <Text style={styles.htmlText}>
      {texts.map((i, k) => (
        i.bold ?
          <TouchableOpacity onPress={i.text == t("auth.privacy") ? onPressPrivacy : onPressTerms}>
            <Text key={k} style={styles.linker}>{i.text}</Text>
          </TouchableOpacity>
          :
          <View>
            <Text key={k} style={styles.footer}>{i.text}</Text>
          </View>
      ))}
    </Text>
  )

}


const LoginScreen = (props: { navigation?:any; authActions: { signIn: (arg0: { params: { idToken: any; anonymousToken: string; type: { name: string; url: string; }; } | { idToken: string; anonymousToken: string | null; type: { name: string; url: string; }; } | { idToken: string; anonymousToken: any; type: { name: string; url: string; }; }; onSuccess: (response: any) => void; onFail: (error: any) => void; }) => void; }; }) => {

  const { t } = useTranslation();

  GoogleSignin.configure({
    webClientId: '124310744417-1bfi3vm4kaidqi57gffbjik9m29dr7le.apps.googleusercontent.com',
  });

  const TwitterKeys = {
    TWITTER_COMSUMER_KEY: 'pPyy0Ui3yehqeYaaz3tYjICrl',
    TWITTER_CONSUMER_SECRET: 'enbIUT1yIgpXbX3GX1GtTJWTXZyp1flS4JcWDcEw7F8nluvQMO',
  };

  const [user, setUser] = useState();
  let authType = LoginType.Google;
  let anonymousToken: string | undefined | null = "";
  const [firebaseIdToken, setFirebaseIdToken] = useState('');

  useEffect(() => {
     return auth().onAuthStateChanged(onAuthStateChanged);
  }, []);

  const onBackPress = () => {
    props.navigation.goBack();
  }

  const onAuthStateChanged = (authUser: any) => {
    console.log("here")
    console.log("[onAuthStateChanged]", authUser);
    if (authUser !== null) {
      setUser(authUser);
      authUser.getIdToken(true).then((idToken: string) => {
        setFirebaseIdToken(idToken);
        if (idToken) {
          props.authActions.signIn({
            params: { idToken: idToken, anonymousToken: "", type: authType },
            onSuccess: onLoginSuccess,
            onFail: onLoginFailed
          });
        }
      });
    }
  };

  const onApplePress = async () => {
    authType = LoginType.Apple;
    if (Platform.OS === 'ios') {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      if (!appleAuthRequestResponse.identityToken) {
        return;
      }

      const { identityToken, nonce } = appleAuthRequestResponse;
      anonymousToken = "";
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      await auth().signInWithCredential(appleCredential);
    } else {
      const rawNonce = uuid();
      const state = uuid();
      appleAuthAndroid.configure({
        clientId: 'club.kokonats.koko.common',
        redirectUri: 'https://kokonats-dev-42730.firebaseapp.com/__/auth/handler',
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
        nonce: rawNonce,
        state,
      });
      const response = await appleAuthAndroid.signIn();
      console.log("[AppleAuthAndroid]", response);
      const { id_token, nonce } = response;
      if (id_token) {
        anonymousToken = "";
        const appleCredential = auth.AppleAuthProvider.credential(id_token, rawNonce);
        await auth().signInWithCredential(appleCredential);
      } else {
        errorMessage({ message: "Failed login" });
      }
    }
  }

  const onGooglePress = async () => {
    const isSigned = await GoogleSignin.isSignedIn();
    if (isSigned) {
      await GoogleSignin.signOut();
    }
    authType = LoginType.Google;
    const { idToken } = await GoogleSignin.signIn();
    anonymousToken = idToken;
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    await auth().signInWithCredential(googleCredential);
  }

  const onTwitterPress = async () => {
    authType = LoginType.Twitter;
    RNTwitterSignIn.init(
      TwitterKeys.TWITTER_COMSUMER_KEY,
      TwitterKeys.TWITTER_CONSUMER_SECRET,
    ).then(() =>
      console.log('Twitter SDK initialized'),
    );

    const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn();
    anonymousToken = "";
    if (user) {
      props.authActions.signIn({
        params: { idToken: firebaseIdToken, anonymousToken: authToken, type: authType },
        onSuccess: onLoginSuccess,
        onFail: onLoginFailed
      });
    } else {
      const twitterCredential = auth.TwitterAuthProvider.credential(authToken, authTokenSecret);
      await auth().signInWithCredential(twitterCredential);
    }
  }

  const onLoginSuccess = (response: any) => {
    console.log("login success")
    isFirstLaunch().then(value => {
      if(value){
        console.log("true value",value)
      props.navigation.navigate('ProfileEditScreen');}
      else{
        console.log("false value",value)
      props.navigation.goBack();}
    })
  };

  const onLoginFailed = (error: { errorMessage: any; }) => {
    console.log("login failed")
    errorMessage({ message: error.errorMessage });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <BackButton onPress={onBackPress} />
      </View>
      <View style={{ flex: 2 }} />
      <Logo width={88} height={90} />
      <Text style={styles.title}>アカウント作成</Text>
      <SocialLoginPrimary onPress={onApplePress} />
      <View style={styles.secondary}>
        <SocialLoginSecondary type={LoginType.Google} style={{ marginRight: 24 }} onPress={onGooglePress} />
        <SocialLoginSecondary type={LoginType.Twitter} onPress={onTwitterPress} />
      </View>
      <View style={{ flex: 3 }} />
      <HtmlText text={t("auth.text")} args={{ privacy: t("auth.privacy"), terms: t("auth.terms") }} navigation={props.navigation} />
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    authActions: bindActionCreators(authActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
