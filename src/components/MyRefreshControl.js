import {RefreshControl} from 'react-native';
import React from 'react';
import {colors} from '../utilities/colors';

const MyRefreshControl = ({
  refreshing = false,
  onRefresh = () => {},
  ...props
}) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
      tintColor={colors.white}
      {...props}
    />
  );
};

export default MyRefreshControl;
