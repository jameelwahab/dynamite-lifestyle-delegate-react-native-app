import {
  View,
  Keyboard,
  SafeAreaView,
  Pressable,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {icons} from '../../../utilities/icons';
import {colors} from '../../../utilities/colors';
import MyTouchableInput from '../../../components/MyTouchableInput';
import Modal from 'react-native-modal';
import {MEMBERS_LIST, PORTAL_LIST} from '../../../DAL';
import utilities from '../../../utilities';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {TabBar, TabView} from 'react-native-tab-view';
import Memberlist from './Memberlist';
import debounce from '../../../functions/debounce';
import MyLoader from '../../../components/MyLoader';
import MyInputs from '../../../components/MyInputs';
import {Flex} from '../../../UIComponents/FlexViews';
import {STRINGS} from '../../../utilities/strings';

const StartNewChat = ({navigation, route}) => {
  const {resetCountToZero, refresh} = route?.params;
  const {token} = useSelector(selectUser);
  const [portalList, setPortalList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [members, setMembers] = useState({offline: [], online: []});
  const [searchText, setSearchText] = useState('');
  const [eventId, setEventId] = useState({...noneObj});
  const [isPortalModalVisible, setPortalModalVisiblity] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = React.useState(tabs);
  const layout = useWindowDimensions();

  const api_portalList = async () => {
    let res = await PORTAL_LIST({navigation, token});
    if (res.code == 200) {
      setPortalList([{...noneObj}, ...res?.member_dynamite_event]);
    }
  };

  const api_membersList = async () => {
    let res = await MEMBERS_LIST({
      navigation,
      token,
      data: {event_id: eventId._id, search_text: searchText.trim()},
    });
    if (res.code == 200) {
      setLoader(false);
      setMembers({
        offline: res?.members_list_offline,
        online: res?.members_list,
      });
    } else {
      setLoader(true);
    }
  };

  useEffect(() => {
    api_portalList();
  }, []);

  useEffect(() => {
    debounce(api_membersList);
  }, [searchText.trim(), eventId?._id]);

  const portalModal = () => {
    return (
      <Modal
        isVisible={isPortalModalVisible}
        onBackButtonPress={() => setPortalModalVisiblity(false)}
        onBackdropPress={() => setPortalModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        style={styles.modalStyle}
        animationInTiming={300}
        animationOutTiming={300}>
        <SafeAreaView style={styles.modalSafeArea}>
          <View
            style={[
              styles.modalContent,
              {height: utilities.screenHeight() * 0.8},
            ]}>
            <View
              style={[
                styles.modalHeader,
                {borderBottomColor: colors.lightText},
              ]}>
              <View>
                <MyText fontSize={18} type="medium">
                  {STRINGS.START_NEW_CHAT.PORTAL_EVENTS}
                </MyText>
                <MyText color={colors.lightText} fontSize={12}>
                  {STRINGS.START_NEW_CHAT.SELECT_EVENT}
                </MyText>
              </View>
              <Pressable onPress={() => setPortalModalVisiblity(false)}>
                {icons.crosssWithCircle()}
              </Pressable>
            </View>

            <View style={styles.flex}>
              <FlatList
                data={portalList}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setEventId(item);
                        setPortalModalVisiblity(false);
                      }}
                      style={[
                        styles.portalItem,
                        {
                          backgroundColor:
                            eventId?._id == item._id
                              ? colors.secondarySelect
                              : undefined,
                        },
                      ]}>
                      <MyText>{item?.title}</MyText>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  const headerView = () => {
    return (
      <View
        style={[
          styles.headerContainer,
          {backgroundColor: colors.darkSecondary},
        ]}>
        <MyInputs
          leftIcon={icons.search}
          placeholder={STRINGS.START_NEW_CHAT.SEARCH_PLACEHOLDER}
          value={searchText}
          onChangeText={text => setSearchText(text)}
          rightIcon={
            !!searchText.trim() ? icons.crosssWithCircle_20 : icons.noIcon
          }
          rightIconOnPress={() => {
            Keyboard.dismiss();
            setSearchText('');
          }}
        />
        <MyTouchableInput
          onPress={() => setPortalModalVisiblity(true)}
          noSpace={true}
          value={eventId.title}
          label={STRINGS.START_NEW_CHAT.PORTALS}
        />
      </View>
    );
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={[styles.tabIndicator, {backgroundColor: colors.primary}]}
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.darkSecondary,
          shadowColor: colors.lightText2,
        },
      ]}
      renderLabel={({route, focused, color}) => (
        <>
          <MyText
            color={focused ? colors.primary : colors.lightText}
            type="medium">
            {route.title}
          </MyText>
        </>
      )}
    />
  );

  const renderScene = ({route}) => {
    return (
      <Memberlist
        key={route.key}
        list={route.key == 'online' ? members?.online : members?.offline}
        loader={loader}
        statusColor={route.key == 'online' ? colors.online : colors.primary2}
        navigation={navigation}
        token={token}
        resetCountToZero={resetCountToZero}
        refresh={refresh}
      />
    );
  };

  return (
    <RootView hideChatIcon title={STRINGS.START_NEW_CHAT.TITLE}>
      {headerView()}
      {portalModal()}
      <Flex flex={1}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={index => {
            setIndex(index);
          }}
          initialLayout={{width: layout.width}}
        />
      </Flex>

      <MyLoader enable={loader} />
    </RootView>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
  },
  modalSafeArea: {
    marginTop: 'auto',
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalContent: {},
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1 / 3,
  },
  flex: {
    flex: 1,
  },
  portalItem: {
    paddingVertical: 12,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerContainer: {},
  tabIndicator: {},
  tabBar: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export default StartNewChat;
let noneObj = {
  _id: '',
  title: STRINGS.START_NEW_CHAT.NONE,
};

const tabs = [
  {key: 'online', title: STRINGS.START_NEW_CHAT.ONLINE, index: 0},
  {key: 'offline', title: STRINGS.START_NEW_CHAT.OFFLINE, index: 1},
];
