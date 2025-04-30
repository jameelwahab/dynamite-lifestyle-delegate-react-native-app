import { View, Text, FlatList, TouchableHighlight, TouchableOpacity, SafeAreaView, Pressable, } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import { CONTACT_SUPPORT_TCIKETS_LIST_BY_TYPE, DELETE_TICKET_CONTECT_SUPPORT, MARK_RESOLVE_TICKET_CONTECT_SUPPORT } from '../../../DAL'
import MyText from '../../../components/MyText'
import UserImage from '../../../components/UserImage'
import { colors } from '../../../utilities/colors'
import moment from 'moment'
import EmptyView from '../../../components/EmptyView'
import { convertTimezone } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import FAB from '../../../components/FAB'
import { icons } from '../../../utilities/icons'
import routes from '../../../navigation/routes'
import Modal from 'react-native-modal'
import { MenuButton, MyButton, TransparentButton } from '../../../components/MyButton'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import showToast from '../../../functions/showToast'
import TitleView from '../../../components/TitleView'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import MyChip from '../../../components/MyChip'
import { dateTimeFormat } from '../../../utilities/constants'

const List = ({ navigation, route }) => {
  const { key, parentKey, } = route?.params
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const { navbar } = useSelector(selectNavbar)
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.child_options?.find(y => y._id == key)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [filter, setFilter] = useState({ isModalShown: false, value: "all", temp: "all" });
  const [options, setOptions] = useState({ isModalVisible: false, selected: null });
  const [confirmation, setConfirmation] = useState({ isModalVisible: false, title: "", selected: null, action: "" });

  const getListOfTickets = async () => {
    setLoader(true)
    let formData = new FormData();
    formData.append('filter_by', filter.value);
    let res = await CONTACT_SUPPORT_TCIKETS_LIST_BY_TYPE({ token, navigation, body: formData });
    if (res.code == 200) {
      setLoader(false)
      setList(res?.support_ticket)
    } else {
      setLoader(false)
    }
  }


  const deleteTheTicket = async (ticket) => {
    setLoader(true)
    let formData = new FormData();
    formData.append('filter_by', filter.value);
    let res = await DELETE_TICKET_CONTECT_SUPPORT({ navigation, token, ticketId: ticket?._id })
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      setLoader(false)
      let index = list.findIndex(x => x._id == ticket._id);
      if (index > -1) {
        list.splice(index, 1);
        setList(list)
      }
    } else {
      setLoader(false)
    }
  }

  const markResolveTheTicket = async (ticket) => {
    setLoader(true)
    let formData = new FormData();
    formData.append('filter_by', filter.value);
    let res = await MARK_RESOLVE_TICKET_CONTECT_SUPPORT({ navigation, token, ticketId: ticket?._id })
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      getListOfTickets()
    } else {
      setLoader(false)
    }
  }



  useEffect(() => {
    getListOfTickets()
  }, [filter.value])


  const optionActions = (opt) => {
    let ticket = options.selected;
    setOptions({ selected: null, isModalVisible: false });

    if (opt.key == "detail") {
      onTicketDetail(ticket);
    } else if (opt.key == "edit") {
      onTicketAddScreen(ticket)

    } else if (opt.key == "delete") {
      setTimeout(() => {
        setConfirmation({ title: "Are you sure you want to delete this Ticket?", action: "delete", isModalVisible: true, selected: ticket });
      }, 500);
    } else if (opt.key == "resolve") {
      setTimeout(() => {
        setConfirmation({ title: "Are you sure you want to mark this ticket as resolved?", action: "resolve", isModalVisible: true, selected: ticket });
      }, 500);
    }



  }

  const onAgreePress = () => {
    if (confirmation.action == "delete") {
      deleteTheTicket(confirmation.selected)
    } else if (confirmation.action == "resolve") {
      markResolveTheTicket(confirmation.selected)
    }

    setConfirmation({ title: "", action: "", isModalVisible: false, selected: null })
  }


  const refresh = () => {
    if (filter.value == "all") {
      getListOfTickets()
    } else {
      setFilter({ value: "all", temp: "all", isModalShown: false })
    }
  }

  const onTicketAddScreen = (ticket1 = null) => {
    navigation.navigate(routes.addTicket, {
      refresh: refresh,
      ticket: ticket1
    })
  }



  const onTicketDetail = (ticket) => {
    navigation.navigate(routes.supportTicketDeatail, {
      ticket: ticket,
      refreshList: refresh,
      route: getStatusOfTicket(ticket).title,
      isMine: true
    })
  }


  const getStatusOfTicket = (item) => {
    let { ticket_status: status, response_status } = item;
    if (status == 0 && response_status == 0) {
      return {
        title: "waiting",
        color: "#D4AA40",
      }
    } else if (status == 0 && response_status == 1) {
      return {
        title: "answered",
        color: "#3579F6",
      }
    } else {
      return {
        title: "solved",
        color: "#53A551",
      }
    }
  }

  const closeModal = () => setFilter({ ...filter, isModalShown: false, })
  const openModal = () => setFilter({ ...filter, isModalShown: true, temp: filter.value })

  const filterModal = () => {
    let tempSelected = filter.temp;
    return (<Modal
      isVisible={filter.isModalShown}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
    >

      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: "auto", backgroundColor: colors.secondary }}>
        {/* <View style={ModalStyle.container}> */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
          <View>
            <MyText fontSize={18} type='medium' >Filters</MyText>
            <MyText color={colors.lightText} fontSize={12}>Select your filter from list below</MyText>
          </View>
          <Pressable onPress={closeModal}>
            {icons.crosssWithCircle()}
          </Pressable>
        </View>

        <View>
          {filterList.map((item, index) => (
            <Pressable
              key={item + index}
              onPress={() => setFilter({ ...filter, temp: item })}
              style={{ padding: 15, flexDirection: "row" }}>
              <View style={{ height: 20, width: 20, borderColor: tempSelected == item ? colors.primary : colors.white, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" }}>
                {tempSelected == item &&
                  <View style={{ backgroundColor: colors.primary, height: 10, width: 10, borderRadius: 10 / 2 }} />}
              </View>
              <View style={{ marginLeft: 10 }}>
                <MyText fontSize={16} style={{ textTransform: "capitalize" }}>{item}</MyText>
              </View>
            </Pressable>
          ))}
        </View>


        <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 20, marginTop: 20 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyButton
              invert
              title='CLEAR ALL'
              onPress={() => setFilter({ isModalShown: false, temp: "all", value: "all" })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <MyButton
              invert
              title='FILTER'
              onPress={() => setFilter({ ...filter, isModalShown: false, value: filter.temp })}
            />
          </View>
        </View>
        {/* </View> */}
      </SafeAreaView>

    </Modal>)
  }


  const renderTicketList = ({ item, index }) => {
    return (
      <TouchableHighlight
        onPress={() => onTicketDetail(item)}
        // onLongPress={() => setOptions({ isModalVisible: true, selected: item })}
        // delayLongPress={400}
        style={{ marginTop: 10, borderRadius: 20 }}>

        <View style={{ padding: 15, backgroundColor: colors.secondaryVariant, borderRadius: 20 }}>

          <View style={{ paddingRight: 15, flexDirection: "row", }}>
            <View style={{ flex: 1 }}>
              <MyText numberOfLines={2} fontSize={16} type='medium' style={{ flex: 1 }} >{item?.subject}</MyText>
            </View>
            <MyText fontSize={10} style={{marginRight:5}} >
              {convertTimezone(item.support_ticket_date, timezone).fromNow()}
            </MyText>
            <View style={{ marginRight: -20, marginTop: -4 }}>
              <MenuButton
                onPress={() => setOptions({ isModalVisible: true, selected: item })}
                size={22}
              />
            </View>
          </View>



          <View style={{ flexDirection: "row", marginTop: 20, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, paddingBottom: 5 }}>
            <View style={{ flex: 0.7 }}>
              <MyText color={colors.lightText2}>ID :</MyText>
            </View>
            <View style={{ flex: 1 }}>
              <MyText type='medium' >{item.reference_number}</MyText>
            </View>
          </View>

				{/*(getStatusOfTicket(item).title=="solved" && !!item?.last_action_info) &&
          <View style={{ flexDirection: "row", marginTop: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, paddingBottom: 5 }}>
            <View style={{ flex: 0.7 }}>
              <MyText color={colors.lightText2}>Name :</MyText>
            </View>
            <View style={{ flex: 1 }}>
              <MyText type='medium'>{item?.last_action_info?.name}</MyText>
            </View>
          </View>*/
				}
          <View style={{ flexDirection: "row", marginTop: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, paddingBottom: 5 }}>
            <View style={{ flex: 0.7 }}>
              <MyText color={colors.lightText2}>Department :</MyText>
            </View>
            <View style={{ flex: 1 }}>
              <MyText type='medium'>{!!item.department ? item.department?.title : "N/A"}</MyText>
            </View>
          </View>

          <View style={{ flexDirection: "row", marginTop: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, paddingBottom: 5 }}>
            <View style={{ flex: 0.7 }}>
              <MyText color={colors.lightText2}>Status :</MyText>
            </View>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              {/* <View style={{ height: 10, width: 10, borderRadius: 10 / 2, backgroundColor: getStatusOfTicket(item).color, marginRight: 10 }} /> */}
              <MyText style={{ textTransform: "capitalize" }} color={getStatusOfTicket(item).color} type='medium'>{getStatusOfTicket(item).title}</MyText>
            </View>
          </View>


        </View>

      </TouchableHighlight>
    )
  }

  const titleView = () => {
    return (
      <View style={{ marginHorizontal: 10, flexDirection: "row", alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <TitleView hideBackBottomButton
            title={title}
            subTitle={`Total : ${list.length}`}
          />
        </View>
        {filter.value != 'all' &&
          <MyChip isCapitalize title={filter.value} onPress={() => setFilter({ ...filter, value: "all" })} />
        }
        <TouchableOpacity onPress={openModal}>
          {icons.filterCircle(colors.primary, 25)}
        </TouchableOpacity>
      </View>
    )
  }

  const filterTheOptions = (list) => {
    if (!!options.selected) {
      return list.slice().filter(x => {
        if (getStatusOfTicket(options.selected).title == "solved") {
          if (x.key == "edit" || x.key == "resolve") {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      })
    } else return []

  }

  return (
    <RootView
      hideBackBottomButton
      titleView={titleView}
    >
      <View style={{ flex: 1 }}>

        <FlatList
          data={list}
          renderItem={renderTicketList}
          showsVerticalScrollIndicator={false}
          // ItemSeparatorComponent={<View style={{ height: 1 / 3, backgroundColor: colors.lightText }} />}
          ListEmptyComponent={!loader && <EmptyView label={"No Tickets!"} />}
          contentContainerStyle={{ paddingBottom: 70 }}
          keyExtractor={(item) => item?._id}
        />

      </View>
      {filterModal()}
      <MyLoader enable={loader} />
      <FAB
        onPress={() => onTicketAddScreen()}
        icon={() => icons.plus(colors.black, 20)} />


      <OptionModal
        optionList={filterTheOptions(optionsList)}
        isVisible={options.isModalVisible}
        closeModal={() => setOptions({ isModalVisible: false, selected: null })}
        onSelected={optionActions}
      />

      <ConfirmationModal
        closeModal={() => setConfirmation({ isModalVisible: false, selected: null, title: "" })}
        isVisible={confirmation.isModalVisible}
        onAgree={onAgreePress}
        title={confirmation.title}
      />
    </RootView>
  )
}

export default List;


const filterList = ["all", 'open', 'answered', 'waiting', 'solved'];

const optionsList = [
  {
    title: "Detail",
    key: "detail",
    icon: icons.threeLinesMenu
  },
  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  // {
  //   title: "Delete",
  //   key: "delete",
  //   icon: icons.trash
  // },
  {
    title: "Mark Resolve",
    key: "resolve",
    icon: icons.tick
  },
]
