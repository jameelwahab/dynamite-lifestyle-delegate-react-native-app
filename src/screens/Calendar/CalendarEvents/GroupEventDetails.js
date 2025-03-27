import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import Tabs from '../../../components/Tabs'
import { GET_CALENDAR_EVENT_DETAIL, CHALLENGE_EXCLUDE_MEMBER } from '../../../DAL'
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

const GroupEventDetails = ({ navigation, route }) => {
  const { group, item } = route?.params;
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
  }
  const changeTab = (tab) => {
    setTabIndex(tab);
    setSearchText("")
    if (tab == 3 || tab == 2 || tab==1) {
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
    let res = await GET_CALENDAR_EVENT_DETAIL({ navigation, token, slug: item?.event_slug, type:"group" });
    setLoader(false)
    setFooterLoader(false);
    setSearchLoader(false);
    if (res.code == 200) {
      setData(res)
    }
  }

  const getGrpAllMember = async (newArray = false, tIndex) => {
    let res = await GET_CALENDAR_EVENT_DETAIL({
      navigation, token,
      slug: item?.event_slug,
      type: !!tIndex ? tablist()[tIndex]?.type : tablist()[tabIndex]?.type,
      searchText: searchText.trim()
    });
    if (res.code == 200) {
      // let length = newArray ? res?.group_members.length : allMembers.length + res?.group_members.length;
      // if (length < res?.total_count) {
      //   gdPage++;
      //   gdCanLoadMore = true;
      // } else {
      //   gdCanLoadMore = false;
      // }
      setLoader(false);
      setFooterLoader(false);
      setSearchLoader(false);
      setAllMembers(newArray ? res?.users : [...allMembers, ...res?.users]);
    } else {
      setLoader(false);
      setFooterLoader(false);
      setSearchLoader(false);
    }
  }

  const excludeMembers = async () => {
			const memberList = Object.keys(checked).map(key=> {
					const res = {_id: key}
					return res
			} )
    setShowConfirmModal(false)
    let res = await CHALLENGE_EXCLUDE_MEMBER({
      navigation, token, slug: item?.event_slug, type:"exclude", members: memberList,
    });
    setLoader(false)
    if (res.code == 200) {
				setAllMembers( allMembers.filter(el=> !checked[el._id] && el) )
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
              <View key={i} >
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
              <StatView title={"Title"} value={item?.title} />
              <StatView title={"Group By"} value={item?.group_by + " days"} />
              <StatView title={"Programme / Event"} value={item?.sale_page_title || "N/A"} />
						  <StatView title={"Group Type"} value={item?.group_type + " days"} />
        </View>
			)
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

					{ tabIndex==1 && 
              <StatView title={"Programmes"} view={() => eventView(item?.program)} />
					}
 
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
        if (type == "sale_page" || type == "mission") {
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
    <RootView title={item?.title}>
      <View style={{ flex: 1 }}>
        {searchView()}
        <Tabs
          tab={tabIndex}
          changeTab={changeTab}
          list={tablist(group?.group_by)}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={tabIndex==0 ? data?.groups :  allMembers }
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
          icon={() => icons.members2(colors.black)}
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
        multipleLabel={"Programmes"}
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

export default GroupEventDetails

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
  "mission": {
    tab: "MISSIONS LIST",
    title: "Missions",
    variable: "mission"
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
      title: "GROUP LIST",
      index: 0
    },
    {
      key: "1",
      title: "EVENT INDIVIDUAL MEMBER LIST",
      index: 1,
      type: "individual"
    },
    {
      key: "2",
      title: "EXCLUDED MEMBER LIST",
      index: 2,
      type: "exclude"
    },
    {
      key: "3",
      title: "EVENT MEMBER LIST",
      index: 3,
      type: "all"
    }
  ]
}
