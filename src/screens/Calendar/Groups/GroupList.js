import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { GET_CALENDAR_GROUPS_LIST } from '../../../DAL'
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

const GroupList = ({ navigation, route }) => {
  const { key, parentKey } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [options, setOptions] = useState({ isVisible: false, item: null });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null })


  useEffect(() => {
    setLoader(true);
    getCalendarGroupsLists()
  }, [])


  // * Options functions

  const onAgree = () => {
    let { item } = confirmation;
    setConfirmation({ isVisible: false, item: null })
    setTimeout(() => {

    }, 350);
  }

  const onSelected = (opt) => {
    let { item } = options;
    setOptions({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "edit") {
        navigation.navigate(routes.calendarGroupAddEdit, { group: item })
      } else if (opt.key == "delete") {
        setConfirmation({ isVisible: true, item: item })
      }
    }, 400);
  }


  //! APIs

  const getCalendarGroupsLists = async () => {
    setLoader(true);
    let res = await GET_CALENDAR_GROUPS_LIST({ navigation, token });
    setLoader(false);
    if (res.code == 200) {
      setList(res?.group)
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

  const eventView = (list) => {
    return (
      <View style={{ paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        {list.map((x, i) => (
          <MyText>{x?._id?.title},</MyText>
        ))}
      </View>)
  }



  const renderItem = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
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
          <StatView title={"Programme/Event"} view={() => eventView(item?.group_by == "event" ? item?.event : item?.program)} />
          <StatView title={"Type"} value={item?.group_type} />
          <StatView title={"Group By"} value={groupBy[item?.group_by]} />
          <StatView title={"Members"} value={item?.member.length} />
          <StatView title={"Status"} view={() => statusView(item?.status)} />
        </View>
      </View>
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
        />
      </View>
      <MyLoader enable={loader} />

      <FAB
        onPress={() => navigation.navigate(routes.calendarGroupAddEdit, { group: undefined })}
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
  program: "Programme"
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