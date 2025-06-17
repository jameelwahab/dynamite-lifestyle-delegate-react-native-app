import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import Tabs from '../../../components/Tabs'
import { EXCLUDE_GROUP_MEMBERS, GET_AUTOMATED_GROUP_DETAIL, GET_AUTOMATED_GROUP_MEMBERS_LIST, } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import UserImage from '../../../components/UserImage'
import StatView from '../../Members/Components/StatView'
import MemberView from '../../../components/MemberView'
import FooterLoader from '../../../components/FooterLoader'
import EmptyView from '../../../components/EmptyView'
import OptionModal from '../../../components/OptionModal'
import { MyButton, MyButton2, TransparentButton } from '../../../components/MyButton'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import routes from '../../../navigation/routes'
import SearchView from '../../../components/SearchView'
import MyCheckBox from '../../../components/MyCheckBox'
import FAB from '../../../components/FAB'
import { icons } from '../../../utilities/icons'
import ConfirmationModal from '../../../components/ConfirmationModal'
import capitalize from '../../../functions/capitalize'
import showToast from '../../../functions/showToast'


const GroupDetail = ({ navigation, route }) => {
  const paging = useRef({ gdPage: 0, gdCanLoadMore: false })
  const { group, slug, title, type } = route?.params;
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(true);
  const [loader1, setLoader1] = useState(true);
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
    setLoader1(true);
    getGrpDetail();
    getGrpAllMember();
  }, [])


  const toggleChecked = (item) => {
    if (!!checked[item?._id]) {
      delete checked[item?._id]
    } else {
      checked[item?._id] = item;
    }
    setChecked({ ...checked })
  }


  const changeTab = (tab) => {
    setTabIndex(tab);
    setSearchText("")
    if (tab == 0) {
      paging.current.gdPage = 0;
      paging.current.gdCanLoadMore = false;
      setAllMembers([])
      setLoader1(true)
      getGrpAllMember(true)
    }
  }

  const loadMore = () => {
    if (paging.current.gdCanLoadMore && tabIndex == 0) {
      paging.current.gdCanLoadMore = false;
      setFooterLoader(true);
      getGrpAllMember(false,)
    }
  }

  const onSearchPress = () => {
    paging.current.gdPage = 0
    paging.current.gdCanLoadMore = false;
    setSearchLoader(true);
    getGrpAllMember(true)

  }
  //! APIs

  const getGrpDetail = async () => {
    let res = await GET_AUTOMATED_GROUP_DETAIL({ navigation, token, slug, });
    setLoader(false)
    setFooterLoader(false);
    setSearchLoader(false);
    if (res.code == 200) {
      setData(res)
    }
  }

  const getGrpAllMember = async (newArray = false) => {
    let res = await GET_AUTOMATED_GROUP_MEMBERS_LIST({
      navigation, token,
      slug,
      page: paging.current.gdPage,
      type: "all",
      searchText: searchText.trim()
    });
    if (res.code == 200) {
      let length = newArray ? res?.group_members.length : allMembers.length + res?.group_members.length;
      if (length < res?.total_count) {
        paging.current.gdPage++;
        paging.current.gdCanLoadMore = true;
      } else {
        paging.current.gdCanLoadMore = false;
      }
      setLoader1(false);
      setFooterLoader(false);
      setSearchLoader(false);
      setAllMembers(newArray ? res?.group_members : [...allMembers, ...res?.group_members]);
    } else {
      setLoader1(false);
      setFooterLoader(false);
      setSearchLoader(false);
    }
  }

  const excludeMembers = async () => {
    setShowConfirmModal(false)
    let res = await EXCLUDE_GROUP_MEMBERS({
      navigation, token, slug, type: "group",
      members: Object.keys(checked).map(x => ({ _id: x })),
    });
    setLoader(false)
    if (res.code == 200) {
      getGrpDetail?.()
      showToast({ title: res?.message, type: "success" })
      setAllMembers((list) => list.slice().filter(x => !checked[x._id]))
      setChecked({})
    }
  }






  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.listRootView}>
        <View style={__styles.titleRow}>

          <View style={{ flex: 1, }}>
            <MemberView
              member={item}
              size={40}
            />
          </View>
          {tabIndex == 0 &&
            <MyCheckBox
              value={!!checked[item?._id]}
              onPress={() => toggleChecked(item)}
              pb={0}
            />}
        </View>
      </View>
    )
  }

  const searchView = () => {
    return (<View style={{ marginHorizontal: 5 }}>
      <SearchView
        search={searchText}
        onChangeText={(text) => setSearchText(text)}
        hideBtn={tabIndex == 1}
        onSearchPress={onSearchPress}
        loader={searchLoader}
      />
    </View>)
  }

  const searchFromList = (list, type) => {
    let stext = searchText.trim().toLowerCase()
    if (tabIndex == 1) {
      if (stext == "") {
        return list
      } else {
        return list.slice().filter(x => {
          if ((x.first_name + " " + x?.last_name).toLowerCase().includes(stext) || x.email.toLowerCase().includes(stext)) {
            return true
          } else return false
        })
      }
    }
  }


  return (
    <RootView title={title}>
      <View style={{ flex: 1 }}>
        {searchView()}
        <Tabs
          tab={tabIndex}
          changeTab={changeTab}
          list={tablist(group?.group_by)}
        />
        <View style={{ flex: 1 }}>
          <FlatList
            data={tabIndex == 1 ? searchFromList(data?.excluded_members) :
              (tabIndex == 0) ? allMembers : []
            }
            renderItem={renderList}
            contentContainerStyle={{ paddingBottom: 50 }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
            ListEmptyComponent={!loader && !loader1 && <EmptyView />}
            keyExtractor={(item) => item?._id + tabIndex}
            onEndReached={loadMore}
          />
        </View>
      </View>
      <MyLoader enable={loader || loader1} />

      {tabIndex == 0 && Object.keys(checked).length > 0 &&
        <FAB
          icon={() => icons.trashFilled(colors.black)}
          onPress={() => setShowConfirmModal(true)}
          title="Exclude Members"
        />}



      <ConfirmationModal
        isVisible={showConfirmModal}
        closeModal={() => setShowConfirmModal(false)}
        onAgree={excludeMembers}
        title={"Are you sure you want to exclude these members?"}
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
  let list = [
    {
      key: "0",
      title: "ALL MEMBER LIST",
      index: 0,
      type: "all"
    },
    {
      key: "1",
      title: "EXCLUDED MEMBER LIST",
      index: 1,
      type: "exclude"
    },

  ]
  return list
}