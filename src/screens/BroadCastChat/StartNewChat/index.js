import { View, Text, Keyboard, SafeAreaView, Pressable, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useEffect, useState, useSyncExternalStore } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import MyTouchableInput from '../../../components/MyTouchableInput'
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
import MyInputs from '../../../components/MyInputs'

const StartNewChat = ({ navigation, route }) => {
  const { resetCountToZero, refresh } = route?.params;
  const { token, user } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
const [title, setTitle] = useState("");
const [selectedGrps, setSelectedGrps] = useState([]);
const [selectedMembers, setSelectedMembers] = useState([]);

const [grpList, setGrpList] = useState([]);
const [membersList, setMembersList] = useState([]);











  return (
    <RootView
      hideChatIcon
      title='New Broadcast'>
      <View style={{ flex: 1,paddingHorizontal:10 }}>

        <MyInputs
          label='Title*'
        />

        <MyTouchableInput
          label='Group*'
        />

        <MyTouchableInput
          label='Member*'
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