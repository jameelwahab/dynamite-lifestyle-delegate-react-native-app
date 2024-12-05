import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { DELETE_CALENDAR_GROUP, GET_CALENDAR_GROUPS_LIST } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import EmptyView from '../../../components/EmptyView'
import { colors } from '../../../utilities/colors'
import { MenuButton } from '../../../components/MyButton'
import StatView from '../../../components/StatView'
import FAB from '../../../components/FAB'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import routes from '../../../navigation/routes'
import { icons } from '../../../utilities/icons'
import MyRefreshControl from '../../../components/MyRefreshControl'
import showToast from '../../../functions/showToast'
import SearchView from '../../../components/SearchView'
import { communityLevelWithAllObj } from '../../../utilities/constants'

const GroupList = ({ navigation, route }) => {
  const { key, parentKey } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [options, setOptions] = useState({ isVisible: false, item: null });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null })


  useEffect(() => {
    setLoader(true);
    getCalendarGroupsLists()
  }, [])

  const onRefresh = () => {
    setRefreshing(true);
    getCalendarGroupsLists()
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
        navigation.navigate(routes.calendarGroupAddEdit, { group: item, ammendList })
      } else if (opt.key == "delete") {
        setConfirmation({ isVisible: true, item: item })
      } else if (opt.key == "detail") {
        onGrpDetail(item)
      }
    }, 400);
  }


  const ammendList = (group) => {
    let index = list.findIndex(x => x?._id == group._id);
    console.log(group, index, "ammendList")
    if (index > -1) {
      list.splice(index, 1, group);
    } else {
      list.unshift(group);
    }
    setList([...list]);
  }


  const onGrpDetail = (group) => {
    navigation.navigate(routes.calendarGroupDetail, { group })
  }

  //! APIs

  const getCalendarGroupsLists = async () => {
    let res = await GET_CALENDAR_GROUPS_LIST({ navigation, token });
    setLoader(false);
    setRefreshing(false)
    if (res.code == 200) {
      setList(res?.group)
    }
  }

  const deleteGrpFromServer = async (grp) => {
    let res = await DELETE_CALENDAR_GROUP({ navigation, token, slug: grp?.group_slug });
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

  const eventView = (list, variable = "title") => {
    return (
      <View style={{ paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        {list.map((x, i) => (
          <MyText key={x?._id?._id}>{x?._id?.[variable]},</MyText>
        ))}


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
          <StatView title={groupBy[item?.group_by]+"s"}
            view={() => eventView(
              item?.group_by == "event" ? item?.event
                : item?.group_by == "program" ? item?.program
                  : item?.group_by == "sale_page" ? item?.sale_pages : [],
              item?.group_by == "sale_page" ? "sale_page_title" : "title")} />

          <StatView title={"Type"} value={item?.group_type} />
          <StatView title={"Group By"} value={groupBy[item?.group_by]} />
          <StatView title={"Members"} value={item?.member.length} />
          <StatView original title={"Community Level"} value={!!item?.community_level ? communityLevelWithAllObj[item?.community_level.toLowerCase()] : ""} />
          <StatView title={"Status"} view={() => statusView(item?.status)} />
        </View>
      </Pressable>
    )
  }



  return (
    <RootView hideBackBottomButton title={title}>
      <View style={{ flex: 1 }}>
        <FlatList

          data={list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView data={"No Groups found"} />}
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />}
        />
      </View>
      <MyLoader enable={loader} />

      <FAB
        onPress={() => navigation.navigate(routes.calendarGroupAddEdit, { group: undefined, ammendList })}
      />

      <OptionModal
        isVisible={options.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptions({ isVisible: false, item: null })}
      />

      <ConfirmationModal
        title={"Are you sure you want to delete this earning?"}
        isVisible={confirmation.isVisible}
        onAgree={onAgree}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}
      />
    </RootView>
  )
}

export default GroupList

const groupBy = {
  event: "Event",
  program: "Programme",
  sale_page: "Sale Page",
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
    title: "View Detail",
    key: "detail",
    icon: icons.threeLinesMenu
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
  }
})