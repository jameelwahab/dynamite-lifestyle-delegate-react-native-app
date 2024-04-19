import { View, Text, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { POD_DETAIL_V1, POD_ROOM_USER_LIST } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../utilities/colors'
import GrpList from './component/GrpList'
import ZoomCred from './component/ZoomCred'
import MemberList from './component/MemberList'
import SearchView from '../../components/SearchView'
import utilities from '../../utilities'



let page = 0;
let canLoadMore = false;

const PodDetail = ({ navigation, route }) => {
  const { slug, type } = route.params;
  const isBookCall = type == "booking";
  const { token } = useSelector(selectUser);
  const layout = useWindowDimensions();
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [pod, setPod] = useState(null);
  const [members, setMembers] = useState([]);
  const [roomUser, setRoomUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [routes] = React.useState(isBookCall ? bookCalltabs : podtabs);
  const [index, setIndex] = React.useState(0);
  const [searchLoader, setSearchLoader] = useState(false);



  useEffect(() => {
    getPodDetailFromServer()
  }, [])


  useEffect(() => {
    if ((isBookCall && (index == 1) || (!isBookCall && (index == 2 || index == 3)))) {
      setLoader(true)
      getPodMemberAndRoomUsers(true, false)
    }
  }, [index])


  //! APIs

  const getPodDetailFromServer = async () => {
    setLoader(true)
    let res = await POD_DETAIL_V1({ navigation, token, slug })
    if (res.code == 200) {
      setPod(res);
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const getPodMemberAndRoomUsers = async (newArray = false, canSearch = true) => {
    let search = canSearch ? searchText : "";
    let res = await POD_ROOM_USER_LIST({ navigation, token, page, slug, type: index == 2 ? "individual" : "all", searctText: search.trim() });
    if (res.code == 200) {
      let listLength = ((isBookCall && index == 1) || (!isBookCall && index == 2)) ? members.length : roomUser.length;
      let length = newArray ? res?.room_user.length : listLength + res?.room_user.length;
      if (length < res?.total_count) {
        page++;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      if ((isBookCall && index == 1) || (!isBookCall && index == 2)) {
        setMembers(newArray ? res?.room_user : [...members, ...res?.room_user]);
      }
      else if (!isBookCall && index == 3) {
        setRoomUsers(newArray ? res?.room_user : [...roomUser, ...res?.room_user]);
      }
      setLoader(false);
      setFooterLoader(false);
      setSearchLoader(false);
    } else {
      setLoader(false)
      setFooterLoader(false);
      setSearchLoader(false);
    }
  }

  const loadMore = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true);
      getPodMemberAndRoomUsers()
    }
  }

  const onSearchPress = () => {
    page = 0;
    canLoadMore = false;
    setSearchLoader(true);
    getPodMemberAndRoomUsers(true)
  }

  //* ...../////////   Views






  //todo ...../////////   Tabs


  const renderTabBar = props => (

    <TabBar
      {...props}
      scrollEnabled={true}
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
      tabStyle={{ width: "auto", }}
      renderLabel={({ route, focused, color }) => {
        return (
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title}
          </MyText>
        )
      }}
      gap={10}
    />
  );

  const searchInListGrp = (list) => {

    if (!isBookCall && index == 0) {
      if (searchText.trim() == "") {
        return list;
      } else {
        return list.slice().filter(x => {
          let textForSearch = (x?.title + x.member.length).toLowerCase();
          let textToSearch = searchText.toLowerCase();
          return textForSearch.includes(textToSearch)
        })

      }
    }
  }

  const searchInListZoom = (list) => {
    if ((!isBookCall && index == 1) || (isBookCall && index == 0)) {
      if (searchText.trim() == "") {
        return list;
      } else {
        return list.slice().filter(x => {
          let textForSearch = (x.password).toLowerCase();
          let textToSearch = searchText.toLowerCase();
          return textForSearch.includes(textToSearch)
        })
      }
    }
  }

  const renderScene1 = ({ route, }) => {


    switch (route.key) {
      case 'grplist':
        return <GrpList list={searchInListGrp(pod?.room_groups)} loader={loader} />
      case 'zoom':
        return <ZoomCred
          loader={loader}
          list={searchInListZoom([{
            link: pod?.room?.zoom_link,
            password: pod?.room?.password,
          }])} />
      case 'members':
        return <MemberList list={members} loadmore={loadMore} footerLoader={footerLoader} loader={loader} />
      case 'users':
        return <MemberList list={roomUser} loadmore={loadMore} footerLoader={footerLoader} loader={loader} />
    }


  }

  return (
    <RootView title={pod?.room?.title} >

      <SearchView
        hideBtn={((!isBookCall && (index == 0 || index == 1) || (isBookCall && index == 0)))}
        onChangeText={(text) => setSearchText(text)}
        search={searchText}
        onSearchPress={onSearchPress}
        loader={searchLoader}
      />

      <View style={{ flex: 1, marginHorizontal: -10 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene1}
          onIndexChange={(index) => {
            canLoadMore = false
            page = 0;
            setSearchText("")
            setIndex(index);
            setMembers([])
            setRoomUsers([]);
            if (isBookCall) {
              if (index == 1) {
                setLoader(true)
              }
            } else {
              if (index == 2 || index == 3) {
                setLoader(true)
              }
            }
          }}
          initialLayout={{ width: layout.width }}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default PodDetail


const bookCalltabs = [
  { key: 'zoom', title: 'ZOOM CREDENTIAL', index: 0 },
  { key: 'members', title: 'INDIVIDUAL MEMBER', index: 1 },

]

const podtabs = [
  { key: 'grplist', title: 'GROUP LIST', index: 0 },
  { key: 'zoom', title: 'ZOOM CREDENTIAL', index: 1 },
  { key: 'members', title: 'INDIVIDUAL MEMBER', index: 2 },
  { key: 'users', title: 'ROOM USERS', index: 3 },
]
