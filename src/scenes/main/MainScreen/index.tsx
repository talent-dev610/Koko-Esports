import React, {useState, useEffect} from 'react';
import { Modal, Platform, TouchableOpacity, View } from "react-native";
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './styles';
import KokoStatusBar from '../../../components/KokoStatusBar';
import HomeTabItem from '../../../components/main/HomeTabItem';
import HomeScreen from '../home/HomeScreen';
import StoreScreen from '../store/StoreScreen';
import ProfileScreen from '../profile/ProfileScreen';
import {
  isFirstLaunch,
  isLoggedIn,
  setLaunched,
} from '../../../redux/utils/localDataManager';

import {
  GO_TO_HOME,
  GO_TO_STORE,
  REFRESH_CHAT_MESSAGES,
} from '../../../events/types';
import * as reduxAppActions from '../../../redux/actions/appActions';
import * as reduxChatActions from '../../../redux/actions/chatActions';
import TutorialDialog from '../../../components/TutorialDialog';
import Chat from '../../../../assets/images/chat.svg';
import ChatUnreadDot from '../../../components/chat/ChatUnreadDot';
import {getUnreadCount} from '../../../redux/selectors';
import {calcUnreadMessagesThreads} from '../../../utils/chatUtils';
import firestore from '@react-native-firebase/firestore';
import {CHAT_THREAD_COLLECTION, ChatType} from '../../../consts/chatConfig';
import {isChatTimeRecentUpdated} from '../../../utils/stringUtils';
import BagImage from '../../../../assets/images/bag.png';
import HomeImage from '../../../../assets/images/home.png';
import UserImage from '../../../../assets/images/user.png';
import EventBus from "react-native-event-bus";

const HomeTabs = {Store: 'Store', Home: 'Home', Profile: 'Profile'};

interface MainScreenProps {
  navigation?: any
  appActions: any
  chatActions: any
  unreadMessages: any[]
}

const MainScreen = ({navigation, appActions, chatActions, unreadMessages}: MainScreenProps) => {
  const [tab, setTab] = useState(HomeTabs.Home);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    isFirstLaunch().then(value => setShowTutorial(value));
    appActions.loadAppData();
    EventBus.getInstance().addListener(
      GO_TO_STORE,
      (data: any) => {
        onStorePressed();
      },
    );
    EventBus.getInstance().addListener(
      GO_TO_HOME,
      (data: any) => {
        onHomePressed();
      },
    );
    firestore()
      .collection(CHAT_THREAD_COLLECTION)
      .onSnapshot(snapshot => {
        onChatThreadUpdated(snapshot);
      });
  }, []);

  const onChatThreadUpdated = (snapshot: any) => {
    snapshot.docChanges().forEach((change: any) => {
      const data = change.doc.data();
      const recentUpdated = isChatTimeRecentUpdated(data.lastSentAt);
      if (recentUpdated) {
        const type =
          data.type === 'PUBLIC'
            ? ChatType.Room
            : data.type === 'DM'
            ? ChatType.DM
            : ChatType.CS;
        chatActions.fetchChatThreads(type);
        EventBus.getInstance().fireEvent(REFRESH_CHAT_MESSAGES, {
          thread: change.doc.id,
        });
      }
    });
  };

  const onStorePressed = () => {
    isLoggedIn().then(value => {
      if (value) {
        setTab(HomeTabs.Store);
      } else {
        navigation.navigate('LoginScreen');
      }
    });
  };

  const onHomePressed = () => {
    setTab(HomeTabs.Home);
  };

  const onUserPressed = () => {
    isLoggedIn().then(value => {
      if (value) {
        setTab(HomeTabs.Profile);
      } else {
        navigation.navigate('LoginScreen');
      }
    });
  };

  const onGetStarted = () => {
    setShowTutorial(false);
    // setLaunched();
  };

  const onChatPress = () => {
    isLoggedIn().then(value => {
      if (value) {
        navigation.navigate('ChatScreen');
      } else {
        navigation.navigate('LoginScreen');
      }
    });
  };

  return (
    <View style={styles.container}>
      <KokoStatusBar />
      <View style={{flex: 1}}>
        {tab === HomeTabs.Store && (
          <StoreScreen navigation={navigation} />
        )}
        {tab === HomeTabs.Home && <HomeScreen navigation={navigation} />}
        {tab === HomeTabs.Profile && (
          <ProfileScreen navigation={navigation} />
        )}
      </View>
      <View style={[styles.tab, {height: Platform.OS === 'ios' ? 100 : 80}]}>
        <HomeTabItem
          image={BagImage}
          isSelected={tab === HomeTabs.Store}
          onPress={onStorePressed}
        />
        <HomeTabItem
          image={HomeImage}
          isSelected={tab === HomeTabs.Home}
          onPress={onHomePressed}
        />
        <HomeTabItem
          image={UserImage}
          isSelected={tab === HomeTabs.Profile}
          onPress={onUserPressed}
        />
      </View>
      <TouchableOpacity onPress={onChatPress} style={styles.chat}>
        <Chat width={60} height={60} />
        {calcUnreadMessagesThreads(unreadMessages, []) > 0 && (
          <ChatUnreadDot style={styles.unreadDot} />
        )}
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={showTutorial}
        animationType="fade"
        onRequestClose={() => {
          setShowTutorial(false);
        }}>
        <TutorialDialog onGetStarted={onGetStarted} />
      </Modal>
    </View>
  );
};

const mapStateToProps = (state: any) => {
  return {
    unreadMessages: getUnreadCount(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    appActions: bindActionCreators(reduxAppActions, dispatch),
    chatActions: bindActionCreators(reduxChatActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
