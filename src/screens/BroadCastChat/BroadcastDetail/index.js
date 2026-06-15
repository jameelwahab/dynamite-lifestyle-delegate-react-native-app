import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import routes from '../../../navigation/routes';
import {GET_BROADCAST_CHAT_DETAIL} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import MemberView from '../../../components/MemberView';
import MyLoader, {SimpleLoader} from '../../../components/MyLoader';
import {colors} from '../../../utilities/colors';
import {icons} from '../../../utilities/icons';
import EmptyView from '../../../components/EmptyView';
import {STRINGS} from '../../../utilities/strings';
import {Flex} from '../../../UIComponents/FlexViews';

let page = 0;
let canLoadMore = false;
const BroadcastDetail = ({navigation, route}) => {
  const {chatId} = route?.params;
  const {token} = useSelector(selectUser);
  const [chatName, setChatName] = useState('');
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [broadcast, setBroadcast] = useState(null);

  useEffect(() => {
    page = 0;
    canLoadMore = false;
    setLoader(true);
    getBroadcastDetailFromServer(true);
  }, [route]);

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getBroadcastDetailFromServer();
    }
  };

  const getBroadcastDetailFromServer = async (newArray = false) => {
    let res = await GET_BROADCAST_CHAT_DETAIL({
      navigation,
      token,
      chatId,
      page,
    });

    if (res.code == 200) {
      let length = newArray
        ? res?.broadcast_members.length
        : list.length + res?.broadcast_members.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }

      setChatName(res?.broadcast?.broadcast_title);
      setList(
        newArray
          ? res?.broadcast_members
          : [...list, ...res?.broadcast_members],
      );
      setBroadcast(res?.broadcast);
      setLoader(false);
      setFooterLoader(false);
    }
  };

  const listview = ({item, index}) => {
    return (
      <View style={__style.listItem}>
        <MemberView
          borderColor={
            item?.membership_level_badge_info?.membership_level_badge_id
              ?.color_code
          }
          member={item}
          size={35}
          titleSize={14}
        />
      </View>
    );
  };

  const topView = () => {
    return (
      <View style={__style.topViewContainer}>
        <View style={__style.flex1}>
          <MyText isHeading>{chatName}</MyText>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(routes.broadcastStartNewChat, {
              broadcast,
              setChatName: route?.params?.setChatName,
            })
          }
          style={__style.editButton}>
          {icons.editpencil(colors.black, 18)}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <RootView titleView={topView}>
      <Flex flex={1}>
        <FlatList
          data={list}
          renderItem={listview}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          ListEmptyComponent={
            !loader && (
              <EmptyView label={STRINGS.BROADCAST_DETAIL.noMemberFound} />
            )
          }
          ListFooterComponent={
            <View style={__style.footerContainer}>
              {footerLoader && <SimpleLoader />}
            </View>
          }
        />
      </Flex>
      <MyLoader enable={loader} />
    </RootView>
  );
};

const __style = StyleSheet.create({
  listItem: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  flex1: {
    flex: 1,
  },
  editButton: {
    borderRadius: 25 / 2,
    height: 25,
    width: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    height: 50,
    alignItems: 'center',
  },
});

export default BroadcastDetail;
