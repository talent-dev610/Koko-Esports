import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import styles from "./styles";
import BackButton from "../../../../components/BackButton";
import "../../../../utils/i18n";
import { useTranslation } from "react-i18next";
import BlockListItem from "../../../../components/main/profile/BlockListItem";
import * as reduxAuthActions from '../../../../redux/actions/authActions';
import { getBlockedUsers } from "../../../../redux/selectors";
import colors from "../../../../theme/colors";
import ActionSheet from "../../../../components/ActionSheet";
import { ActionSheetItemDataType } from "../../../../@types/spec";

interface BlockListScreenProps {
  navigation?: any
  authActions: any
  blockedUsers: any
}

const BlockListScreen = ({navigation, authActions, blockedUsers}: BlockListScreenProps) => {
  const { t } = useTranslation();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const actionItems: ActionSheetItemDataType[] = [
    {
      label: t("profile.unblock"),
      color: colors.red,
      onPress: () => unblock(),
    }
  ];

  const onBackPress = () => {
    navigation.goBack();
  };

  const onMore = (user: any) => {
    setSelectedUser(user);
    setShowActionSheet(true);
  };

  const unblock = () => {
    setShowActionSheet(false);
    authActions.unblockUser(selectedUser.id);
  };

  const onCancel = () => {
    setShowActionSheet(false);
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={onBackPress} style={styles.backButton} />
      <Text style={styles.title}>{t('profile.blockList')}</Text>
      <FlatList
        style={styles.list}
        data={blockedUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <BlockListItem style={{ padding: 10 }} user={item} onMore={() => onMore(item)}/>
        )} />
      <Modal transparent={true} visible={showActionSheet} animationType="fade" >
        <ActionSheet
          actionItems={actionItems}
          onCancel={onCancel}
        />
      </Modal>
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    blockedUsers: getBlockedUsers(state)
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    authActions: bindActionCreators(reduxAuthActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockListScreen);
