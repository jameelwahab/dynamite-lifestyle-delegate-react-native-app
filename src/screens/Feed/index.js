import React from 'react';
import RootView from '../../components/RootView';
import FeedScreen from './FeedScreen';

const Feed = props => {
  return (
    <RootView hideSubHeader>
      {/* <FeedTabs/> */}

      <FeedScreen {...props} />
    </RootView>
  );
};

export default Feed;
