import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './styles';
import BackButton from '../../../../components/BackButton';
import EnergyDisplay from '../../../../components/main/EnergyDisplay';

import {GO_TO_STORE} from '../../../../events/types';
import {
  getEnergyBalance,
  getGameList,
  getUserInfo,
} from '../../../../redux/selectors';
import ShareButton from '../../../../components/main/home/ShareButton';
import Sponsor from '../../../../components/Sponsor';
import {ConfirmDialogType, SPONSOR_LINK} from '../../../../consts/config';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import '../../../../utils/i18n';
import * as reduxGameActions from '../../../../redux/actions/gameActions';
import * as reduxStoreActions from '../../../../redux/actions/storeActions';
import KokoConfirmDialog from '../../../../components/KokoConfirmDialog';
import {hScaleRatio} from '../../../../utils/scailing';
import Payout from '../../../../../assets/images/payout.svg';
import {PlayType} from '../../../../consts/gameConfig';
import MatchPairingDialog from '../../../../components/main/home/MatchPairingDialog';
import {fetchMatchResult} from '../../../../redux/actions/gameActions';
import {errorMessage, successMessage} from '../../../../utils/alerts';
import {isLoggedIn} from '../../../../redux/utils/localDataManager';
import Dollar from '../../../../../assets/images/dollar.svg';
// import EventBus from 'react-native-event-bus';
import EventBus from "react-native-event-bus";

interface MatchDetailScreenProps {
  navigation?: any
  me: any
  gameActions: any
  storeActions: any
  games: any[]
  energy: any
}

const MatchDetailScreen = ({navigation, me, gameActions, storeActions, games, energy}: MatchDetailScreenProps) => {
  const {t} = useTranslation();
  const {match} = navigation.state.params;
  const [showEntryFeeDialog, setShowEntryFeeDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [opponents, setOpponents] = useState([]);
  let playId = 0;
  let showResult = false;

  const onBackPress = () => {
    navigation.goBack();
  };

  const onEnergyPress = () => {
    EventBus.getInstance().fireEvent(GO_TO_STORE);
    onBackPress();
  };

  const onBackEntryFee = () => {
    setShowEntryFeeDialog(false);
  };

  const onOkEntryFee = () => {
    setShowEntryFeeDialog(false);
    startSession();
  };

  const onBackErrorDialog = () => {
    setShowErrorDialog(false);
  };

  const onShare = () => {};

  const onPlayPress = () => {
    isLoggedIn().then(value => {
      if (value) {
        if (match.entryFee > 0) {
          setShowEntryFeeDialog(true);
        } else {
          startSession();
        }
      } else {
        navigation.navigate('LoginScreen');
      }
    });
  };

  const openSponsor = async () => {
    await Linking.canOpenURL(SPONSOR_LINK);
    Linking.openURL(SPONSOR_LINK);
  };

  const copySponsor = () => {
    Clipboard.setString(SPONSOR_LINK);
    successMessage({message: 'Copied in clipboard'});
  };

  const startSession = () => {
    gameActions.startMatchSession(
      match.id,
      onStartSessionSuccess,
      onStartSessionFail,
    );
  };

  const onStartSessionSuccess = (sessionId: any) => {
    storeActions.fetchEnergy();

    console.log("onStartSessionSucess")
    startPairing(sessionId);
  };

  const onStartSessionFail = () => {
    stopPairing();
  };

  const startPairing = (sessionId: any) => {
    setIsPairing(true);
    gameActions.startMatchPairing(
      sessionId,
      onStartPairingSuccess,
      onStartPairingFail,
    );
  };

  const onStartPairingSuccess = (matchPlayId: any, users:any) => {
    playId = matchPlayId;
    setOpponents(users);
    gameActions.fetchGameAuthToken(
      match.gameId,
      onAuthGameSuccess,
      onAuthGameFail,
    );
  };

  const onStartPairingFail = (error: any) => {
    setIsPairing(false);
    setShowErrorDialog(true);
  };

  const stopPairing = () => {
    setIsPairing(false);
  };

  const onAuthGameSuccess = (token: any) => {
    playMatch(token);
    stopPairing();
  };

  const onAuthGameFail = () => {
    stopPairing();
  };

  const playMatch = (token: any) => {
    showResult = false;
    let game = getGame();
    navigation.navigate('GamePlayScreen', {
      token: token,
      playId: playId,
      playType: PlayType.match,
      gameUrl: game.cdnUrl,
      duration: match.durationPlaySecond,
      onGameEnd,
    });
  };

  const onGameEnd = () => {
    showResult = true;
    //playId = 0;
    setOpponents([]);
    fetchMatchResult();
  };

  const fetchMatchResult = () => {
    gameActions.fetchMatchResult(playId, onResultSuccess, onResultFail);
  };

  const onResultSuccess = (result: any) => {
    console.log("result",result);
    if (showResult) {
      navigation.navigate('MatchResultScreen', {
        result,
        game: getGame(),
        onPlayAgain: onPlayPress,
      });
    }
  };

  const onResultFail = () => {};

  const getGame = () => {
    return games.filter(value => value.id === match.gameId)[0];
  };

  return (
    <View style={styles.container}>
      <View style={styles.appbarContainer}>
        <BackButton onPress={onBackPress} />
        <EnergyDisplay balance={energy} onPress={onEnergyPress} />
      </View>
      <ScrollView
        style={{flex: 1, marginTop: hScaleRatio(24)}}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.coverContainer}>
          <Image style={styles.cover} source={{uri: match.coverImageUrl}} />
          <LinearGradient
            colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']}
            start={{x: 0.5, y: 1}}
            end={{x: 0.5, y: 0}}
            style={styles.coverGradient}
          />
          <Text style={styles.name}>{match.matchName}</Text>
          <ShareButton style={styles.share} onPress={onShare} />
        </View>
        <TouchableOpacity style={styles.play} onPress={onPlayPress}>
          <LinearGradient
            style={styles.gradient}
            colors={['#0038F5', '#9F03FF']}
            start={{x: 0.3, y: 0}}
            end={{x: 0.9, y: 1}}>
            <Text style={styles.playText}>{t('game.play_now')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.description}>{match.description}</Text>
        <Sponsor
          style={styles.sponsor}
          onPress={openSponsor}
          onCopyLink={copySponsor}
        />
        <Text style={styles.rule}>{t('game.rule')}</Text>
        <View style={styles.ruleContainer}>
          <Text style={styles.winner}>Winner</Text>
          <View style={{flex: 1}} />
          <Dollar width={25} height={25} />
          <Text style={styles.payout}>+{match.winningPayout}</Text>
        </View>
      </ScrollView>
      <KokoConfirmDialog
        visible={showEntryFeeDialog}
        type={ConfirmDialogType.question}
        title={t('game.entry_fee.title')}
        message={t('game.entry_fee.message', {energy: match.entryFee})}
        onCancel={onBackEntryFee}
        onOk={onOkEntryFee}
      />
      <KokoConfirmDialog
        visible={showErrorDialog}
        type={ConfirmDialogType.close}
        title={t('dialog.error')}
        message={"Rival is not available"}
        onCancel={onBackErrorDialog}
        onOk={onBackErrorDialog}
      />
      <MatchPairingDialog
        visible={isPairing}
        user={me}
        opponents={opponents}
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

export default connect(mapStateToProps, mapDispatchToProps)(MatchDetailScreen);
