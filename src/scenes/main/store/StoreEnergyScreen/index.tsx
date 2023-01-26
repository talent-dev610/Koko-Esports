import React, { useState, useEffect } from "react";
import { Text, View, Platform, FlatList, Linking } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import BackButton from "../../../../components/BackButton";
import { useTranslation } from "react-i18next";
import "../../../../utils/i18n";
import { getEnergyBalance } from "../../../../redux/selectors";
import StoreEnergyStatus from "../../../../components/main/store/StoreEnergyStatus";
import StoreEnergyAndroidCard from "../../../../components/main/store/StoreEnergyAndroidCard";
import EnergyItemLayout from "../../../../components/main/store/EnergyItemLayout";
import Clipboard from "@react-native-clipboard/clipboard";
import { GAME_LINK } from "../../../../consts/config";
import KokoStatusBar from "../../../../components/KokoStatusBar";
import { ENERGY_IOS } from "../../../../consts/storeConfig";
import {requestPurchase, requestSubscription, useIAP} from 'react-native-iap';
import { Purchase } from "react-native-iap";
import * as reduxStoreActions from "../../../../redux/actions/storeActions";

interface StoreEnergyScreenProps {
  navigation?: any
  storeActions: any
  energy: any
}

const StoreEnergyScreen = ({navigation, storeActions, energy}: StoreEnergyScreenProps) => {

  const { t } = useTranslation();
  const iapSkus = ENERGY_IOS.map(product => product.identifier);
  const {
    connected,
    products,
    subscriptions,
    getProducts,
    getSubscriptions,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();

  useEffect(() => {
    if (connected) {
      getProducts(iapSkus);
    }
  }, [connected, getProducts]);

  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
      if (purchase) {
        const receipt = purchase.transactionReceipt;
        if (receipt)
          try {
            const ackResult = await finishTransaction(purchase);
            console.log('ackResult', ackResult);
            storeActions.purchaseEnergy(receipt, purchase.transactionId);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderSeparator = () => {
    return (
      <View style={{ width: 18, height: 18 }} />
    );
  };

  const onPressAndroidCard = async () => {
    await Linking.canOpenURL(GAME_LINK);
    Linking.openURL(GAME_LINK);
  };

  const onCopyLink = () => {
    Clipboard.setString(GAME_LINK);
  };


  const purchaseEnergy = (product: any) => {
    requestPurchase(product.identifier);
  };

  return (
    <View style={styles.container}>
      <KokoStatusBar />
      <View style={styles.titleBar}>
        <BackButton onPress={onBackPress} />
        <Text style={styles.title}>{t("store.energy")}</Text>
      </View>
      <StoreEnergyStatus balance={energy} style={styles.energy} />
      {Platform.OS === 'android' ?
        <StoreEnergyAndroidCard style={styles.androidCard} onPress={onPressAndroidCard} onCopyLink={onCopyLink} />
        : <FlatList
          style={{ marginTop: 30, marginLeft: -9 }}
          data={ENERGY_IOS}
          renderItem={({ item }) => (
            <EnergyItemLayout product={item} onPress={() => purchaseEnergy(item)}/>
          )}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={renderSeparator}
        />
      }
    </View>

  );
};

const mapStateToProps = (state: any) => {
  return {
    energy: getEnergyBalance(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeActions: bindActionCreators(reduxStoreActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreEnergyScreen);
