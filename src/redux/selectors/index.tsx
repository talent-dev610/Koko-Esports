// Auth
export const getUserInfo = (state: any) => state.auth.me;
export const getUserData = (state: any) => state.auth.userInfo;
export const getUserTnmtHistory = (state: any) => state.auth.history;

export const getHistoryTags = (params: any[]) => {
  const tnmtNames = Array.from(new Set(params.map(history => history.tournamentName)));
  let result = [] as any[];
  const allObj = {} as any;
  allObj.label = "All";
  allObj.value = "1";
  result.push(allObj)
  let index = 1;
  tnmtNames.forEach(value => {
    if (value) {
      const tmpObj = {} as any;
      tmpObj.label = value;
      index++;
      tmpObj.value = `${index}`;
      result.push(tmpObj);
    }
  });
  return result;
}
export const getBlockedUsers = (state: any) => state.auth.blockedUsers;
export const getPurchasedItems = (state: any) => state.store.purchasedItems;

// Store
export const getEnergyBalance = (state: any) => state.store.energy;
export const getCoinBalance = (state: any) => state.store.coin.confirmed ?? 0;
export const getGameItemsList = (state: any) => state.store.items;

// Game
export const getTournamentClasses = (state: any) => state.game.tournaments;
export const getGameList = (state: any) => state.game.games;
export const getGameCategories = (state: any) => {
  const categories = Array.from(new Set(state.game.games.map((game: any) => game.category)));
  let result = [] as any[];
  categories.forEach((value: any) => result.push(...value.split(', ')));
  return Array.from(new Set(result));
};
export const getTournamentTags = (state: any) => {
  const tags = Array.from(new Set(state.game.tournaments.map((tnmt: any) => tnmt.tag)));
  let result = [] as any[];
  tags.forEach((value: any) => result.push(...value.split(', ')));
  return Array.from(new Set(result));
};

// Chat
export const getPublicThreads = (state: any) => state.chat.publicThreads;
export const getDMThreads = (state: any) => state.chat.dmThreads;
export const getCSThreads = (state: any) => state.chat.csThreads;
export const getUnreadCount = (state: any) => state.chat.unreadMessages;


