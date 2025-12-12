import {View, Text} from 'react-native';
import React from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import FeedScreen from './FeedScreen';

const Detail = props => {
  return (
    <RootView>
      <FeedScreen {...props} feedId={props?.route?.params?.feedId} />
    </RootView>
  );
};

export default Detail;
