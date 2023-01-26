

// by: Leo Pawel 	<https://github.com/galaxy126>
declare module '*.jpg' {
	import { ImageSourcePropType } from 'react-native';
	const value: ImageSourcePropType;
	export default value;
  }
  declare module '*.png' {
	import { ImageSourcePropType } from 'react-native';
	const value: ImageSourcePropType;
	export default value;
  }
declare module 'react-native-snap-carousel'
declare module 'react-native-paper' // // declare module 'react-native-svg'
declare module 'lodash'

declare module "*.svg" {
	import { SvgProps } from "react-native-svg";
	const content: React.FC<SvgProps>;
	export default content;
}

declare interface ResponseDataType {
	data:	{
		description?:	string // return data of response
	}
	message:			string // message of response
}


declare interface UserDataType {
	id:					number // userId saved in system
	userName:			string // name of the user
	email:				string // email address of the user
	emailVerified:		number // Is the email verified(1)
	picture:			string // image of the user
	locale:				string // locale of the user
	subscriber:			string // Unique key for the user
	registerTime:		number // Time stamp of user created time.
	bindingSNS:			boolean // already binding SNS or not
}

declare interface GameDataType {
	id:				 	number // GameId saved in system
	nid:				string //     游戏版本号
	name:				string //     游戏名
	shortName:			string // 游戏短名
	category:			string // 	游戏分类
	slogan:				string // 标题下短句
	description:		string // 中篇描述
	introduction:		string // 详细页用长篇介绍
	iconUrl:			string // icon
	faviconUrl:			string // small favicon
	screenshot:			string // list of 5 pics
	coverImageUrl:		string // 封面图片
	email:				string // 游戏CP公司邮箱
	company:			string // Company name of the game.
	twitter:			string // Company twitter.
	facebook:			string // facebook
	line:				string // line
	cdnUrl:				string // Cdn download url.
	gameServerUrl:		string // 游戏服务器Url
	callbackUrl:		string // Call back url.
	state:				number // 游戏状态 0 准备，1 测试， 2　公开
	highlightType:		number // 列表中的高亮，Normal\New\Hot
	orderWeight:		number // 游戏列表中排列顺序
	secret:				string // 游戏验证用secret，与id并用
	createTimestamp:	number // created:  time.
}


declare interface GameItemDataType {
	id:					number // Id of the game item.
	gameId:				number // Id of the game.
	name:				string // name of the item
	pictureUrl:			string // url of the picture
	kokoPrice:			number // koko price of this item.
}

declare interface UserGameItemDataType {
	id:					number // id of the record
	gameId:				number // id of the game
	gameItemId:			number // id of the game Item
	kokoPrice:			number // koko price of the item
	gameItemName:		string // name of this item
}

declare interface TournamentClassDataType {
	id:					number // TournamentClassId saved in system
	gameId:				number // game id
	tournamentName:		string // name of the tournament class
	thumbnail:			string // thumbnail image url
	coverImageUrl:		string // cover image url
	description:		string // description
	type:				number // type of the tournament class,0 half hour, 1 midnight run, 2 king of the night, 3 practise
	startTime:			string // start time of the tournament, format 'HH:mm:ss'
	durationSecond:		number // tournament duration time
	durationPlaySecond:	number // tournament play duration time
	entryBeforeSecond:	number // 最终入场倒计时
	entryFee:			number // 入场价格
	participantNumber:	number // 入场人数限制
	rankingPayout:		string // 根据排名可以获取的回报
	keyword:			string // 关键词
	tag:				string // 标签，使用逗号分割
}

declare interface RuleDataType {
	startRank: string
    endRank: string
    payout: number
}

declare interface MatchClassDataType {
	id:					number // TournamentClassId saved in system
	gameId:				number // game id
	matchName:			string // name of the tournament class
	thumbnail:			string // thumbnail image url
	coverImageUrl:		string // cover image url
	description:		string // match description
	type:				number // type of the match class,-1 practise, 0 PVP
	matchingSecond:		number // PVP match matching duration time (匹配时效)
	durationSecond:		number // match duration time
	entryFee:			number // 入场价格
	winningPayout:		number // 取胜后可以获取的回报
	keyword:			string // 关键词
	tag:				string // 标签，使用逗号分割
}

