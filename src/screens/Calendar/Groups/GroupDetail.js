import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import Tabs from '../../../components/Tabs'
import { GET_CALENDAR_ALL_MEMBER, GET_CALENDAR_DETAIL } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import UserImage from '../../../components/UserImage'
import StatView from '../../Members/Components/StatView'
import MemberView from '../../../components/MemberView'
import FooterLoader from '../../../components/FooterLoader'
import EmptyView from '../../../components/EmptyView'
import OptionModal from '../../../components/OptionModal'
import { TransparentButton } from '../../../components/MyButton'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import routes from '../../../navigation/routes'
import SearchView from '../../../components/SearchView'

let gdPage = 0;
let gdCanLoadMore = false;

const GroupDetail = ({ navigation, route }) => {
  const { group } = route?.params;
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")
  const [tabIndex, setTabIndex] = useState(0)
  const [data, setData] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [footerLoader, setFooterLoader] = useState(false);
  const [detailModal, setDetailModal] = useState({ isVisible: false, list: [] })
  const [searchLoader, setSearchLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    getGrpDetail();
  }, [])


  const onSelected = (item) => {
    setDetailModal({ isVisible: false, list: [] });
    setTimeout(() => {
      if (group?.group_by == "program") {
        navigation.reset({
          routes: [{
            name: routes.trainingNavigator,
            state: {
              routes: [{
                name: routes.traininglist,
              },
              {
                name: routes.trainingDetail,
                params: { slug: item?._id?.program_slug }
              }],
            }
          }],
        })
      } else {
        navigation.reset({
          routes: [{
            name: routes.portalNavigator,
            state: {
              routes: [{
                name: routes.portalListScreen,
              },
              {
                name: routes.portalDetailScreen,
                params: {
                  eventId: item?._id?._id,
                  feedFor: "event"
                }
              }],
            }
          }],
        })
      }

      // navigation.reset({
      //   index: 1,
      //   routes: [
      //     {
      //       name: routes.traininglist,
      //     },
      //     {
      //       name: routes.trainingDetail,
      //       params: { slug: item?.program_slug }
      //     }
      //   ]
      // })
    }, 500);
  }
  const changeTab = (tab) => {
    setTabIndex(tab);
    setSearchText("")
    if (tab == 2) {
      gdPage = 0;
      gdCanLoadMore = false;
      setAllMembers([])
      setLoader(true)
      getGrpAllMember(true)
    }
  }

  const loadMore = () => {
    if (gdCanLoadMore && tabIndex == 2) {
      gdCanLoadMore = false;
      setFooterLoader(true);
      getGrpAllMember()
    }
  }

  const onSearchPress = () => {
    gdPage = 0
    gdCanLoadMore = false;
    setSearchLoader(true);
    getGrpAllMember(true)

  }
  //! APIs

  const getGrpDetail = async () => {
    let res = await GET_CALENDAR_DETAIL({ navigation, token, slug: group?.group_slug });
    setLoader(false)
    setFooterLoader(false);
    setSearchLoader(false);
    if (res.code == 200) {
      setData(res)
    }
  }

  const getGrpAllMember = async (newArray = false) => {
    let res = await GET_CALENDAR_ALL_MEMBER({ navigation, token, page: gdPage, slug: group?.group_slug, searchText: searchText.trim() });
    if (res.code == 200) {
      let length = newArray ? res?.group_members.length : allMembers.length + res?.group_members.length;
      if (length < res?.total_count) {
        gdPage++;
        gdCanLoadMore = true;
      } else {
        gdCanLoadMore = false;
      }
      setLoader(false);
      setFooterLoader(false);
      setSearchLoader(false);
      setAllMembers(newArray ? res?.group_members : [...allMembers, ...res?.group_members]);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setSearchLoader(false);
    }
  }


  //* Views

  const eventView = (list) => {
    let nlist = list.slice().filter(x => !!x?._id);
    return (
      <View style={{ paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        {nlist.map((x, i) => {
          if (i < 5)
            return (
              <View key={x?._id?._id + tabIndex} >
                <MyText  >{x?._id?.title},</MyText>
              </View>
            )
        })}
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => setDetailModal({ isVisible: true, list: nlist })} >
          <MyText underlined color={colors.primary} >View More</MyText>
        </TouchableOpacity>
      </View>)
  }




  const renderList = ({ item, index }) => {
    if (tabIndex == 0)
      return (
        <View style={__styles.listRootView}>
          <View style={__styles.titleRow}>
            <UserImage
              image={group?.group_by == "program" ? item?.program_images?.thumbnail_1 : item?.images?.thumbnail_1}
              name={item?.title}
              size={40}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <MyText >{item?.title}</MyText>
            </View>
          </View>
          <View>
            {/* <MyText>{item?.short_description}</MyText> */}
            <StatView title={"Description"} value={item?.short_description} />
          </View>
        </View>)
    else if (tabIndex == 1 || tabIndex == 2) {
      return (
        <View style={__styles.listRootView}>
          <View style={__styles.titleRow}>
            <MemberView
              member={item}
              size={40}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <MyText >{item?.title}</MyText>
            </View>
          </View>
          <View>
            {group?.group_by == "program" ?
              <StatView title={"Programmes / Events"} view={() => eventView(item?.program)} /> :
              <StatView title={"Programmes / Events"} view={() => eventView(item?.event)} />}

          </View>
        </View>
      )
    }
  }

  const searchView = () => {
    return (<View style={{ marginHorizontal: 5 }}>
      <SearchView
        search={searchText}
        onChangeText={(text) => setSearchText(text)}
        hideBtn={tabIndex != 2}
        onSearchPress={onSearchPress}
        loader={searchLoader}
      />
    </View>)
  }

  const searchFromList = (list) => {
    let stext = searchText.trim().toLowerCase()
    if (stext == "") {
      return list
    } else {
      if (tabIndex == 0) {
        return list.slice().filter(x => x.title.toLowerCase().includes(stext))
      } else if (tabIndex == 1) {
        return list.slice().filter(x => {
          if ((x.first_name + " " + x?.last_name).toLowerCase().includes(stext) || x.email.toLowerCase().includes(stext)) {
            return true
          } else return false
        })
      }
    }
  }


  return (
    <RootView title={group?.title}>
      <View style={{ flex: 1 }}>
        {searchView()}
        <Tabs
          tab={tabIndex}
          changeTab={changeTab}
          list={tablist(group?.group_by)}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={tabIndex == 0 && group?.group_by == "program" ? searchFromList(data?.group_programs) :
              tabIndex == 0 && group?.group_by == "event" ? searchFromList(data?.group_events) :
                tabIndex == 1 ? searchFromList(data?.group_members) :
                  tabIndex == 2 ? allMembers : []
            }
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
            ListEmptyComponent={!loader && <EmptyView />}
            keyExtractor={(item) => item?._id + tabIndex}
            onEndReached={loadMore}
          />
        </View>
      </View>
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={detailModal.isVisible}
        closeModal={() => setDetailModal({ isVisible: false, list: [] })}
        optionList={detailModal.list}
        multiple
        multipleLabel={group?.group_by == "program" ? "Programmes" : "Events"}
        onSelected={onSelected}
        renderText={({ item }) => <View>
          <MyText fontSize={16} >{item?._id?.title}</MyText>
          <View style={{ marginTop: 3 }}>
            <MyText fontSize={12} >{`${moment(item?.purchase_date_time).format(dateTimeFormat.date)}   -   ${!!item?.expiry_date ? moment(item?.expiry_date).format(dateTimeFormat.date) : "No Expiry"}   |   Inactive`}</MyText>
          </View>
        </View>}
      />
    </RootView>
  )
}

export default GroupDetail

const __styles = StyleSheet.create({
  listRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center"
  }
})

const tablist = (type) => {
  return [
    {
      key: "0",
      title: type == "program" ? "PROGRAMMES LIST" : "EVENT LIST",
      index: 0
    },
    {
      key: "1",
      title: "MEMBER LIST",
      index: 1
    },
    {
      key: "2",
      title: "ALL MEMBER LIST",
      index: 2
    }
  ]
}