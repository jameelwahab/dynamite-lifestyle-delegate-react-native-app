import {View, Keyboard, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {icons} from '../../../utilities/icons';
import {colors} from '../../../utilities/colors';
import {GET_WHATSAPP_MEMBER_LIST} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {TabBar} from 'react-native-tab-view';
import Memberlist from './Memberlist';
import debounce from '../../../functions/debounce';
import MyLoader from '../../../components/MyLoader';
import MyInputs from '../../../components/MyInputs';
import {STRINGS} from '../../../utilities/strings';

const StartNewChat = ({navigation, route}) => {
  const {resetCountToZero, refresh, makeChatAccepted} = route?.params;
  const {token, user} = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [eventId, setEventId] = useState({...noneObj});

  const api_membersList = async () => {
    let res = await GET_WHATSAPP_MEMBER_LIST({
      navigation,
      token,
      searchText: searchText,
    });
    if (res.code == 200) {
      setLoader(false);
      setMembers(res?.members_list);
    } else {
      setLoader(true);
    }
  };

  useEffect(() => {
    debounce(api_membersList);
  }, [searchText.trim(), eventId?._id]);

  const headerView = () => {
    return (
      <View style={styles.headerContainer}>
        <MyInputs
          leftIcon={icons.search}
          placeholder={STRINGS.WHATSAPP_START_NEW_CHAT.searchPlaceholder}
          value={searchText}
          onChangeText={text => setSearchText(text)}
          rightIcon={
            !!searchText.trim() ? icons.crosssWithCircle_20 : icons.noIcon
          }
          rightIconOnPress={() => {
            Keyboard.dismiss();
            setSearchText('');
          }}
          noSpace
        />
        {/* <MyTouchableInput
          onPress={() => setPortalModalVisiblity(true)}
          noSpace={true}
          value={eventId.title}
          label='Portals' /> */}
      </View>
    );
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary}}
      style={{
        backgroundColor: colors.darkSecondary,
        shadowColor: colors.lightText2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      }}
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
        makeChatAccepted={makeChatAccepted}
      />
    );
  };

  return (
    <RootView hideChatIcon title={STRINGS.WHATSAPP_START_NEW_CHAT.title}>
      {/* {headerView()} */}
      {/* {portalModal()} */}
      <View style={styles.flexOne}>
        <Memberlist
          headerComponent={headerView}
          list={members}
          loader={loader}
          navigation={navigation}
          token={token}
          resetCountToZero={resetCountToZero}
          refresh={refresh}
          makeChatAccepted={makeChatAccepted}
        />
        {/* <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            setIndex(index);
          }}
          initialLayout={{ width: layout.width }}
        /> */}
      </View>

      <MyLoader enable={loader} />
    </RootView>
  );
};

export default StartNewChat;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.darkSecondary,
    marginTop: -15,
  },
  flexOne: {
    flex: 1,
  },
});

let noneObj = {
  _id: '',
  title: 'None',
};

const tabs = [
  {key: 'online', title: 'Online', index: 0},
  {key: 'offline', title: 'Offline', index: 1},
];
