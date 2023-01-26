import React, { useState, useRef, useEffect } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { useTranslation } from 'react-i18next';
import '../../../../utils/i18n';
import styles from "./styles";
import KokoLogo from "../../../../components/main/KokoLogo";
import KokoMarquee from "../../../../components/main/KokoMarquee";
import EnergyDisplay from "../../../../components/main/EnergyDisplay";
import { GO_TO_STORE } from "../../../../events/types";
import {
  getEnergyBalance,
  getGameCategories,
  getGameList,
  getTournamentClasses,
  getTournamentTags,
  getUserData,
  getUserInfo,
} from "../../../../redux/selectors";
import TagItem from "../../../../components/main/home/TagItem";
import GameItem from "../../../../components/main/home/GameItem";
import TournamentItem from "../../../../components/main/home/TournamentItem";
import * as reduxGameActions from "../../../../redux/actions/gameActions";
import EventBus from 'react-native-event-bus'
import { useCardAnimation } from "react-navigation-stack";

interface HomeScreenProps {
  navigation?: any
  gameActions: any
  energy: any
  tournamentTags: any
  tournaments: any[]
  gameCategories: any[]
  games: any[]
  userData: any
}

const HomeScreen = ({ navigation, gameActions, energy, tournamentTags, tournaments, gameCategories, games, userData }: HomeScreenProps) => {
  const { t } = useTranslation();
  const tournamentRef = useRef<FlatList>(null)
  const gameRef = useRef<FlatList>(null);
  const [tag, setTag] = useState('_all_');
  const [category, setCategory] = useState('_all_');

  useEffect(() => {
    tournamentRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [tag]);

  useEffect(() => {
    gameRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [category]);

  const onEnergyPress = () => {
    EventBus.getInstance().fireEvent(GO_TO_STORE);
  };

  const renderTournamentTagItem = (item: any) => {
    return <TagItem tag={item.item} index={item.index} selected={tag === item.item} onPress={() => onTournamentTagItemPress(item.item)} />;
  }

  const onTournamentTagItemPress = (tag: any) => {
    setTag(tag);
  };

  const renderGameCategoryItem = (item: any) => {
    return <TagItem tag={item.item} index={item.index} selected={category === item.item} onPress={() => onGameCategoryItemPress(item.item)} />;
  }

  const onGameCategoryItemPress = (category: any) => {
    setCategory(category);
  }

  const renderSeparator = () => {
    return (
      <View style={styles.tagSeparator} />
    );
  };

  const renderTournamentItem = (item: any) => {
    return <TournamentItem tournament={item.item} index={item.index} onPress={() => onTournamentPress(item.item)} gameActions={gameActions} />;
  };

  const onTournamentPress = (tournament: any) => {
    navigation.navigate('TournamentDetailScreen', { tournament: tournament });
  };

  const renderGameItem = (item: any) => {
    return <GameItem game={item.item} index={item.index} onPress={() => onGamePress(item.item)} />;
  };

  const onGamePress = (game: any) => {
    navigation.navigate('GameDetailScreen', { game: game });
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.logoContainer}>
        <KokoLogo />
        <EnergyDisplay balance={energy} onPress={onEnergyPress} />
      </View>
      <KokoMarquee style={styles.marquee} userName={userData.username} amountData={userData.amountSum} />
      <Text style={styles.title}>{t('home.tournament')}</Text>
      <FlatList
        horizontal
        data={['_all_', ...tournamentTags]}
        style={styles.tagContainer}
        renderItem={renderTournamentTagItem}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        ref={tournamentRef}
        horizontal
        style={styles.tournamentContainer}
        data={tournaments.filter(tournament => tag === '_all_' || tournament.tag.includes(tag))}
        renderItem={renderTournamentItem}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.title}>{t('home.game')}</Text>
      <FlatList
        horizontal
        data={['_all_', ...gameCategories]}
        style={styles.tagContainer}
        renderItem={renderGameCategoryItem}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        ref={gameRef}
        horizontal
        style={styles.tournamentContainer}
        data={games.filter(game => category === '_all_' || game.category.includes(category))}
        renderItem={renderGameItem}
        ItemSeparatorComponent={renderSeparator}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
};

const mapStateToProps = (state: any) => {
  return {
    energy: getEnergyBalance(state),
    tournamentTags: getTournamentTags(state),
    tournaments: getTournamentClasses(state),
    gameCategories: getGameCategories(state),
    games: getGameList(state),
    userData: getUserData(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    gameActions: bindActionCreators(reduxGameActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
