import React, {memo} from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
const FocusAwareStatusBar = props => {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
};

export default memo(FocusAwareStatusBar);
