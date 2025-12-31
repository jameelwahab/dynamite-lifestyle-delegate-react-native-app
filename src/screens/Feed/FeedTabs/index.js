import {View, FlatList, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {useSelector} from 'react-redux';
import {selectSettings} from '../../../redux/reducers/settingSlice';
import HeaderBanner from './HeaderBanner';
import {selectUser} from '../../../redux/reducers/userSlice';

const FeedTabs = ({
  isCosmos,
  changeTab,
  tab,
  CustomTabs,
  isScheduleFeedTabAllowed,
}) => {
  const menuRef = useRef();
  const {settings} = useSelector(selectSettings);
  const {user} = useSelector(selectUser);

  // useEffect(() => {
  //   setTimeout(() => {
  //     menuRef?.current?.scrollToIndex({
  //       index: tab,
  //       animated: true
  //     })
  //   }, 200);

  // }, [tab])

  return (
    <View style={{marginHorizontal: -10}}>
      {!!settings?.the_cosmos_banner_image && isCosmos && (
        <HeaderBanner image={settings?.the_cosmos_banner_image} user={user} />
      )}
      <View style={{height: 50, marginTop: 5}}>
        <FlatList
          // contentContainerStyle={{ paddingHorizontal: 10 }}
          data={
            !!CustomTabs
              ? isScheduleFeedTabAllowed
                ? tabsForEventsWithSchedule.concat(CustomTabs)
                : tabsForEvents.concat(CustomTabs)
              : isCosmos
              ? tabsForCosmos
              : tabsForSource
          }
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={menuRef}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  menuRef?.current?.scrollToIndex({
                    index: index,
                    animated: true,
                  });
                  // setTimeout(() => {
                  changeTab(item.index);
                  // }, 100);
                }}
                style={{justifyContent: 'center', paddingHorizontal: 10}}>
                <MyText
                  fontSize={15}
                  type={item.index == tab ? 'medium' : 'regular'}
                  color={
                    item.index == tab ? colors.primary2 : colors.lightText
                  }>
                  {item.title}
                </MyText>

                <View
                  style={{
                    borderRadius: 10,
                    marginTop: 3,
                    height: 3,
                    backgroundColor:
                      item.index == tab ? colors.primary : colors.transparent,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default FeedTabs;

const tabsForCosmos = [
  {title: 'FEEDS', key: 'feed', index: 0},
  {title: 'NOTICE BOARD & EVENTS', key: 'events', index: 1},
  {title: 'LEADERBOARD', key: 'leaderboard', index: 2},
];

const tabsForSource = [
  {title: 'FEEDS', key: 'feed', index: 0},
  {title: 'NOTICE BOARD & EVENTS', key: 'events', index: 1},
  {title: 'PAGES', key: 'page', index: 2},
];

const tabsForEvents = [
  {title: 'FEEDS', key: 'feed', index: 0},
  {title: 'EVENTS', key: 'events', index: 1},
];
const tabsForEventsWithSchedule = [
  {title: 'FEEDS', key: 'feed', index: 0},
  {title: 'YOUR SCHEDULED FEEDS', key: 'schedule_feed', index: 2},
  {title: 'EVENTS', key: 'events', index: 1},
];
