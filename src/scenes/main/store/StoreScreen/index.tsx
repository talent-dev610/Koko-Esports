import React, { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../../../utils/i18n";
import styles from "./styles";
import KokoLogo from "../../../../components/main/KokoLogo";
import KokoMarquee from "../../../../components/main/KokoMarquee";
import EnergyDisplay from "../../../../components/main/EnergyDisplay";
import { getEnergyBalance, getGameList,getUserData } from "../../../../redux/selectors";
import StoreEnergyView from "../../../../components/main/store/StoreEnergyView";
import StoreGameItem from "../../../../components/main/store/StoreGameItem";
import * as reduxStoreActions from '../../../../redux/actions/storeActions';

interface StoreScreenProps {
  navigation?: any
  storeActions: any
  energy: any
  games: any[]
  userData: any
}


const StoreScreen = ({navigation, storeActions, energy, games,userData}: StoreScreenProps) => {
  const { t } = useTranslation();

  const onEnergyPress = () => {
    navigation.navigate('StoreEnergyScreen');
  };

  const renderGameItem = (game: any) => {
    return <StoreGameItem game={game.item} onPress={() => onGameItemPress(game.item)} />;
  };

  const onGetItemSuccess = () => {

  }
  const onGetItemFail = () => {

  }

  const onGameItemPress = (game: any) => {
    storeActions.getGameItems(
      game.id,
      onGetItemSuccess,
      onGetItemFail
    );
    navigation.navigate('StoreGameScreen', { game: game });
  };

  const renderGameItemSeparator = () => {
    return (
      <View style={styles.gameSeparator} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <KokoLogo />
        <View style={{ flex: 1 }} />
        <EnergyDisplay balance={energy}/>
      </View>
      <KokoMarquee style={styles.marquee}  userName={userData.username} amountData={userData.amountSum}/>
      <Text style={styles.title}>{t("store.energy")}</Text>
      <StoreEnergyView style={{ marginBottom: 16 }} onPress={onEnergyPress} />
      <Text style={styles.title}>{t("store.items")}</Text>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        ItemSeparatorComponent={renderGameItemSeparator}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false} />
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    energy: getEnergyBalance(state),
    games: getGameList(state),
    userData: getUserData(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeActions: bindActionCreators(reduxStoreActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreScreen);
