import React, { memo, useEffect, useState } from "react";
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import colors from "../../../theme/colors";
import { hScaleRatio, wScale } from "../../../utils/scailing";
import LinearGradient from "react-native-linear-gradient";
import shadows from "../../../theme/shadows";
import { getTournamentStatus } from "../../../utils/gameUtils";
import { useTranslation } from "react-i18next";
import "../../../utils/i18n";
import { TournamentStatus } from "../../../consts/gameConfig";
import moment from "moment";
import { formatDurationSecond, kokoTimeStrToDate } from "../../../utils/stringUtils";
import { join } from "lodash";
import { errorMessage } from "../../../utils/alerts";

interface TournamentPlayButtonProps {
  style: ViewStyle
  tournamentClass: TournamentClassDataType
  playableTournament: TournamentDataType
  joinedAlready: boolean
  timeError: any
  onPress:  () => void
}

export default memo(({ style, tournamentClass, playableTournament, joinedAlready, timeError, onPress }: TournamentPlayButtonProps) => {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState<moment.Moment|undefined>(undefined);

  useEffect(() => {
    let timer = setInterval(() => setCurrentTime(moment()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatus = () => {
    return getTournamentStatus(tournamentClass, playableTournament, joinedAlready);
  }

  const getButtonTitle = () => {
    if (tournamentClass.type === 0) {
      if (joinedAlready) {
        return t("game.enter_again_left", {duration: formatDurationSecond(getLeftTime())});
      } else {
        return t("game.enter_now_left", {duration: formatDurationSecond(getLeftTime())});
      }
    } else if (tournamentClass.type === 3) {
      return t("game.play_now");
    } else {
      switch (getStatus()) {
        case TournamentStatus.playable:
          return t("game.play_now");
        case TournamentStatus.finished:
          return t("game.finished");
        case TournamentStatus.notStartedYet:
          const startTime = tournamentClass.startTime.length > 0 ? tournamentClass.startTime : t("game.unknown");
          return startTime + " ~";
        case TournamentStatus.full:
          return t("game.full");
      }
    }
  };

  const getLeftTime = () => {
    let startTime = kokoTimeStrToDate(tournamentClass.startTime);
    if (startTime.isBefore(currentTime)) {
      startTime = moment(startTime.add(1, "day").format("YYYY/MM/DD"));
    }
    return startTime.diff(currentTime, "seconds") % tournamentClass.durationSecond;
  };

  const onClick = () => {
    if (getLeftTime() <= tournamentClass.entryBeforeSecond) {
      timeError(true);
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={onClick} style={[defStyle.container, style]} activeOpacity={getStatus() === TournamentStatus.playable ? 0.2 : 1}>
      <LinearGradient style={defStyle.gradient} colors={[getStatus() === TournamentStatus.playable ? '#0038F5' : colors.onBg, getStatus() === TournamentStatus.playable ? '#9F03FF' : colors.onBg]} start={{x: 0.3, y: 0}} end={{x: 0.9, y: 1}}>
        <Text style={[defStyle.text, {fontSize: tournamentClass.type === 0 ? 12 : 14, color: tournamentClass.type === 0 && getLeftTime() <= tournamentClass.entryBeforeSecond ? colors.red : colors.white}]}>{getButtonTitle()}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
});

const defStyle = StyleSheet.create({
  container: {
    height: hScaleRatio(48),
    borderRadius: 10,
    justifyContent: 'center',
    ...shadows.default
  },
  gradient: {
    height: hScaleRatio(48),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: colors.white,
    fontFamily: "Noto Sans",
    textAlign: "center"
  },
});
