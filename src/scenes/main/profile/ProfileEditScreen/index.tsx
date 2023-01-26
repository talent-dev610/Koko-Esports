import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image } from "react-native";
import { bindActionCreators } from "redux";
import BackButton from "../../../../components/BackButton";
import { connect } from "react-redux";
import styles from "./styles";
import { getUserInfo } from "../../../../redux/selectors";
import ProfileOkButton from "../../../../components/main/home/ProfileOkButton";
import UserAvatar from "../../../../components/main/profile/UserAvatar";
import { Avatars } from "../../../../consts/config";
import * as reduxAuthActions from '../../../../redux/actions/authActions';
import { errorMessage } from "../../../../utils/alerts";
import {setLaunched} from "../../../../redux/utils/localDataManager"
interface ProfileEditScreenProps {
  navigation?: any
  userInfo: any
  authActions: any
}

const ProfileEditScreen = ({navigation, userInfo, authActions}: ProfileEditScreenProps) => {
  const [name, setName] = useState(userInfo.userName);
  const [avatar, setAvatar] = useState(userInfo.picture);

  const onBackPress = () => {
    navigation.goBack();
  };

  const onUpdate = () => {
    authActions.updateUserInfo({
      params: {
        userName: name,
        picture: avatar
      },
      onSuccess: onUpdateSuccess,
      onFail: onUpdateFail
    });
  };

  const onUpdateSuccess = async() => {
    setLaunched();
    navigation.navigate('MainScreen');
   // navigation.goBack();
  };

  const onUpdateFail = () => {
    errorMessage({message: "User info update failed"});
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={onBackPress} style={styles.backButton} />
      <View style={styles.contentContainer}>
        <UserAvatar avatar={avatar} selected={true} activeOpacity={1} style = {styles.avatar}/>
        <Text style={styles.uid}>UID: {userInfo.id}</Text>
        <View style={styles.avatarGroup}>
          {
            Object.keys(Avatars).map(key => key == "0" ? <View/>:<UserAvatar avatar={key} selected={avatar === key} size={60} onPress={() => setAvatar(key)}/>)
          }
        </View>
        <TextInput
          style={styles.nameInput}
          onChangeText={setName}
          value={name}
        />
        <ProfileOkButton style={styles.submit} onPress={onUpdate}/>
      </View>
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    userInfo: getUserInfo(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    authActions: bindActionCreators(reduxAuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
