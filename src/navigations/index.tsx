import React, { useEffect, memo } from 'react';
import { BackHandler, Platform } from 'react-native';
import { connect } from 'react-redux';
import { KokoApp } from "./AppContainer";

interface KokoNavigationProps {
  dispatch: any
  nav: any
}

const KokoNavigation = memo(({dispatch, nav}: KokoNavigationProps) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', () => undefined);
    }
  }, []);

  return (
    <KokoApp dispatch={dispatch} state={nav} />
  );
});

const mapStateToProps = (state: { nav: any; }) => ({nav: state.nav});

export default connect(mapStateToProps)(KokoNavigation);
