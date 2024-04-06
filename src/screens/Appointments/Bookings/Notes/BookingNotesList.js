import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../../components/RootView'
import { colors } from '../../../../utilities/colors'
import MyLoader from '../../../../components/MyLoader'
import MyText from '../../../../components/MyText'
import { icons } from '../../../../utilities/icons'
import FAB from '../../../../components/FAB'
import routes from '../../../../navigation/routes'
import MyWebview from '../../../../components/MyWebview'
import UserImage from '../../../../components/UserImage'
import OptionModal from '../../../../components/OptionModal'
import ConfirmationModal from '../../../../components/ConfirmationModal'
import EmptyView from '../../../../components/EmptyView'
import { convertTimezone } from '../../../../functions/convertTime'
import { dateTimeFormat } from '../../../../utilities/constants'
import MemberView from '../../../../components/MemberView'
import { BOOKING_NOTES_DELETE, BOOKING_NOTES_LIST } from '../../../../DAL'
import { selectTimeZone } from '../../../../redux/reducers/timezoneSlice'
import { selectUser } from '../../../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import moment from 'moment'

const BookingNotesList = ({ navigation, route }) => {
  const { bookingId, userInfo } = route?.params;
  const timezone = useSelector(selectTimeZone)
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false)
  const [list, setList] = useState([]);
  const [autoResponderMsg, setAutoResponderMsg] = useState([]);
  const [optionModal, setOptionModal] = useState({ isVisible: false, for: "" })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "" });



  const optionsAction = (opt) => {
    if (opt.type == "edit") {
      navigation.navigate(routes.bookingAddNote, {
        bookingId:bookingId,
        refresh: getDataFromServer,
        note: optionModal?.for,
      });
      setOptionModal({ isVisible: false, for: "" })
    } else if (opt.type == "delete") {
      setTimeout(() => {
        setConfirmationModal({ isVisible: true, title: "Are you sure you want to delete this note?" });
      }, 400);
      setOptionModal({ ...optionModal, isVisible: false, })
    }
  }

  const deleteNote = async (noteId) => {
    setLoader(true);
    let res = await BOOKING_NOTES_DELETE({ token, navigation, id: noteId });
    if (res.code == 200) {
      getDataFromServer()
    } else {
      setLoader(false)
    }

  }

  const getDataFromServer = async () => {
    let res = await BOOKING_NOTES_LIST({ token, navigation, id: bookingId });
    if (res.code == 200) {
      setList(res?.booking_notes)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }


  useEffect(() => {
    setLoader(true)
    getDataFromServer()
  }, [])

  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.itemRootView}>
        <View style={__styles.itemUserView}>
          <UserImage
            image={item?.user_info?.profile_image?.thumbnail_1}
            name={item?.user_info?.first_name}
            size={30}
          />

          <View style={__styles.itemNameAndDateView} >
            <View style={{ flex: 1 }}>
              <MyText color={colors.primary} fontSize={14} >
                {`${item?.user_info?.first_name} ${item?.user_info?.action_by == "admin_user" ? "(Admin)" : "(Delegate)"} `}
              </MyText>
              <MyText fontSize={10} color={colors.lightText2} >{"Created at: " + convertTimezone(item?.createdAt, timezone).fromNow()}</MyText>
            </View>

            {item?.action_by != "admin_user" &&
              <TouchableOpacity
                onPress={() => setOptionModal({ isVisible: true, for: item })}
                style={__styles.threeDotBtnView}>
                {icons.threeDots()}
              </TouchableOpacity>}
          </View>
        </View>
        <View style={{ paddingVertical: 5 }}>
          <MyWebview
            html={item?.note}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5 }}>

          {!!item?.last_updated_date_time ?
            <MyText fontSize={10} color={colors.lightText2}>{"Last Action: " + convertTimezone(item?.last_updated_date_time, timezone).format(dateTimeFormat.dateTime)}</MyText> : <View />}
        </View>
      </View>
    )
  }

  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingBottom: 5 }}>
        <MemberView member={userInfo} />

        <View style={{ marginTop: -2, paddingBottom: 5 }}>
          <MyText fontSize={10} type='medium' color={colors.lightText2}>{`Total: ${list?.length}`}</MyText>
        </View>
      </View>
    )
  }

  return (
    <RootView title='Booking Notes' >
      {!!userInfo && topView()}
      <View style={{ flex: 1, }}>
        <View style={{ flex: 1, marginTop: 10, }}>
          <FlatList
            data={list}
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 70 }}
            ListEmptyComponent={!loader &&
              <EmptyView label={"No notes"} />
            }
          />
        </View>




        <FAB
          onPress={() =>
            navigation.navigate(routes.bookingAddNote, {
              bookingId:bookingId,
              refresh: getDataFromServer,
              note: optionModal?.for,
            })}
          icon={() => icons.plus(colors.black, 20)}
        />
        <OptionModal
          closeModal={() => setOptionModal({ isVisible: false, for: "" })}
          isVisible={optionModal?.isVisible}
          optionList={myOptions}
          onSelected={optionsAction}
        />
        <ConfirmationModal
          isVisible={confirmationModal.isVisible}
          title={confirmationModal.title}
          closeModal={() => setConfirmationModal({ isVisible: false, title: "" })}
          onAgree={() => {
            setConfirmationModal({ isVisible: false, title: "" })
            deleteNote(optionModal.for?._id);
            setOptionModal({ isVisible: false, for: "" })
          }}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default BookingNotesList;

const myOptions = [{
  icon: icons.edit,
  title: "Edit",
  type: "edit"

},
{
  icon: icons.trash,
  title: "Delete",
  type: "delete"
}]

const __styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    marginTop: 10
  },
  closeBtnView: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  itemRootView: {
    // borderColor: colors.primary,
    // borderWidth: 1 / 3,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10
  },
  itemUserView: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemNameAndDateView: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10
  },
  threeDotBtnView: {
    backgroundColor: colors.lightPrimary2,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10
  }
})