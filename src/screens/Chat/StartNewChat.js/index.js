import { View, Text, Keyboard, SafeAreaView, Pressable, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import MyTouchableInput from '../../../components/MyTouchableInput'
import MyInputs from '../../../components/MyInputs'
import Modal from 'react-native-modal'
import { MEMBERS_LIST, PORTAL_LIST } from '../../../DAL'
import utilities from '../../../utilities'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { TabBar, TabView } from 'react-native-tab-view'
import Memberlist from './Memberlist'
import debounce from '../../../functions/debounce'
import MyLoader from '../../../components/MyLoader'
import showToast from '../../../functions/showToast'
import EmptyView from '../../../components/EmptyView'

const StartNewChat = ({ navigation, route }) => {
  const { resetCountToZero, refresh } = route?.params;
  const { token, user } = useSelector(selectUser);
  const [portalList, setPortalList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [members, setMembers] = useState({ offline: [], online: [] });
  const [searchText, setSearchText] = useState("");
  const [eventId, setEventId] = useState({ ...noneObj })
  const [isPortalModalVisible, setPortalModalVisiblity] = useState(false);
  const [index, setIndex] = useState(0)
  const [routes] = React.useState(tabs);
  const layout = useWindowDimensions();

  const api_portalList = async () => {

    let res = await PORTAL_LIST({ navigation, token })
    if (res.code == 200) {
      setPortalList([{ ...noneObj }, ...res?.member_dynamite_event]);
    }
  }

  const api_membersList = async () => {
    let res = await MEMBERS_LIST({ navigation, token, data: { event_id: eventId._id, search_text: searchText.trim() } })
    if (res.code == 200) {
      setLoader(false)
      setMembers({
        offline: res?.members_list_offline,
        online: res?.members_list
      })
    } else {
      setLoader(true)
    }
  }


  useEffect(() => {
    api_portalList()
  }, [])

  useEffect(() => {
    debounce(api_membersList)
  }, [searchText.trim(), eventId?._id])


  const portalModal = () => {
    return (
      <Modal
        isVisible={isPortalModalVisible}
        onBackButtonPress={() => setPortalModalVisiblity(false)}
        onBackdropPress={() => setPortalModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}
        animationInTiming={300}
        animationOutTiming={300}
      >
        <SafeAreaView style={{ marginTop: "auto", backgroundColor: colors.secondary, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <View style={{ height: utilities.screenHeight() * 0.8, }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
              <View>
                <MyText fontSize={18} type='medium' >Portal Events</MyText>
                <MyText color={colors.lightText} fontSize={12}>Select your event from list below</MyText>
              </View>
              <Pressable
                onPress={() => setPortalModalVisiblity(false)}
              >
                {icons.crosssWithCircle()}
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>

              <FlatList
                data={portalList}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setEventId(item);
                        setPortalModalVisiblity(false)
                      }}
                      style={[{ paddingVertical: 12, justifyContent: "center", paddingHorizontal: 10 }, {
                        backgroundColor: eventId?._id == item._id ? colors.secondarySelect : undefined
                      }]} >

                      <MyText>{item?.title}</MyText>

                    </TouchableOpacity>
                  )
                }}
              />

            </View>
          </View>
        </SafeAreaView>

      </Modal>)
  }


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <MyInputs
          leftIcon={icons.search}
          placeholder='Search...'
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          rightIcon={!!searchText.trim() ? icons.crosssWithCircle_20 : icons.noIcon}
          rightIconOnPress={() => {
            Keyboard.dismiss()
            setSearchText("")
          }}
        />
        <MyTouchableInput
          onPress={() => setPortalModalVisiblity(true)}
          noSpace={true}
          value={eventId.title}
          label='Portals' />
      </View>)
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{
        backgroundColor: colors.darkSecondary,
        shadowColor: colors.lightText2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      }}
      renderLabel={({ route, focused, color }) => (
        <>
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title}
          </MyText>
        </>
      )}
    />
  );

  const renderScene = ({ route }) => {

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
      />)
  }





  return (
    <RootView
      hideChatIcon
      title='New Message'>
      {headerView()}
      {portalModal()}
      <View style={{ flex: 1 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            setIndex(index);
          }}
          initialLayout={{ width: layout.width }}
        />
      </View>

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default StartNewChat
let noneObj = {
  _id: "",
  title: "None"
}


const tabs = [
  { key: 'online', title: 'Online', index: 0 },
  { key: 'offline', title: 'Offline', index: 1 },
];