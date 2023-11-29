import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import { CONTACT_SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL'
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

const List = ({ navigation }) => {
  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);

  const getListOfTickets = async () => {
    setLoader(true)
    let formData = new FormData();
    formData.append('filter_by', 'all')
    let res = await CONTACT_SUPPORT_TCIKETS_LIST_BY_TYPE({ token, navigation, body: formData });
    if (res.code == 200) {
      setLoader(false)
      setList(res?.support_ticket)
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    getListOfTickets()
  }, [])


  const onTicketAddScreen = () => {
    navigation.navigate(routes.addTicket)
  }

  const refresh = () => {

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

  const renderTicketList = ({ item, index }) => {
    return (
      <TouchableHighlight
        onPress={() => onTicketDetail(item)}
        style={{ marginTop: 10 }}>

        <View style={{ flexDirection: "row", padding: 15, backgroundColor: colors.secondaryVariant, borderRadius: 20 }}>

          <View style={{ flex: 1, paddingRight: 10 }}>
            <MyText numberOfLines={2} fontSize={16} type='medium' >{item?.subject}</MyText>

            <MyText style={{ marginTop: 5 }} fontSize={12} numberOfLines={1} >{!!item?.department?.title ? item?.department?.title : "N/A"}</MyText>
            <MyText style={{ marginTop: 5 }} fontSize={12} color={colors.primary}  >{"ID: " + item?.reference_number}</MyText>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <MyText fontSize={10} >
              {convertTimezone(item.createdAt, timezone).fromNow()}
            </MyText>

            <View style={{ marginTop: 10, width: 75, backgroundColor: getStatusOfTicket(item).color, alignItems: "center", paddingVertical: 3, borderRadius: 20 }}>
              <MyText fontSize={12} style={{ textTransform: "capitalize" }}>{getStatusOfTicket(item).title}</MyText>
            </View>
          </View>

        </View>

      </TouchableHighlight>
    )
  }


  return (
    <RootView
      hideBackBottomButton
      title='Support Tickets'
      rightButtonIcon={() => icons.trashFilled(colors.primary, 20)}>
      <View style={{ flex: 1 }}>

        <FlatList
          data={list}
          renderItem={renderTicketList}
          showsVerticalScrollIndicator={false}
          // ItemSeparatorComponent={<View style={{ height: 1 / 3, backgroundColor: colors.lightText }} />}
          ListEmptyComponent={!loader && <EmptyView label={"No Tickets!"} />}
          contentContainerStyle={{ paddingBottom: 70 }}
        />

      </View>
      <MyLoader enable={loader} />
      <FAB
        onPress={onTicketAddScreen}
        icon={() => icons.plus(colors.black, 20)} />
    </RootView>
  )
}

export default List