import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { DELETE_AUTOMATED_GROUP, GET_AUTOMATED_GROUP_LIST, } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import EmptyView from '../../../components/EmptyView'
import { colors } from '../../../utilities/colors'
import { fonts } from '../../../utilities/fonts'
import { MenuButton, MyButton2 } from '../../../components/MyButton'
import StatView from '../../../components/StatView'
import FAB from '../../../components/FAB'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import routes from '../../../navigation/routes'
import { icons } from '../../../utilities/icons'
import MyRefreshControl from '../../../components/MyRefreshControl'
import showToast from '../../../functions/showToast'
import SearchView from '../../../components/SearchView'

const GroupList = ({ navigation, route }) => {
  const { item: mission } = route?.params;
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [options, setOptions] = useState({ isVisible: false, item: null });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null })
  const [searchText, setSearchText] = useState("")


  useEffect(() => {
    setLoader(true);
    getGroupsLists()
  }, [])



  const onRefresh = () => {
    setRefreshing(true);
    getGroupsLists()
  }
  // * Options functions

  const onAgree = () => {
    let { item } = confirmation;
    setConfirmation({ isVisible: false, item: null })
    setTimeout(() => {
      deleteGrpFromServer(item)
    }, 350);
  }

  const onSelected = (opt) => {
    let { item } = options;
    setOptions({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "edit") {
        navigation.navigate(routes.automatedGrpAddEdit, { group: item, parentObj: mission, ammendList })
      } else if (opt.key == "delete") {
        setTimeout(() => {
          setConfirmation({ isVisible: true, item: item })
        }, 350)
      } else if (opt.key == "detail") {
        onGrpDetail(item)
      }
    }, 400);
  }


  const ammendList = (group) => {
    let index = list.findIndex(x => x?._id == group._id);
    if (index > -1) {
      list.splice(index, 1, group);
    } else {
      list.unshift(group);
    }
    setList([...list]);
  }


  const onGrpDetail = (group) => {
    navigation.navigate(routes.automatedGrpDetail, { type: mission?.type, title: group?.title, slug: group?.group_slug })
  }

  //! APIs

  const getGroupsLists = async (search) => {
    let res = await GET_AUTOMATED_GROUP_LIST({ token, navigation, id: mission?._id, type: mission?.type })
    setLoader(false);
    setRefreshing(false)
    if (res.code == 200) {
      setList(res?.group)
    }
  }

  const deleteGrpFromServer = async (grp) => {
    let res = await DELETE_AUTOMATED_GROUP({ navigation, token, slug: grp?.group_slug });
    setLoader(false);
    setRefreshing(false)
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      setList((list) => list.slice().filter(x => x._id != grp._id))
    }
  }



  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' capitalize color={value ? colors.green : colors.delete} >
          {value ? "Active" : "Inactive"}
        </MyText>
      </View>)
  }





  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onGrpDetail(item)}
        style={__styles.itemView}>
        <View style={__styles.titleRow}>
          <View style={__styles.titleView}>
            <MyText type='medium' >
              <MyText type='medium' color={colors.primary} >{(index + 1)})  </MyText>
              {item?.title}</MyText>
          </View>
          <MenuButton
            onPress={() => setOptions({ isVisible: true, item: item })}
          />
        </View>
        <View style={__styles.statView}>



          <StatView title={"Start Day"} value={item?.automated_group_start_day} />
          <StatView title={"End Day"} value={item?.automated_group_end_day} />
          <StatView title={"Status"} view={() => statusView(item?.status)} />
        </View>
      </Pressable>
    )
  }

  const filterBySearch = (list) => {
    return list.slice().filter(x => x?.title.toLowerCase().includes(searchText.trim().toLowerCase()))
  }


  const headerView = () => {
    return (
      <View style={{ backgroundColor: colors.darkSecondary }}>
        <SearchView
          search={searchText}
          onChangeText={(text) => setSearchText(text)}
          hideBtn
        />
      </View>
    )
  }


  return (
    <RootView
      title={"Automated Groups"}
      subTitle={mission?.title} >
      <View style={{ flex: 1 }}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={filterBySearch(list)}
          ListHeaderComponent={headerView()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView data={"No Groups found"} />}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        />
      </View>
      <MyLoader enable={loader} />

      <FAB
        onPress={() => navigation.navigate(routes.automatedGrpAddEdit, { group: undefined, parentObj: mission, ammendList })}
      />

      

      <OptionModal
        isVisible={options.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptions({ isVisible: false, item: null })}
      />

      <ConfirmationModal
        title={"Are you sure you want to delete this Automated Group?"}
        isVisible={confirmation.isVisible}
        onAgree={onAgree}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}
      />


    </RootView>
  )
}

export default GroupList

const includeMembersObj = {
  "active": {
    title: "Active Members",
    value: "active"
  },
  "all": {
    title: "All Members",
    value: "all"
  },
}




const optionsList = [

  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },
  {
    title: "View Members",
    key: "detail",
    icon: icons.members2
  },

]


const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    paddingTop: 5,
    marginTop: 10,
    borderRadius: 10
  },
  titleRow: {
    flexDirection: "row",
    marginTop: 5
  },
  titleView: {
    flex: 1
  },
  statView: {
    marginTop: 5
  },
  topHeaderView: {
    backgroundColor: colors.darkSecondary,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 10,
  },
  heading_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.darkSecondary,
    marginHorizontal: 10
  },
  heading_font: {
    color: colors.primary,
    // fontFamily: fonts.semiBold,
    fontSize: 18,
    includeFontPadding: false,
    textTransform: "capitalize",
    fontFamily: fonts.bold,
    includeFontPadding: false
  },
  filterButton: {
    height: "100%",
    justifyContent: "center",
    // width: 50,
    alignItems: "center",
    flexDirection: "row",
    // borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    // paddingHorizontal: 15,
    // paddingVertical: 8
  },
  clear_btn: {
    marginLeft: 5,
    marginTop: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.primary + "33"
  }
})