declare interface TournamentDataType {
	id:					number // TournamentId saved in system
	tournamentClassId:	number // TournamentClassId saved in system
	tournamentName:		string // name of the tournament class
	gameId:				number // game id(同class）
	startTime:			string // start time of the tournament, format 'HH:mm:ss'(同class）
	durationSecond:		number // tournament duration time(同class）
	entryBeforeSecond:	number // 最终入场倒计时(同class）
	entryFee:			number // 入场价格(同class）
	participantNumber:	number // 入场人数限制(同class）
	rankingPayout:		string // 根据排名可以获取的回报(同class）
	keyword:			string // 关键词(同class）
	tag:				string // 标签，使用逗号分割(同class）
	newestJoinPlayers:	PlayerInfoDataType[]
	joinPlayersCount:	number // 当前锦标赛最近已经加入的参赛者总数
}

declare interface TournamentPlayDataType {
	id: 				number // Tournament play id saved in system
	tournamentId: 		number // TournamentClassId saved in system
	tournamentName: 	string // name of the tournament class
	userName:		 	string // name of the user.
	gameId:		 		number // game id(同class）
	score:		 		number // 最终score
	finalRank:		 	number // 最终排名，练习赛无排，人数不满也没有，只有最后结算成功的tournament play才有
}


declare interface GamePlayDataType {
	id:					number // Tournament play id saved in system
	tournamentId:		number // TournamentClassId saved in system
	matchId:			string // matchId of the PVP match
	tournamentName:		string // name of the tournament class
	matchName:			string // name of the match
	userName:			string // name of the user.
	gameId:				number // game id(同class）
	score:				number // 最终score
	finalRank:			number // 最终排名，练习赛无排，人数不满也没有，只有最后结算成功的tournament play才有
	energy:				number // 得到或者消耗的能量
	kokoAmount:			number // winning koko amount of the match.
	result:				string // tournament或者match结果(WIN;LOSE;DRAW)
	picture:			string // 列表展示图片
	timestamp:			number // timestamp of the tournament or match Timestamp
	type:				number // type of item view(0:tournament; 1:match PVP)
}

declare interface EnergyProductDataType {
	id:					number // product id
	platform:			string // google apple web
	productName:		string // Name of the product in the platform.
	jpyPrice:			number // JPY quoted price.
	energy:				number // total energy in this product.
}

// 	description:		调用上账接口，查询到上账结果
declare interface PurchaseResultDataType {
	receiptId:			string // 系统内部保存的账单id
	receipt:			string // 调用时上传的账单原文
	platform:			string // 充值平台
	productId:			number // 服务器解析出来的productId
	state:				number // 支付校验状态，0为pending，1为failed，2为success
}

// description:		game matching session result
declare interface MatchingResultDataType {
	sessionId:			string // 	id of the matching session.
}


// description:			users of the game（tournament/match/blockedUsers）
declare interface PlayerInfoDataType {
	id:					number
	username: 			string // username of the user.
	picture: 			string // portrait of the user.
	subscriber: 		string // subscriber of the user.
	createTime: 		number // Time stamp of created time.
}
// description:		game matching session result
declare interface MatchingSessionDataType {
	matchId: 			string // matchId of the matching game.
	users:				PlayerInfoDataType[]			// user list of the matching game.
}

// description:		player score info of the match result.
declare interface MatchPlayerInfoDataType{
	username:			string // username of the match player.
	picture:			string // portrait of the match player.
	subscriber:			string // subscriber of the match player.
	totalScore:			number // user score of the match player.
	state:				number // state of the match.
	result:				string // result(W/L/D) for the match.
}

// description:		match result
declare interface MatchResultDataType {
	matchId:			string // matchId of the match.
	result:				string // result(W/L/D) of the match.
	state:				number // state of the match.
	energy:				number // cost energy of the match.
	kokoAmount:			number // winning koko amount of the match.
	players:			MatchPlayerInfoDataType[] // players list of the match.
}

// description:		user balance info
declare interface BalanceInfoDataType {
	address:			string // address of user koko account.
	confirmed:			string // confirmed quantity of user koko account.
	unconfirmed:		string // unconfirmed quantity of user koko account.
}

declare interface GameAuthDataType {
	token:				string // Temporary uuid for game to call api.
	publicKey:			string // publicKey for uplaod game data with encrypt
}

declare interface SocialLoginType {
	name: string
	url: string
}

declare interface HistoryDropdownDataType {
	label: string
	value: string
}

declare interface HistoryDataType {
	matchName: string
	tournamentName: string
	energy: string
	kokoAmount: string
	timestamp: string
}

declare interface EnergyIOSProduct {
	identifier: string
    price: number
    energy: number
}



declare interface ReduxActionDefaultParamDataType {
	params?: any|null|undefined,
	onSuccess?: ((result: any) => void)|null|undefined,
	onFail?: ((error: any) => void)|null|undefined
}

