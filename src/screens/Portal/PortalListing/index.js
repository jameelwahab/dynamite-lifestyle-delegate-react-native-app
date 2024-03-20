import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyText from '../../../components/MyText'
import RootView from '../../../components/RootView'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { DELETE_PORTAL_EVENT, GET_PORTAL_LIST, DUBLICATE_PORTAL_EVENT } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { S3_URL } from '../../../utilities/constants'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import { colors } from '../../../utilities/colors'
import routes from '../../../navigation/routes'
import FAB from '../../../components/FAB'
import OptionModal from '../../../components/OptionModal'
import { MenuButton } from '../../../components/MyButton'
import { icons } from '../../../utilities/icons'
import ConfirmationModal from '../../../components/ConfirmationModal'

const EventListing = ({ navigation, route }) => {
  const { key } = route?.params;
  const isDelegatePortals = key == "my_portals";
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const title = useState(navbar?.find(x => x.value == key)?.title);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([])
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  })
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    selectedItem: null,
    title: "",
    type: ''
  })

  const onOptionSelected = (opt) => {
    let item = optionModal?.selectedItem;
    setOptionModal({ isVisible: false, selectedItem: null });
    setTimeout(() => {
      if (opt.type == "edit") {
        onAddEditScreen(item)
      } else if (opt.type == "delete") {
        setTimeout(() => {
          setConfirmModal({
            isVisible: true,
            selectedItem: item,
            title: "Are you sure you want to delete this event?",
            type: opt.type
          })
        }, 200);
      } else if (opt.type == "dublicate") {
        setTimeout(() => {
          setConfirmModal({
            isVisible: true,
            selectedItem: item,
            title: "Are you sure you want to dublicate this event?",
            type: opt.type
          })
        }, 200);
      } else if (opt.type == "lock") {
        navigation.navigate(routes.portalLockSettings, {
          config: item?.lock_configration,
          slug: item?.event_slug
        })
      } else if (opt.type == "timer") {
        navigation.navigate(routes.portalTimerSettings, {
          config: item?.event_timer_configration,
          slug: item?.event_slug
        })
      } else if (opt.type == "import") {
        navigation.navigate(routes.portalAddMembers, {
          eventId: item?._id
        })
      } else if (opt.type == "event") {
        navigation.navigate(routes.portalEventsList, {
          eventId: item?._id,
          slug: item?.event_slug
        })
      } else if (opt.type == "members") {
        navigation.navigate(routes.portalMembersList, {
          eventId: item?._id,
          slug: item?.event_slug
        })
      }
    }, 200);
  }

  const onAgree = () => {
    let { selectedItem: item, type } = confirmModal;
    console.log(item, "item")
    if (type == "delete") {
      deletePortalEventFromServer(item.event_slug);
    } else if (type == "dublicate") {
      dublicatePortalEvent(item._id);
    }
    setConfirmModal({ isVisible: false, selectedItem: null, title: "", type: "" })
  }

  const getDataFromServer = async () => {
    let res = await GET_PORTAL_LIST({ navigation, token, createdBy: !isDelegatePortals ? "admin" : "" });
    if (res.code == 200) {
      setList(res?.dynamite_events)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }


  const deletePortalEventFromServer = async (slug) => {
    setLoader(true);
    let res = await DELETE_PORTAL_EVENT({ navigation, token, eventSlug: slug });
    if (res.code == 200) {

      setList((list) => {
        return list.filter(x => x.event_slug != slug)
      });
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const dublicatePortalEvent = async (id) => {
    setLoader(true);
    let res = await DUBLICATE_PORTAL_EVENT({ navigation, token, eventId: id });
    if (res.code == 200) {
      getDataFromServer()
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    getDataFromServer()
  }, [route]);


  const ammendList = (item) => {
    let index = list.findIndex(x => x._id == item._id);
    if (index > -1) {
      list.splice(index, 1, item);
    } else {
      list.push(item);
    }
    setList([...list]);
  }


  const onPortalDetailScreen = (item) => {
    navigation.navigate(routes?.portalDetailScreen, {
      eventId: item?._id,
      feedFor: "event"
    })
  }

  const onAddEditScreen = (item) => {
    navigation.navigate(routes?.portalAddEdit, {
      item,
      backScreenFunc: ammendList
    })
  }


  const renderEvent = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => onPortalDetailScreen(item)}
        style={__style.itemView}>

        <ResponsiveImage2
          uri={S3_URL + item?.images?.thumbnail_1}
        />

        <View style={__style.itemSecondaryView}>
          <View style={__style.itemTitleView}>
            <MyText color={colors.primary} fontSize={18} type='bold' >{item?.title}</MyText>
          </View>
          <View style={__style.itemDescriptionView}>
            <MyText fontSize={14}>{item?.short_description}</MyText>
          </View>
        </View>
        {isDelegatePortals &&
          <MenuButton
            onPress={() => setOptionModal({ isVisible: true, selectedItem: item })}
            style={__style.menuBtn} />}
      </Pressable>

    )
  }


  return (
    <RootView title={title} hideBackBottomButton>
      <View style={{ flex: 1 }}>

        <FlatList
          data={list}
          renderItem={renderEvent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />


      </View>
      {isDelegatePortals &&
        <FAB
          onPress={() => onAddEditScreen()}
        />}

      <OptionModal
        optionList={options}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={() => setOptionModal({ isVisible: false, selectedItem: null })}

      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({ isVisible: false, selectedItem: null, title: "", type: "" })}
        onAgree={onAgree}
        title={confirmModal?.title}
      />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default EventListing

const __style = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 15
  },
  itemSecondaryView: {
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  itemTitleView: {

  },
  itemDescriptionView: {
    marginTop: 10
  },
  menuBtn: {
    position: "absolute",
    right: 10,
    top: 10
  }
})

const options = [
  {
    icon: () => icons.edit(colors.primary, 17),
    title: "Edit",
    type: "edit"
  },
  {
    icon: () => icons.trash(colors.primary, 17),
    title: "Delete",
    type: "delete"
  },
  {
    icon: () => icons.lock(colors.primary, 17),
    title: "Lock Event Content",
    type: "lock"
  },
  {
    icon: () => icons.download(colors.primary, 17),
    title: "Import Members",
    type: "import"
  },
  {
    icon: () => icons.clock(colors.primary, 17),
    title: "Event Timer Configuration",
    type: "timer"
  },
  // {
  //   icon: () => icons.category(colors.primary, 17),
  //   title: "Categories",
  //   type: "categories"
  // },
  {
    icon: () => icons.members(colors.primary, 17),
    title: "Members",
    type: "members"
  },
  {
    icon: () => icons.calendar(colors.primary, 17),
    title: "Events",
    type: "event"
  },
  {
    icon: () => icons.copy(colors.primary, 17),
    title: "Dublicate",
    type: "dublicate"
  },
]

