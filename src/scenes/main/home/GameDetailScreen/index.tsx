import React, { useState, useEffect, useRef } from "react";
import { FlatList, Image, Linking, ScrollView, Text, View } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";

import { GO_TO_STORE } from "../../../../events/types";
import BackButton from "../../../../components/BackButton";
import EnergyDisplay from "../../../../components/main/EnergyDisplay";
import { getEnergyBalance, getTournamentClasses } from "../../../../redux/selectors";
import ShareButton from "../../../../components/main/home/ShareButton";
import LinearGradient from "react-native-linear-gradient";
import SponsorBanner from "../../../../components/SponsorBanner";
import { GAME_LINK, SHARE_USER, SPONSOR_LINK } from "../../../../consts/config";
import { PlayType } from "../../../../consts/gameConfig";
import TagItem from "../../../../components/main/home/TagItem";
import { useTranslation } from "react-i18next";
import "../../../../utils/i18n";
import TournamentItem from "../../../../components/main/home/TournamentItem";
import * as reduxGameActions from "../../../../redux/actions/gameActions";
// import { shareOnTwitter } from "react-native-social-share";
const shareOnTwitter = require('react-native-social-share').shareOnTwitter;
import EventBus from "react-native-event-bus";

interface GameDetailScreenProps {
  navigation?: any
  gameActions: any
  energy: any
}

const GameDetailScreen = ({ navigation, gameActions, energy }: GameDetailScreenProps) => {
  const { t } = useTranslation();
  const tournamentRef = useRef<FlatList>(null);
  const { game } = navigation.state.params;
  const playTypes = [PlayType.tournament, PlayType.match, PlayType.practise];
  const [type, setType] = useState(playTypes[0]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    gameActions.fetchGameTournaments(game.id, onGameTournamentsFetched, onGameTournamentsFailed);
    gameActions.fetchGameMatches(game.id, onGameMatchesFetched, onGameMatchesFailed);
    EventBus.getInstance().addListener(GO_TO_STORE, () => {
      navigation.goBack();
    });
  }, []);

  const onGameTournamentsFetched = (gameTournaments: any) => {
    setTournaments(gameTournaments);
  };

  const onGameTournamentsFailed = (error: any) => {
  };

  const onGameMatchesFetched = (gameMatches: any) => {
    setMatches(gameMatches);
  };

  const onGameMatchesFailed = (error: any) => {
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const onEnergyPress = () => {
    EventBus.getInstance().fireEvent(GO_TO_STORE);
    onBackPress();
  };

  const onShare = () => {
    const gameTitle = game.name;
    const text = t("share.detail.game", { game_title: gameTitle });
    shareOnTwitter({
      "text": `${text} #@${SHARE_USER} ${GAME_LINK}`,
      "link": GAME_LINK
    },
      (results: any) => {
        if (results === "not_available") {
          let twitterParameters = [];
          twitterParameters.push("url=" + encodeURI(GAME_LINK));
          twitterParameters.push("text=" + encodeURI(text));
          twitterParameters.push("via=" + encodeURI(SHARE_USER));
          const url =
            "https://twitter.com/intent/tweet?"
            + twitterParameters.join("&");
          Linking.openURL(url)
            .then((data) => {
            })
            .catch(() => {
            });
        }
        console.log(results);
      },
    );
  };

  const openSponsor = async () => {
    await Linking.canOpenURL(SPONSOR_LINK);
    Linking.openURL(SPONSOR_LINK);
  };

  const renderPlayTypeItem = (item: any) => {
    return <TagItem
      tag={t(item.item.label)}
      index={item.index}
      selected={type === item.item}
      onPress={() => {
        tournamentRef?.current?.scrollToOffset({ animated: true, offset: 0 });
        setType(item.item);
      }}
      startPadding={52} />;
  };

  const renderTypeSeparator = () => {
    return (
      <View style={styles.tagSeparator} />
    );
  };

  const getGameRenderData = () => {
    if (type === PlayType.match) return matches;
    if (type === PlayType.practise) return tournaments.filter(tournament => tournament.type === 3);
    return tournaments.filter(tournament => tournament.type !== 3);
  };

  const renderGameItem = (item: any) => {
    return <TournamentItem tournament={item.item} index={item.index} onPress={() => onGamePress(item.item)}
      startPadding={52} gameActions={gameActions} />;
  };

  const onGamePress = (gameItem: any) => {
    if (gameItem.tournamentName) {
      navigation.navigate('TournamentDetailScreen', { tournament: gameItem });
    } else {
      navigation.navigate('MatchDetailScreen', { match: gameItem });
    }
  };

  const renderTournamentSeparator = () => {
    return (
      <View style={styles.tournamentSeparator} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbarContainer}>
        <BackButton onPress={onBackPress} />
        <EnergyDisplay balance={energy} onPress={onEnergyPress} />
      </View>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.coverContainer}>
          <Image style={styles.cover} source={{ uri: game.coverImageUrl }} />
          <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]} start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }} style={styles.coverGradient} />
          <Text style={styles.name}>{game.name}</Text>
          <ShareButton style={styles.share} onPress={onShare} />
        </View>
        <SponsorBanner style={styles.sponsor} onPress={openSponsor} />
        <Text style={styles.description}>{game.introduction}</Text>
        <FlatList
          horizontal
          data={playTypes}
          style={styles.tagContainer}
          renderItem={renderPlayTypeItem}
          ItemSeparatorComponent={renderTypeSeparator}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false} />
        <FlatList
          ref={tournamentRef}
          horizontal
          style={styles.tournamentContainer}
          data={getGameRenderData()}
          renderItem={renderGameItem}
          ItemSeparatorComponent={renderTournamentSeparator}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    energy: getEnergyBalance(state),
    tournaments: getTournamentClasses(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    gameActions: bindActionCreators(reduxGameActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GameDetailScreen);
