import React, { useState, useEffect } from "react";
import { FlatList, Image, Linking, ScrollView, Text, View } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import BackButton from "../../../../components/BackButton";
import EnergyDisplay from "../../../../components/main/EnergyDisplay";

import { GO_TO_STORE } from "../../../../events/types";
import { getEnergyBalance, getGameList, getUserInfo } from "../../../../redux/selectors";
import ShareButton from "../../../../components/main/home/ShareButton";
import TournamentPlayButton from "../../../../components/main/home/TournamentPlayButton";
import RuleItem from "../../../../components/main/home/RuleItem";
import { hScaleRatio } from "../../../../utils/scailing";
import RankingItem from "../../../../components/main/home/RankingItem";
import Sponsor from "../../../../components/Sponsor";
import { ConfirmDialogType, GAME_LINK, SHARE_USER, SPONSOR_LINK } from "../../../../consts/config";
import LinearGradient from "react-native-linear-gradient";
import { useTranslation } from "react-i18next";
import * as reduxGameActions from "../../../../redux/actions/gameActions";
import * as reduxStoreActions from "../../../../redux/actions/storeActions";
import { PlayType, TournamentStatus } from "../../../../consts/gameConfig";
import { getTournamentStatus } from "../../../../utils/gameUtils";
import KokoConfirmDialog from "../../../../components/KokoConfirmDialog";
import i18n from "../../../../utils/i18n";
import { isLoggedIn } from "../../../../redux/utils/localDataManager";
import { errorMessage, successMessage } from "../../../../utils/alerts";
// import EventBus from "react-native-event-bus";
// import { shareOnTwitter } from "react-native-social-share";
import EventBus from "react-native-event-bus";
import { saveTournamentId ,getTournamentId} from "../../../../redux/utils/localDataManager";
const shareOnTwitter = require("react-native-social-share").shareOnTwitter;

interface TournamentDetailScreenProps {
  navigation?: any
  gameActions: any
  storeActions: any
  me: any
  energy: any
  games: any[]
}

