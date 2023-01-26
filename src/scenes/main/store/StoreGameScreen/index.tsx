import React, { useState, useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import { useTranslation } from "react-i18next";
import "../../../../utils/i18n";
import BackButton from "../../../../components/BackButton";
import { getCoinBalance, getPurchasedItems } from "../../../../redux/selectors";
import CoinPanel from "../../../../components/main/CoinPanel";
import GameItemLayout from "../../../../components/main/store/GameItemLayout";
import { getGameItemsList } from "../../../../redux/selectors";
import * as reduxStoreActions from "../../../../redux/actions/storeActions"
import KokoStatusBar from "../../../../components/KokoStatusBar";
import { errorMessage, successMessage } from "../../../../utils/alerts";
import KokoConfirmDialog from "../../../../components/KokoConfirmDialog"
import {ConfirmDialogType} from '../../../../consts/config';
interface StoreGameScreenProps {
  purchasedItems: any,
  navigation?: any
  coin: any
  items: any[]
  storeActions: any
}

const StoreGameScreen = ({navigation, coin, items, storeActions,purchasedItems}: StoreGameScreenProps) => {
  const { t } = useTranslation();
  const { game } = navigation.state.params;
  const [showBalanceErrorDialog, setShowBalanceErrorDialog] = useState(false);
  const [showPurchaseErrorDialog, setShowPurchaseErrorDialog] = useState(false);
  const [showPurchasedDialog, setShowPurchasedDialog] = useState(false);

  const onBackPress = () => {
    navigation.goBack();
  };

  const renderSeparator = () => {
    return (
      <View style={{ width: 18, height: 18 }} />
    );
  };

  const purchaseItem = (params: any) => {
    console.log('[Params]', params);
    if (params.kokoPrice > coin) {
      setShowBalanceErrorDialog(true);
    } else {
      storeActions.purchaseItems({
        params: {
          gameItemId: params.id,
        },
        onSuccess: onPurchaseSuccess,
        onFail: onPurchaseFail
      });
    }
  }

  const purchasedItem = () => {
    setShowPurchasedDialog(true);
  }

  const refreshBalance = () =>{
    storeActions.fetchCoin();
    storeActions.fetchEnergy();
  }


  const onPurchaseSuccess = () => {
    refreshBalance();
    successMessage({message: "Item purchased"});
    
  }

  const onPurchaseFail = (params: any) => {
    setShowPurchaseErrorDialog(true);
  }


  const onBackErrorDialog = () => {
    setShowBalanceErrorDialog(false);
    setShowPurchaseErrorDialog(false);
    setShowPurchasedDialog(false);
  };
  return (
    <View style={styles.container}>
      <KokoStatusBar />
      <View style={styles.titleBar}>
        <BackButton onPress={onBackPress} />
        <Text style={styles.title}>{t("store.items")}</Text>
      </View>
      <CoinPanel balance={coin} style={styles.coin} />
      <View style={styles.gameContainer}>
        <Image
          style={styles.gameImage}
          source={{ uri: game.coverImageUrl }} />
        <Text
          style={styles.gameTitle}
          numberOfLines={2}
          ellipsizeMode="tail">
          {game.name.length < 80 ? game.name : `${game.name.substring(0, 32)}...`}
        </Text>
      </View>
      {
        items && items.length > 0 && <FlatList
          style={{ marginTop: 30, marginLeft: -9 }}
          data={items}
          renderItem={({ item }) => {
            var isPurchased  = false;
            var isCanPurchase = true;

            purchasedItems.map((pItem:any ) => {
              item.gamdId == pItem.gamdId && item.id == pItem.gameItemId ? isPurchased = true : null
            })
            item.kokoPrice > coin ?isCanPurchase=false: isCanPurchase = true
            return(
              isPurchased ?
              <GameItemLayout itemInfo={item} onPress={() => {purchasedItem()}} purchased={true} bean={isPurchased ||!isCanPurchase }/>
              :
              <GameItemLayout itemInfo={item} onPress={() => purchaseItem(item)} purchased={false} bean={!isCanPurchase}/>
            )
          }}
          numColumns={3}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={renderSeparator}
        />
      }
      {
        (!items || items.length === 0) && <Text style={styles.comingSoon}>COMING SOON</Text>
      }
      <KokoConfirmDialog
        visible={showBalanceErrorDialog}
        type={ConfirmDialogType.close}
        title={t('dialog.error')}
        message={"Influence balance."}
        onCancel={onBackErrorDialog}
        onOk={onBackErrorDialog}
      />
      <KokoConfirmDialog
        visible={showPurchasedDialog}
        type={ConfirmDialogType.close}
        title={t('dialog.error')}
        message={"Purchased Item."}
        onCancel={onBackErrorDialog}
        onOk={onBackErrorDialog}
      />
      <KokoConfirmDialog
        visible={showPurchaseErrorDialog}
        type={ConfirmDialogType.close}
        title={t('dialog.error')}
        message={"Item purchase failed"}
        onCancel={onBackErrorDialog}
        onOk={onBackErrorDialog}
      />
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    coin: getCoinBalance(state),
    items: getGameItemsList(state),
    purchasedItems: getPurchasedItems(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeActions: bindActionCreators(reduxStoreActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreGameScreen);
