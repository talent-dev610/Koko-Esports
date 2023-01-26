import { GameDataType, TournamentClassDataType } from "../../@types/app";
import {
  GAME_FETCH_GAME_LIST,
  GAME_FETCH_GAME_LIST_SUCCESS,
  GAME_FETCH_TOURNAMENT_CLASSES,
  GAME_FETCH_TOURNAMENT_CLASSES_SUCCESS,
  GAME_FETCH_TOURNAMENT_PLAYABLE,
  GAME_FETCH_TOURNAMENT_RANKING,
  GAME_FETCH_TOURNAMENT_HISTORY,
  GAME_JOIN_TOURNAMENT,
  GAME_FETCH_GAME_AUTH_TOKEN,
  GAME_FETCH_GAME_PLAY_STATUS,
  GAME_FETCH_GAME_TOURNAMENTS,
  GAME_FETCH_GAME_MATCHES,
  GAME_MATCH_START_SESSION,
  GAME_MATCH_START_PAIRING,
  GAME_FETCH_MATCH_RESULT,
} from "./types";

export const fetchTournamentClasses = () => ({
  type: GAME_FETCH_TOURNAMENT_CLASSES
});

export const fetchTournamentClassesSuccess = (tournaments: TournamentClassDataType[]) => ({
  type: GAME_FETCH_TOURNAMENT_CLASSES_SUCCESS,
  tournaments
});

export const fetchGameList = () => ({
  type: GAME_FETCH_GAME_LIST
});

export const fetchGameListSuccess = (games: GameDataType[]) => ({
  type: GAME_FETCH_GAME_LIST_SUCCESS,
  games
});

export const fetchTournamentPlayable = (tournamentClassId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_TOURNAMENT_PLAYABLE,
  tournamentClassId,
  onSuccess,
  onFail
});

export const fetchTournamentRanking = (tournamentId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_TOURNAMENT_RANKING,
  tournamentId,
  onSuccess,
  onFail
});

export const fetchTournamentHistory = (tournamentClassId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_TOURNAMENT_HISTORY,
  tournamentClassId,
  onSuccess,
  onFail
});

export const joinTournament = (playableTournamentId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_JOIN_TOURNAMENT,
  playableTournamentId,
  onSuccess,
  onFail
});

export const fetchGameAuthToken = (gameId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_GAME_AUTH_TOKEN,
  gameId,
  onSuccess,
  onFail
});

export const fetchGamePlayStatus = (playType: any, playId: number, subscriber: string, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_GAME_PLAY_STATUS,
  playType,
  playId,
  subscriber,
  onSuccess,
  onFail
});

export const fetchGameTournaments = (gameId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_GAME_TOURNAMENTS,
  gameId,
  onSuccess,
  onFail
});

export const fetchGameMatches = (gameId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_GAME_MATCHES,
  gameId,
  onSuccess,
  onFail
});

export const startMatchSession = (matchId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_MATCH_START_SESSION,
  matchId,
  onSuccess,
  onFail
});

export const startMatchPairing = (sessionId: any, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_MATCH_START_PAIRING,
  sessionId,
  onSuccess,
  onFail
});

export const fetchMatchResult = (matchPlayId: number, onSuccess: (result: any) => void, onFail: (error: any) => void) => ({
  type: GAME_FETCH_MATCH_RESULT,
  matchPlayId,
  onSuccess,
  onFail
});