const TournamentDetailScreen = ({ navigation, gameActions, storeActions, me, energy, games }: TournamentDetailScreenProps) => {
  const { t } = useTranslation();
  const { tournament } = navigation.state.params;
  const [playableTournament, setPlayableTournament] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [showEntryFeeDialog, setShowEntryFeeDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showTimeErrorDialog, setShowTimeErrorDialog] = useState(false);
  let showResult = false;
  let play = null as any;

  useEffect(() => {
    fetchTournamentPlayable();
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [playableTournament]);

  const fetchTournamentPlayable = () => {
    gameActions.fetchTournamentPlayable(
      tournament.id,
      (data: any) => onTournamentPlayableFetched(data),
      (error: any) => onTournamentPlayableFailed(error));
  };

  const onTournamentPlayableFetched = (data: any) => {
    setPlayableTournament(data);
  };

  const onTournamentPlayableFailed = (error: any) => {
    setPlayableTournament(null);
  };

  const fetchRankings = () => {
    if (playableTournament) {
      const status = getTournamentStatus(tournament, playableTournament, joinedAlready());
      switch (status) {
        case TournamentStatus.notStartedYet:
          setRankings([]);
          return;
        case TournamentStatus.finished:
          fetchFinishedRanking();
          return;
        default:
          fetchCurrentRanking(playableTournament.id);
      }
    }
  };

  const fetchCurrentRanking = (tournamentId: any) => {
    gameActions.fetchTournamentRanking(
      tournamentId,
      (data: any) => onRankingFetched(data),
      (error: any) => onRankingFailed(error));
  };

  const onRankingFetched = (data: any) => {
    setRankings(data);
    if (showResult) {
      navigation.navigate("GameResultScreen", {
        result: data,
        tournament,
        game: getGame(),
        onPlayAgain,
      });
    }
  };

  const onRankingFailed = (error: any) => {
  };

  const fetchFinishedRanking = () => {
    gameActions.fetchTournamentHistory(
      tournament.id,
      (data: any) => onHistoryFetched(data),
      (error: any) => onHistoryFailed(error),
    );
  };

  const onHistoryFetched = (data: any) => {
    fetchCurrentRanking(data[0].id);
  };

  const onHistoryFailed = (error: any) => {

  };

  const joinedAlready = () => {
    const records = rankings.filter(ranking => ranking.id === me.id);
    return records && records.length > 0;
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const onEnergyPress = () => {
    EventBus.getInstance().fireEvent(GO_TO_STORE);
    onBackPress();
  };

  const onShare = () => {
    const gameTitle = getGame().name;
    const tournamentName = tournament.tournamentName;
    const text = t("share.detail.tournament", { game_title: gameTitle, tournament_name: tournamentName });
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

  const onPlayAgain = () => {
    joinTournament();
  };

  const onEnterPress = async () => {
 //    fetchTournamentPlayable();
    const savedTournamentId = await getTournamentId()
    console.log(savedTournamentId)
    const joined = joinedAlready();
    const status = getTournamentStatus(tournament, playableTournament, joined);
    if (status === TournamentStatus.playable) {
      isLoggedIn().then(value => {
        if (value) {
          if (tournament.entryFee > 0 && !joined) {
      
            if(savedTournamentId === playableTournament.id){
              joinTournament()
            }
            else{
              setShowEntryFeeDialog(true);
            }

          } else {
            joinTournament();
          }
        } else {
          navigation.navigate('LoginScreen');
        }
      });
    }
  };

  const openSponsor = async () => {
    await Linking.canOpenURL(SPONSOR_LINK);
    Linking.openURL(SPONSOR_LINK);
  };

  const copySponsor = () => {
    Clipboard.setString(SPONSOR_LINK);
    successMessage({ message: "Copied in clipboard" });
  };

  const renderRankingItem = (item: any) => {
    return (<RankingItem item={item.item} index={item.index} />);
  };

  const onBackEntryFee = () => {
    setShowEntryFeeDialog(false);
  };

  const onBackErrorDialog = () => {
    setShowErrorDialog(false);
    setShowTimeErrorDialog(false);
  };

  const onOkEntryFee = () => {
    setShowEntryFeeDialog(false);
    if (tournament.entryFee > energy) {
     setShowErrorDialog(true);
    } else {
      joinTournament();
    }
  };

  const joinTournament = async () => {
    console.log(playableTournament.id)
    await saveTournamentId(playableTournament.id)
    gameActions.joinTournament(playableTournament.id, onJoinSuccess, onJoinFail);
  
  };

  const onJoinSuccess = (tournamentPlay: any) => {
    play = tournamentPlay;
    storeActions.fetchEnergy();
    gameActions.fetchGameAuthToken(tournament.gameId, onAuthGameSuccess, onAuthGameFail);
  };

  const onJoinFail = () => {
  };

  const onAuthGameSuccess = (token: any) => {
    playTournament(token);
  };

  const onAuthGameFail = () => {
    
  };

  const getGame = () => {
    return games.filter(value => value.id === tournament.gameId)[0];
  };

  const playTournament = (token: any) => {
    showResult = false;
    let game = getGame();
    navigation.navigate("GamePlayScreen", {
      token: token,
      playId: play.id,
      playType: PlayType.tournament,
      gameUrl: game.cdnUrl,
      duration: tournament.durationPlaySecond,
      onGameEnd,
    });
  };

  const onGameEnd = () => {
    showResult = true;
    fetchRankings();
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbarContainer}>
        <BackButton onPress={onBackPress} />
        <EnergyDisplay balance={energy} onPress={onEnergyPress} />
      </View>
      <ScrollView style={{ flex: 1, marginTop: hScaleRatio(24) }} showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.coverContainer}>
          <Image style={styles.cover} source={{ uri: tournament.coverImageUrl }} />
          <LinearGradient colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]} start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }} style={styles.coverGradient} />
          <Text style={styles.name}>{tournament.tournamentName}</Text>
          <ShareButton style={styles.share} onPress={onShare} />
        </View>
        <TournamentPlayButton style={styles.play} tournamentClass={tournament} playableTournament={playableTournament}
          joinedAlready={joinedAlready()} timeError= {setShowTimeErrorDialog} onPress={onEnterPress} />
        <Text style={styles.description}>{tournament.description}</Text>
        <Text style={styles.rule}>{t("game.rule")}</Text>
        {
          JSON.parse(tournament.rankingPayout).map((rule: any) => <RuleItem content={rule} />)
        }
        <Sponsor style={styles.sponsor} onPress={openSponsor} onCopyLink={copySponsor} />
        {
          rankings && rankings.length > 0 && <Text style={styles.rule}>{t("game.ranking")}</Text>
        }
        {
          rankings && rankings.length > 0 &&
          <FlatList data={rankings.slice(0, Math.min(40, rankings.length))} renderItem={renderRankingItem} />
        }
      </ScrollView>
      <KokoConfirmDialog
        visible={showEntryFeeDialog}
        type={ConfirmDialogType.question}
        title={t("game.entry_fee.title")}
        message={t("game.entry_fee.message", { energy: tournament.entryFee })}
        onCancel={onBackEntryFee}
        onOk={onOkEntryFee} />
        <KokoConfirmDialog
        visible={showErrorDialog}
        type={ConfirmDialogType.close}
        title={t('dialog.error')}
        message={"Not Enough money"}
        onCancel={onBackErrorDialog}
        onOk={onBackErrorDialog}
      />
        <KokoConfirmDialog
        visible={showTimeErrorDialog}
        type={ConfirmDialogType.close}
        title={t('dialog.error')}
        message={"Time is over. Try in next round."}
        onCancel={onBackErrorDialog}
        onOk={onBackErrorDialog}
      />
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    me: getUserInfo(state),
    energy: getEnergyBalance(state),
    games: getGameList(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    gameActions: bindActionCreators(reduxGameActions, dispatch),
    storeActions: bindActionCreators(reduxStoreActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TournamentDetailScreen);
