import { ReduxActionDefaultParamDataType } from "../../@types/app";
import {
  GET_GAME_ITEMS,
  GET_GAME_ITEMS_SUCCESS,
  GET_PURCHASED_ITEMS,
  GET_PURCHASED_ITEMS_SUCCESS, PURCHASE_ENERGY,
  PURCHASE_ITEMS,
  PURCHASE_ITEMS_SUCCESS,
  STORE_FETCH_COIN,
  STORE_FETCH_COIN_SUCCESS,
  STORE_FETCH_ENERGY,
  STORE_FETCH_ENERGY_SUCCESS,
} from "./types";

export const fetchEnergy = () => ({
  type: STORE_FETCH_ENERGY,
});

export const fetchEnergySuccess = (energy: any) => ({
  type: STORE_FETCH_ENERGY_SUCCESS,
  energy
});

export const fetchCoin = () => ({
  type: STORE_FETCH_COIN
});

export const fetchCoinSuccess = (coin: any) => ({
  type: STORE_FETCH_COIN_SUCCESS,
  coin
});

export const getGameItems = (gameId: number,onSuccess:any, onFail:any) => ({
  type: GET_GAME_ITEMS,
  gameId,
  onSuccess,
  onFail
});
export const getGameItemsSuccess = (items: any) => ({
  type: GET_GAME_ITEMS_SUCCESS,
  items
});

export const purchaseItems = ({ params, onSuccess, onFail }: ReduxActionDefaultParamDataType) => ({
  type: PURCHASE_ITEMS,
  params,
  onSuccess,
  onFail
});
export const purchaseItemsSuccess = (params: any) => ({
  type: PURCHASE_ITEMS_SUCCESS,
  params
});

export const getPurchasedItems = () => ({
  type: GET_PURCHASED_ITEMS,
});
export const getPurchasedItemsSuccess = (params: any) => ({
  type: GET_PURCHASED_ITEMS_SUCCESS,
  params
});

export const purchaseEnergy = (receipt: any, transactionId: any) => ({
  type: PURCHASE_ENERGY,
  receipt,
  transactionId
});
