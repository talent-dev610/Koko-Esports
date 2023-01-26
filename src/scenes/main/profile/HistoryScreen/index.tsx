import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import "../../../../utils/i18n";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../components/BackButton";
import DropDownButton from "../../../../components/main/profile/DropDownButton";
import Dollar from "../../../../../assets/images/dollar.svg";
import HistoryItem from "../../../../components/main/profile/HistoryItem";
import { getUserInfo, getCoinBalance, getUserTnmtHistory, getHistoryTags } from "../../../../redux/selectors";
import * as reduxGameActions from "../../../../redux/actions/gameActions"
import { convertNumberString } from "../../../../utils/stringUtils";

interface HistoryScreenProps {
  navigation?: any
  userHistory: any[]
  gameActions: any
}

const HistoryScreen = ({navigation, userHistory, gameActions}: HistoryScreenProps) => {
  const { t } = useTranslation();
  const [rankings, setRankings] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState(userHistory);
  const historyRef = useRef<FlatList>(null);

  useEffect(() => {
    historyRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [filteredHistory]);

  const data = getHistoryTags(userHistory);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onDropDownPress = (params: string) => {
    const tnmtHistory = userHistory;
    if (params == "1") {
      setFilteredHistory(tnmtHistory);
    }
    else {
      setFilteredHistory(tnmtHistory.filter(item => item.tournamentName === data[Number(params) - 1]?.label));
    }
  }

  const getTotalAmount = () => {
    var totalAmount = 0;
    userHistory.map((item) => totalAmount += item.kokoAmount)
    return totalAmount
  }

  const onPlayAgain = () => {
    navigation.goBack()
  }

  const onRankingFetched = (data: any) => {
    navigation.navigate("GameResultScreen", {
      result: data,
      onPlayAgain: onPlayAgain
    });
  };

  const onRankingFailed = (error: any) => {
  };

  const onHistoryItemPress = (tournamentId: any) => {
    /*gameActions.fetchTournamentRanking(
      tournamentId,
      (data: any) => onRankingFetched(data),
      (error: any) => onRankingFailed(error));*/
  };

  const renderHistoryItem = (item: any) => {
    return (<HistoryItem style={styles.historyItem} history={item.item} onPress={() => onHistoryItemPress(item.item.tournamentId)} />);
  };

  const renderSeparator = () => {
    return <View style={{height: 15}}/>;
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={onBackPress} style={styles.backButton} />
      <Text style={styles.title}>{t("profile.tournament_history")}</Text>
      <View style={styles.filterContainer}>
        <DropDownButton onPress={onDropDownPress} data={data} />
        <View style={styles.totalContainer}>
          <Text style={styles.text}>合計</Text>
          <View style={styles.totalValueContainer}>
            <Dollar width={18} height={18} />
            <Text style={styles.dollarText}>{"+" + convertNumberString(String(getTotalAmount()))}</Text>
          </View>
        </View>
      </View>
      <FlatList
        ref={historyRef}
        style={styles.historyContainer}
        data={filteredHistory}
        renderItem={renderHistoryItem}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{alignItems: "center", paddingBottom: 20}}
      />
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    coin: getCoinBalance(state),
    userInfo: getUserInfo(state),
    userHistory: getUserTnmtHistory(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    gameActions: bindActionCreators(reduxGameActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen);
