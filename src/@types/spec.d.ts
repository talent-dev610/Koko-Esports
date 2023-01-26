import { Timestamp } from "firebase/firestore";
import { ColorValue, GestureResponderEvent } from "react-native";

declare interface ActionSheetItemDataType {
	label:              string
	color?:             ColorValue|undefined
	onPress:            (event: GestureResponderEvent) => void
}

declare interface ChatMessageDataType {
	author: {
		id: 			number
		picture: 		string
		userName: 		string
	}
	body:				string
	sentAt:				Timestamp
}

declare interface ChatMemberDetailDataType {
	id:					number
	picture:			string
	userName:			string
}

declare interface ChatThreadDataType {
	threadID:			string
	createdAt:			Timestamp
	lastSentAt:			Timestamp
	lastSentAuthorId:	number
	members:			number[]
	membersDetail:		ChatMemberDetailDataType[]
	name:				string
	type:				string
}

declare interface BlockedUserDataType {
	id:					number
	username:			string
	picture:			string
	subscriber:			string
	createTime:			number
}