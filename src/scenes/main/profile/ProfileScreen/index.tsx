import React, { useState, useEffect } from "react";
import { bindActionCreators } from "redux"
import { Linking, ScrollView, Text, View } from "react-native";

import { connect } from "react-redux";
import styles from "./styles";
import { useTranslation } from 'react-i18next';
import '../../../../utils/i18n';
import { GO_TO_HOME, GO_TO_STORE } from "../../../../events/types";
import CoinPanel from "../../../../components/main/CoinPanel";
import EnergyPanel from "../../../../components/main/EnergyPanel";
import HistoryItem from "../../../../components/main/profile/HistoryItem";
import InfoButton from "../../../../components/main/profile/InfoButton";
import LogoutButton from "../../../../components/LogoutButton";
import SettingButton from "../../../../components/SettingButton";
import { getEnergyBalance, getCoinBalance, getUserInfo, getUserTnmtHistory } from "../../../../redux/selectors";
import UserAvatar from "../../../../components/main/profile/UserAvatar";
import * as reduxAuthActions from "../../../../redux/actions/authActions";
import auth from "@react-native-firebase/auth";
import { ConfirmDialogType, SPONSOR_LINK, SUPPORT_LINK } from "../../../../consts/config";
import KokoConfirmDialog from "../../../../components/KokoConfirmDialog";
import { errorMessage } from "../../../../utils/alerts";
import EventBus from 'react-native-event-bus'

interface ProfileScreenProps {
  navigation?: any
  authActions: any
  userInfo: any
  userHistory: any[]
  coin: any
  energy: any
}

const ProfileScreen = ({ navigation, authActions, userInfo, userHistory, coin, energy }: ProfileScreenProps) => {
  const { t } = useTranslation();
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showSuspendErrorDialog, setShowSuspendErrorDialog] = useState(false);

  const onEnergyPress = () => {
    EventBus.getInstance().fireEvent(GO_TO_STORE);
  };

  const onLogoutPress = async () => {
    await auth().signOut();
    authActions.signOut({ onSuccess: onLogoutSuccess, onFail: onLogoutFail });
  };

  const onLogoutSuccess = () => {
    EventBus.getInstance().fireEvent(GO_TO_HOME);
  };

  const onLogoutFail = () => {

  };

  const onSettingPress = () => {
    navigation.navigate('ProfileEditScreen');
  };

  const onMoreDetail = () => {
    navigation.navigate('HistoryScreen');
  };

  const onWhenTrouble = async () => {
    await Linking.canOpenURL(SUPPORT_LINK);
    Linking.openURL(SUPPORT_LINK);
  };

  const onBlockList = () => {
    navigation.navigate('BlockListScreen');
  };

  const onCoinPress = () => {
    //EventBus.getInstance().fireEvent(GO_TO_STORE)
  };

  const onSuspend = () => {
    setShowSuspendDialog(true);
  };

  const onOkSuspend = () => {
    setShowSuspendDialog(false);
    authActions.suspendAccount({
      onSuccess: onSuspendSuccess,
      onFail: onSuspendFail
    });
  };

  const onCancelSuspend = () => {
    setShowSuspendDialog(false);
  };

  const onSuspendSuccess = () => {
    onLogoutPress();
  };

  const onSuspendFail = () => {
    setShowSuspendErrorDialog(false);
  };

 const onBackErrorDialog = () => {
    setShowSuspendErrorDialog(false);
  };

  return (
    <ScrollView style={styles.container}>
      <LogoutButton onPress={onLogoutPress} style={styles.logout} />
      <View style={styles.contentContainer}>
        <View style={styles.avatar} >
          {
            userInfo.picture && <UserAvatar avatar={userInfo.picture} activeOpacity={1} selected={true} />
          }
          <SettingButton onPress={onSettingPress} style={styles.setting} />
        </View>
        <Text style={styles.uid}>UID: {userInfo.id}</Text>
        <Text style={styles.name}> {userInfo.userName}</Text>
        <CoinPanel style={styles.coinPanel} balance={coin} onPress={onCoinPress} />
        <EnergyPanel style={styles.energyPanel} balance={energy} onPress={onEnergyPress} />
        <Text style={styles.history}>{t("profile.tournament_history_1")}</Text>
        {userHistory && userHistory.map((tnmtHistory, index) =>
          index < 3 ? (<HistoryItem style={styles.historyItem} history={tnmtHistory} />) : null)}
        <InfoButton style={styles.infoButton} text={t('profile.see_more')} onPress={onMoreDetail} />
        <InfoButton style={styles.infoButton} text={t('profile.click_here_trouble')} onPress={onWhenTrouble} />
        <InfoButton style={styles.infoButton} text={t('profile.blockList')} onPress={onBlockList} />
        <InfoButton style={styles.infoButton} text={t('profile.suspend')} onPress={onSuspend} />
      </View>
      <KokoConfirmDialog
        visible={showSuspendDialog}
        type={ConfirmDialogType.question}
        title={t("profile.suspend")}
        message={t("profile.suspend_confirm")}
        onCancel={onCancelSuspend}
        onOk={onOkSuspend} />
      <KokoConfirmDialog
        visible={showSuspendErrorDialog}
        type={ConfirmDialogType.close}
        title={t('dialog.error')}
        message={"Failed to suspend your account."}
        onCancel={onBackErrorDialog}
        onOk={onBackErrorDialog}
      />
    </ScrollView>
  );
};

const mapStateToProps = (state: any) => {
  return {
    energy: getEnergyBalance(state),
    coin: getCoinBalance(state),
    userInfo: getUserInfo(state),
    userHistory: getUserTnmtHistory(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    authActions: bindActionCreators(reduxAuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
