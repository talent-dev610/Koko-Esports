import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import reducers from "./redux/reducers";
import creatSagaMiddleware from "redux-saga";
import sagas from "./redux/sagas";
import KokoNavigation from "./navigations";
import { withIAPContext } from "react-native-iap";
import messaging from "@react-native-firebase/messaging";
import { fcmService } from "./notification/FCMService";
import { localNotificationService } from "./notification/LocalNotificationService";
import i18n from './utils/i18n'
import { NativeModules, PushNotification } from "react-native";

const sagaMiddleware = creatSagaMiddleware();
let store = createStore(reducers, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(sagas);

const App = () => {

  useEffect(() => {
    setLanguage();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);
  }, []);

  const setLanguage = () => {
    let locale: string = 'en';
    if (
      NativeModules.SettingsManager &&
      NativeModules.SettingsManager.settings &&
      NativeModules.SettingsManager.settings.AppleLanguages
    ) {
      locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else if (NativeModules.I18nManager) {
      locale = NativeModules.I18nManager.localeIdentifier;
    }

    if (typeof locale === 'undefined') {
      locale = 'en';
    }
    if (locale.includes('ja')) {
      i18n.changeLanguage('ja');
    } else {
      i18n.changeLanguage('en');
    }
  };

  const onRegister = (token: string) => {
    console.log("[App] Token", token);
  }

  const onNotification = (notify: any) => {
    console.log("[App] onNotification", notify);
    const options = {
      soundName: 'default',
      playSound: true,
      largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
      smallIcon: "ic_launcher", // (optional) default:  "ic_notification" with fallback for "ic_launcher"
    }

    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify,
      options,
    )
  }

  const onOpenNotification = async (notify: any) => {
    console.log('notify', notify);
  }

  return (
    <Provider store={store}>
      <KokoNavigation />
    </Provider>
  );
};

export default withIAPContext(App);
