import { all } from 'redux-saga/effects';
import {
  watchBlockUser,
  watchFetchBlockList,
  watchFetchUserInfo,
  watchGetUserNameAmountSum,
  watchGetUserTournamentHistory, watchRegisterFCMToken,
  watchSignIn,
  watchSignOut, watchSuspendAccount, watchUnblockUser,
  watchUpdateUserInfo,
} from "./authSaga";
import {
  watchFetchCoin,
  watchFetchEnergy,
  watchGetGameItems,
  watchGetPurchasedItems,
  watchPurchaseEnergy,
  watchPurchaseItems,
} from "./storeSaga";
import { watchLoadAppDataSaga } from "./appSaga";
import {
  watchFetchGameAuthToken,
  watchFetchGameList, watchFetchGameMatches, watchFetchGamePlayStatus, watchFetchGameTournaments,
  watchFetchMatchResult,
  watchFetchTournamentClasses,
  watchFetchTournamentHistory,
  watchFetchTournamentPlayable,
  watchFetchTournamentRanking, watchJoinTournament, watchStartMatchPairing, watchStartMatchSession,
} from "./gameSaga";
import {
  watchCheckBlock, watchCreateSupportThread,
  watchFetchChatThreadMessage,
  watchFetchChatThreads,
  watchFetchThreadUnreadMessageCount, watchSendDirectMessage, watchSendMessage,
  watchSetThreadReadAt
} from "./chatSaga";

export default function* sagas() {
  yield all([
    // App
    watchLoadAppDataSaga(),

    // Auth
    watchSignIn(),
    watchSignOut(),
    watchFetchUserInfo(),
    watchFetchBlockList(),
    watchUpdateUserInfo(),
    watchGetUserTournamentHistory(),
    watchRegisterFCMToken(),
    watchBlockUser(),
    watchUnblockUser(),
    watchGetUserNameAmountSum(),
    watchSuspendAccount(),

    // Store
    watchFetchEnergy(),
    watchFetchCoin(),
    watchGetGameItems(),
    watchPurchaseItems(),
    watchGetPurchasedItems(),
    watchPurchaseEnergy(),

    // Game
    watchFetchTournamentClasses(),
    watchFetchGameList(),
    watchFetchTournamentPlayable(),
    watchFetchTournamentRanking(),
    watchFetchTournamentHistory(),
    watchJoinTournament(),
    watchFetchGameAuthToken(),
    watchFetchGamePlayStatus(),
    watchFetchGameTournaments(),
    watchFetchGameMatches(),
    watchStartMatchSession(),
    watchStartMatchPairing(),
    watchFetchMatchResult(),

    // Chat
    watchFetchChatThreads(),
    watchFetchChatThreadMessage(),
    watchFetchThreadUnreadMessageCount(),
    watchSetThreadReadAt(),
    watchSendMessage(),
    watchCheckBlock(),
    watchSendDirectMessage(),
    watchCreateSupportThread()
  ]);
}
