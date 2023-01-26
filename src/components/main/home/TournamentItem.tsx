import React, { memo, useState, useEffect } from "react";
import { GestureResponderEvent, Image, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, wScale } from "../../../utils/scailing";
import Dollar from "../../../../assets/images/dollar.svg";
import Energy from "../../../../assets/images/energy.svg";
import { useTranslation } from "react-i18next";
import "../../../utils/i18n";
import Ionicons from 'react-native-vector-icons/Ionicons';
import shadows from "../../../theme/shadows";
import KeywordItem from "./KeywordItem";
import RuleItem from "./RuleItem";
import PeopleImage1 from "../../../../assets/images/people1.png";
import PeopleImage2 from "../../../../assets/images/people2.png";

interface TournamentItemProps {
  style?: ViewStyle
  tournament: TournamentClassDataType | MatchClassDataType
  index:  number
  onPress: (event: GestureResponderEvent) => void
  startPadding?: number
  gameActions: any
}

export default memo(({ style, tournament, index, onPress, startPadding = 24, gameActions }: TournamentItemProps) => {

  const { t } = useTranslation();
  const [playerCount, setPlayerCount] = useState(0);
  const name =  'tournamentName' in tournament ? tournament.tournamentName : tournament.matchName;

  useEffect(() => {
    fetchTournamentPlayable();
  }, []);

  const fetchTournamentPlayable = () => {
    gameActions.fetchTournamentPlayable(
      tournament.id,
      (data: TournamentDataType) => onTournamentPlayableFetched(data),
      (error: any) => onTournamentPlayableFailed());
  };

  const onTournamentPlayableFetched = (data: TournamentDataType) => {
    setPlayerCount(data.joinPlayersCount);
  };

  const onTournamentPlayableFailed = () => {
    setPlayerCount(0);
  };

  const getAward = () => {
    if ("rankingPayout" in tournament && tournament.rankingPayout) {
      const awards = JSON.parse(tournament.rankingPayout).map((rule: RuleDataType) => rule.payout);
      return awards.length > 0 ? awards[0] : 0;
    } else if ("winningPayout" in tournament && tournament.winningPayout) {
      return tournament.winningPayout;
    } else {
      return 0;
    }
  };

  return (
    <TouchableOpacity style={[defStyle.container, style, {marginLeft: index === 0 ? wScale(startPadding) : 0}]} onPress={onPress}>
      <View>
        <Image style={defStyle.image} source={{uri: tournament.thumbnail || ''}} />
        <View style={defStyle.coinContainer}>
          <Dollar width={15} height={15} />
          <Text style={defStyle.coin}>{getAward().toLocaleString()}</Text>
        </View>
        <View style={defStyle.energyContainer}>
          <Energy width={8} height={15} />
          <Text style={[defStyle.coin, {marginLeft: wScale(9)}]}>{t('home.join_with_energy', {
            energy: tournament.entryFee.toLocaleString()
          })}</Text>
        </View>
      </View>
      <View style={defStyle.titleContainer}>
        <View style={{maxWidth: wScale(200)}}>
          <Text style={defStyle.title} numberOfLines={1}>{ (name.length > 12) ?
            ((name.substring(0, 12)) + '...') :
            name }</Text>
          <View style={defStyle.keywordContainer}>
            {
              tournament.keyword.split(', ').map(keyword => <KeywordItem keyword={keyword} />)
            }
          </View>
        </View>
        <View style={{flex: 1}} />
        <View style={defStyle.playContainer}>
          <Ionicons
            name="play-sharp"
            style={defStyle.play} />
        </View>
      </View>
      <Text style={defStyle.descriptionContainer}>
        <Text style={defStyle.description}>{ ('description' in tournament && tournament.description.length > 29 ) ?
          (('description' in tournament ? tournament.description.substring(0, 27) : '') + '...   ') :
          'description' in tournament ? tournament.description : '' }</Text>
        {
          'description' in tournament && tournament.description.length > 30 && <Text style={defStyle.readMore}>{t('home.read_more')}</Text>
        }
      </Text>
      {
        'tournamentName' in tournament && tournament.tournamentName && <View style={defStyle.avatarContainer}>
          <Image style={defStyle.people1} source={PeopleImage1} />
          <Image style={defStyle.people2} source={PeopleImage2} />
          <View style={defStyle.playerContainer}>
            <Text style={defStyle.playerStatus}>{playerCount}/{tournament.participantNumber}</Text>
          </View>
        </View>
      }
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  container: {
    width: wScale(295),
    height: hScaleRatio(360),
    flexDirection: 'column',
    backgroundColor: colors.onBg,
    borderRadius: 20,
    padding: wScale(17),
    marginBottom: hScaleRatio(16),
    ...shadows.default
  },
  image: {
    width: '100%',
    height: hScaleRatio(150),
    borderRadius: 10,
    alignSelf: 'center'
  },
  coinContainer: {
    height: hScaleRatio(20),
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: hScaleRatio(13),
    right: wScale(13),
    paddingHorizontal: wScale(10),
    paddingVertical: hScaleRatio(2),
    flexDirection: 'row'
  },
  coin: {
    fontFamily: "Noto Sans",
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 14,
    color: colors.white,
    marginLeft: wScale(2)
  },
  energyContainer: {
    height: hScaleRatio(20),
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: hScaleRatio(42),
    right: wScale(13),
    paddingHorizontal: wScale(10),
    paddingVertical: hScaleRatio(2),
    flexDirection: 'row'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hScaleRatio(16)
  },
  title: {
    fontFamily: "Noto Sans",
    fontWeight: '900',
    fontSize: 16,
    color: colors.white,
    lineHeight: 18,
    maxHeight: 18
  },
  playContainer: {
    width: wScale(40),
    height: hScaleRatio(40),
    borderRadius: 20,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3
  },
  play: {
    fontSize: 20,
    color: colors.white,
    lineHeight: 20
  },
  keywordContainer: {
    flexDirection: 'row',
    marginTop: hScaleRatio(10)
  },
  descriptionContainer: {
    marginTop: hScaleRatio(6)
  },
  description: {
    fontFamily: "Noto Sans",
    fontSize: 14,
    color: colors.white,
  },
  readMore: {
    fontFamily: "Noto Sans",
    fontSize: 14,
    color: colors.moreColor
  },
  avatarContainer: {
    marginTop: hScaleRatio(12),
    position: 'absolute',
    bottom: hScaleRatio(20),
    left: wScale(17)
  },
  playerContainer: {
    position: 'absolute',
    left: 50,
    width: wScale(40),
    height: hScaleRatio(40),
    backgroundColor: colors.blue,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playerStatus: {
    color: colors.white,
    fontSize: 8
  },
  people1: {
    width: wScale(40),
    height: hScaleRatio(40),
  },
  people2: {
    width: wScale(40),
    height: hScaleRatio(40),
    position: 'absolute',
    left: 25
  }
});
