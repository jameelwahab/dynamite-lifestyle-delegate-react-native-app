import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import Tabs from '../../../components/Tabs'
import { EXCLUDE_GROUP_MEMBERS, GET_CALENDAR_ALL_MEMBER, GET_CALENDAR_DETAIL } from '../../../DAL'
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
import MyCheckBox from '../../../components/MyCheckBox'
import FAB from '../../../components/FAB'
import { icons } from '../../../utilities/icons'
import ConfirmationModal from '../../../components/ConfirmationModal'

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
  const [checked, setChecked] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    setLoader(true);
    getGrpDetail();
  }, [])


  const toggleChecked = (item) => {
    if (!!checked[item?._id]) {
      delete checked[item?._id]
    } else {
      checked[item?._id] = item;
    }
    setChecked({ ...checked })
  }

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
    if (tab == 3 || tab == 2) {
      gdPage = 0;
      gdCanLoadMore = false;
      setAllMembers([])
      setLoader(true)
      getGrpAllMember(true, tab)
    }
  }

  const loadMore = () => {
    if (gdCanLoadMore && (tabIndex == 3 || tabIndex == 2)) {
      gdCanLoadMore = false;
      setFooterLoader(true);
      getGrpAllMember(false,)
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

  const getGrpAllMember = async (newArray = false, tIndex) => {
    let res = await GET_CALENDAR_ALL_MEMBER({
      navigation, token, page: gdPage,
      slug: group?.group_slug,
      type: !!tIndex ? tablist()[tIndex]?.type : tablist()[tabIndex]?.type,
      searchText: searchText.trim()
    });
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

  const excludeMembers = async () => {
    setShowConfirmModal(false)
    let res = await EXCLUDE_GROUP_MEMBERS({
      navigation, token, slug: group?.group_slug,
      members: Object.keys(checked).map(x => ({ _id: x })),
      type: "group"
    });
    setLoader(false)
    if (res.code == 200) {
      setAllMembers((list) => {
        !list.slice().filter(x => !checked[x._id])
      })
      setChecked({})
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
          {group?.group_by == "sale_page" ?
            <>
              <StatView title={"Sale Page Title"} value={item?.sale_page_title} />
              <StatView title={"Payment Plan"} value={!!data?.plans && data?.plans?.map(x => {
                if (x?.sale_page == item?._id) {
                  return `${x?.plan_title},`
                }
              })} />
            </> :
            <>
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
            </>}
        </View>)
    else {
      return (
        <View style={__styles.listRootView}>
          <View style={__styles.titleRow}>

            <View style={{ flex: 1, }}>
              <MemberView
                member={item}
                size={40}
              />
            </View>
            {tabIndex == 3 &&
              <MyCheckBox
                value={!!checked[item?._id]}
                onPress={() => toggleChecked(item)}
              />}
          </View>
          <View>
            {/* <StatView title={grptype[group?.group_by]?.title} view={() => eventView(item?.[grptype[group?.group_by]?.variable])} /> */}
            {group?.group_by == "program" ?
              <StatView title={"Programmes"} view={() => eventView(item?.program)} /> :
              <StatView title={"Events"} view={() => eventView(item?.event)} />}

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
        hideBtn={tabIndex != 3}
        onSearchPress={onSearchPress}
        loader={searchLoader}
      />
    </View>)
  }

  const searchFromList = (list, type) => {
    let stext = searchText.trim().toLowerCase()
    if (stext == "") {
      return list
    } else {
      if (tabIndex == 0) {
        if (type == "sale_page") {
          return list.slice().filter(x => x.title.toLowerCase().includes(stext))
        } else {
          return list.slice().filter(x => x.sale_page_title.toLowerCase().includes(stext))
        }
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
            data={tabIndex == 0 && group?.group_by == "program" ? searchFromList(data?.group_programs, group?.group_by) :
              tabIndex == 0 && group?.group_by == "event" ? searchFromList(data?.group_events, group?.group_by) :
                tabIndex == 0 && group?.group_by == "sale_page" ? searchFromList(data?.sale_pages, group?.group_by) :
                  tabIndex == 1 ? searchFromList(data?.group_members) :
                    (tabIndex == 2 || tabIndex == 3) ? allMembers : []
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

      {tabIndex == 3 && Object.keys(checked).length > 0 &&
        <FAB
          icon={() => icons.trashFilled(colors.black)}
          onPress={() => setShowConfirmModal(true)}
        />}

      <ConfirmationModal
        isVisible={showConfirmModal}
        closeModal={() => setShowConfirmModal(false)}
        onAgree={excludeMembers}
        title={"Are you sure you want to exclude these members?"}
      />

      <OptionModal
        isVisible={detailModal.isVisible}
        closeModal={() => setDetailModal({ isVisible: false, list: [] })}
        optionList={detailModal.list}
        multiple
        multipleLabel={grptype[group?.group_by]?.title}
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

const grptype = {
  "program": {
    tab: "PROGRAMMES LIST",
    title: "Programmes",
    variable: "program"
  },
  "event": {
    tab: "EVENTS LIST",
    title: "Events",
    variable: "event"
  },
  "sale_page": {
    tab: "SALE PAGES LIST",
    title: "Sale Pages",
    variable: "event"
  },
}

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
      title: grptype[type]?.tab,
      index: 0
    },
    {
      key: "1",
      title: "GROUP INDIVIDUAL MEMBER LIST",
      index: 1
    },
    {
      key: "2",
      title: "EXCLUDED MEMBER LIST",
      index: 2,
      type: "exclude"
    },
    {
      key: "3",
      title: "ALL MEMBER LIST",
      index: 3,
      type: "all"
    }
  ]
}