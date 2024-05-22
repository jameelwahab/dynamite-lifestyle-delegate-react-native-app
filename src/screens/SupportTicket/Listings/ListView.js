import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, SafeAreaView, TouchableHighlight, Pressable, Dimensions, Platform, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import Modal from 'react-native-modal'
import routes from '../../../navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { CHANGE_DEPARTMENT_OF_TICKET, MARK_RESOLVE_TICKET, MOVE_TICKET, SUPPORT_TCIKETS_LIST_BY_TYPE } from '../../../DAL';
import MyLoader, { SimpleLoader } from '../../../components/MyLoader';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { S3_URL } from '../../../utilities/constants';
import moment from 'moment';
import EmptyView from '../../../components/EmptyView';
import MyImage from '../../../components/MyImage';
import { Calendar } from 'react-native-calendars';
import { fonts } from '../../../utilities/fonts';
import { MenuButton, TransparentButton } from '../../../components/MyButton';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';
import UserImage from '../../../components/UserImage';
import utilities from '../../../utilities';
import { convertTimezone } from '../../../functions/convertTime';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import MyInputs from '../../../components/MyInputs';


const ListView = ({ isLoading, list, active, route, departmentList, token, refresh, user, setLoader, isLoadingMore, loadMore, type }) => {
  const timezone = useSelector(selectTimeZone);
  const [isOptionModalShown, setIsOptionModal] = useState({ isVisible: false, for: "" })
  const [isDepartmentModalShown, setIsDepartmentModalShown] = useState(false);
  const [isCalendarModalVisible, setCalendarModalVisiblity] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    isVisible: false,
    title: "",
    for: ""
  })
  const [isMarkResolveModalVisible, setMarkResolveModalVisiblity] = useState(false);
  const [resolveNoteModal, setResolveNoteModal] = useState({ isVisible: false, note: "", })
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"))
  const navigation = useNavigation();

  //? Actions functions

  const ticketActions = (option) => {
    console.log(option, "option", isOptionModalShown.for)



    if (option?.key == "change-department") {
      console.log(isOptionModalShown, "isOptionModalShown")
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })
      setTimeout(() => {
        setIsDepartmentModalShown(true)
      }, 400);
    }


    else if (option.key == "detail") {
      navigation.navigate(routes.supportTicketDeatail, {
        ticket: isOptionModalShown.for
      })
      setIsOptionModal({ isVisible: false, for: "" })
    }



    else if (option.key == "move_to_needs_fixes") {
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })
      setDate(moment().format("YYYY-MM-DD"))
      setTimeout(() => {
        setCalendarModalVisiblity(true)
      }, 400);
    }

    else if (option.key == "needs_to_attention") {
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })

      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          title: "Are you sure you want to move this ticket to need attention?",
          for: "needs_to_attention"
        })
      }, 400);
    }

    else if (option.key == "fixed") {
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })
      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          title: "Are you sure you want to move this ticket to fixed?",
          for: "fixed"
        })
      }, 400);
    }
    else if (option.key == "attended") {
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })
      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          title: "Are you sure you want to move this ticket to attended?",
          for: "attended"
        })
      }, 400);
    }

    else if (option.key == "mark-resolve") {
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })
      setTimeout(() => {
        setMarkResolveModalVisiblity(true)
      }, 400);
    }
    else if (option.key == "send_reminder") {
      navigation.navigate(routes.sendReminderScreen, {
        ticketId: isOptionModalShown?.for?._id,
      })
      setIsOptionModal({ isVisible: false, for: "" })
    }

    else if (option.key == "internal_notes") {
      navigation.navigate(routes.supportTicketDeatail, {
        ticket: isOptionModalShown?.for,
        refreshList: refresh,
        route: route,
        tab: 2
      });
      setIsOptionModal({ isVisible: false, for: "" })
    }
    else if (option.key == "resolve_note") {
      setIsOptionModal({ ...isOptionModalShown, isVisible: false, })
      setTimeout(() => {
        setResolveNoteModal({ isVisible: true, note: isOptionModalShown?.for?.close_note })
        setIsOptionModal({ for: "", isVisible: false, })
      }, 400);
    }

    else {
      setIsOptionModal({ isVisible: false, for: "" })
    }
  }

  const updateStatusOfTicket = async (obj) => {
    setLoader(true)
    let res = await MOVE_TICKET({ token, navigation, body: obj });
    if (res.code === 200) {
      showToast({ title: "Moved Successfully", body: res.message, type: "success" })
      refresh()
    } else {
      setLoader(false)
    }

  }

  const moveToNeedFixes = () => {
    let obj = {
      issue_fix_date: date,
      status_to_move: "fixes",
      support_ticket: isOptionModalShown.for?._id
    }
    updateStatusOfTicket(obj)
    setCalendarModalVisiblity(false);
    setIsOptionModal({ isVisible: false, for: "" });
  }

  const movetoNeedAttention = () => {
    let obj = {
      status_to_move: confirmationModal.for,
      support_ticket: isOptionModalShown.for?._id
    }
    updateStatusOfTicket(obj)
    closeConfirmationModal()
    setIsOptionModal({ isVisible: false, for: "" });
  }

  const updateDepartment = async (department) => {
    setIsDepartmentModalShown(false)
    let res = await CHANGE_DEPARTMENT_OF_TICKET({
      ticketId: isOptionModalShown.for?._id,
      navigation, token,
      body: {
        department: department?._id
      }
    });
    setIsOptionModal({ ...isOptionModalShown, for: "" })
    if (res.code == 200) {
      showToast({ title: res.message, type: "success" })
      refresh?.()
    }
  }

  const moveToMarkResolve = async (reason, note) => {
    let obj = {
      support_ticket: isOptionModalShown.for?._id,
      close_note: note,
      reason_to_solve: reason
    }
    setMarkResolveModalVisiblity(false);
    setLoader(true)
    setIsOptionModal({ isVisible: false, for: "" });

    let res = await MARK_RESOLVE_TICKET({
      token, navigation,
      body: obj,
    });
    if (res.code == 200) {
      showToast({ title: "Marked resolved successfully ", body: res.message, type: "success" })
      refresh()
    } else {
      setLoader(false)
    }
  }



  //? Modals

  const optionsModal = () => {
    return (
      <Modal
        isVisible={isOptionModalShown.isVisible}
        onBackdropPress={() => setIsOptionModal({ isVisible: false, for: "" })}
        onBackButtonPress={() => setIsOptionModal({ isVisible: false, for: "" })}
        animationInTiming={300}
        animationOutTiming={300}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, }} >
          <FlatList
            data={options}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item, index }) => {
              if (item.routes[type][route]) {
                return (
                  <TouchableHighlight
                    onPress={() => ticketActions(item)}
                    underlayColor={colors.secondary} >
                    <View style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center", paddingLeft: 20 }}>
                      {typeof (item.icon) == "function" ? item.icon() :
                        <Image source={item.icon} style={{ height: 25, width: 25, tintColor: colors.primary }} />}
                      <View style={{ marginLeft: 10 }}>
                        <MyText fontSize={16} >{item.title}</MyText>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
              } else return null
            }
            }
          />
        </SafeAreaView>
      </Modal>)
  }

  const departmentModal = () => {
    return (
      <Modal
        isVisible={isDepartmentModalShown}
        onBackdropPress={() => setIsDepartmentModalShown(false)}
        onBackButtonPress={() => setIsDepartmentModalShown(false)}
        useNativeDriverForBackdrop={true}
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 0 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, }} >
          <View style={{ height: utilities.screenHeight() * 0.7, }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
              <View>
                <MyText fontSize={18} type='medium' >Departments</MyText>
                <MyText color={colors.lightText} fontSize={12}>Select your department from list below</MyText>
              </View>
              <Pressable
                onPress={() => setIsDepartmentModalShown(false)}
              >
                {icons.crosssWithCircle()}
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={departmentList}
                contentContainerStyle={{ paddingVertical: 10 }}
                indicatorStyle='white'
                renderItem={({ item, index }) => {
                  return (
                    <TouchableHighlight
                      onPress={() => updateDepartment(item)}
                      underlayColor={colors.secondary} >
                      <View style={{ paddingVertical: 10, paddingLeft: 20, backgroundColor: isOptionModalShown.for?.department?._id == item?._id ? "#FFFFFF11" : colors.transparent }}>
                        <MyText fontSize={16} >{item?.title}</MyText>
                      </View>
                    </TouchableHighlight>
                  )
                }
                }
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>)
  }

  const CalendarModal = () => {
    return (
      <Modal
        isVisible={isCalendarModalVisible}
        onBackdropPress={() => setCalendarModalVisiblity(false)}
        onBackButtonPress={() => setCalendarModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        animationIn='zoomIn'
        animationOut='zoomOut'
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 10 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
          <View style={{ margin: 10 }}>
            <View style={{ margin: 10 }}>
              <MyText fontSize={18} type='medium' color={colors.primary}>Are you sure you want to move this ticket to needs fixes?</MyText>
            </View>
            <View style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, overflow: "hidden" }}>
              <Calendar
                current={date}

                // date={date}
                markedDates={{
                  [date]: { selected: true }
                }}
                theme={{
                  backgroundColor: colors.secondaryVariant,
                  calendarBackground: colors.secondaryVariant,
                  textSectionTitleColor: colors.primary,
                  textSectionTitleDisabledColor: colors.primary,
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.black,
                  todayTextColor: 'white',
                  // todayBackgroundColor: colors.,
                  dayTextColor: colors.white,
                  textDisabledColor: colors.placeholder,
                  dotColor: colors.blue,
                  selectedDotColor: 'blue',
                  arrowColor: colors.primary,
                  disabledArrowColor: colors.primary,
                  monthTextColor: 'white',
                  textDayFontSize: 14,
                  // textMonthFontSize: 16,
                  textDayHeaderFontSize: 12,
                  textDayFontFamily: fonts.regular,
                  textDayHeaderFontFamily: fonts.regular,
                  textMonthFontFamily: fonts.medium,

                }}
                onDayPress={(day) => {
                  console.log(day, "onDayPress")
                  setDate(day.dateString)
                }}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={() => setCalendarModalVisiblity(false)} />
              <TransparentButton title='AGREE' onPress={moveToNeedFixes} />
            </View>

          </View>
        </SafeAreaView>
      </Modal>)
  }

  const ConfirmationModal = () => {
    return (
      <Modal
        isVisible={confirmationModal.isVisible}
        onBackdropPress={closeConfirmationModal}
        onBackButtonPress={closeConfirmationModal}
        useNativeDriverForBackdrop={true}
        animationIn='zoomIn'
        animationOut='zoomOut'
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 10 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
          <View style={{ margin: 10 }}>
            <View style={{ margin: 10 }}>
              <MyText fontSize={18} type='medium' color={colors.primary}>
                {confirmationModal.title}
              </MyText>
            </View>


            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={closeConfirmationModal} />
              <TransparentButton title='AGREE' onPress={movetoNeedAttention} />
            </View>

          </View>
        </SafeAreaView>
      </Modal>)
  }

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isVisible: false,
      title: "",
      for: ""
    })
  }

  const MarkResolveModal = () => {
    const [reson, setReson] = useState("Answered");
    const [note, setNote] = useState("");

    const btn_resolve = () => {
      if (reson == "") {
        showToast({ body: "Please select reason", type: "info" })
      } else if (note.trim() == "") {
        showToast({ body: "Please write note", type: "info" })
      } else {
        moveToMarkResolve(reson.toLowerCase(), note.trim())
        setReson("")
        setNote("")
      }
    }

    const optionView = (text) => {
      return (
        <TouchableOpacity
          onPress={() => setReson(text)}
          style={{ flexDirection: "row", paddingVertical: 5 }}
        >
          <View style={{ height: 20, width: 20, borderColor: reson == text ? colors.primary : colors.white, borderWidth: 1, borderRadius: 20 / 2, alignItems: "center", justifyContent: "center" }}>
            {reson == text &&
              <View style={{ height: 12, width: 12, borderRadius: 18 / 2, backgroundColor: colors.primary }} />}
          </View>
          <View style={{ marginLeft: 10 }}>
            <MyText fontSize={16} >{text}</MyText>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <Modal
        isVisible={isMarkResolveModalVisible}
        onBackdropPress={() => setMarkResolveModalVisiblity(false)}
        onBackButtonPress={() => setMarkResolveModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        animationIn='zoomIn'
        animationOut='zoomOut'
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 10 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
          <View style={{ margin: 10 }}>
            <View style={{ margin: 10 }}>
              <MyText fontSize={18} color={colors.primary} type='medium'>Mark Resolve</MyText>

            </View>
            <View style={{ margin: 10 }}>
              <MyText isLabel>Reason To Solve*</MyText>
              <View>
                {optionView("Answered")}
                {optionView("Solved")}
                {optionView("Auto-Closure")}
              </View>
            </View>
            <View style={{ margin: 10 }}>
              <MyInputs
                multiline={true}
                value={note}
                label='Resolve Note*'
                onChangeText={(text) => setNote(text)}
              />
            </View>


            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={() => setMarkResolveModalVisiblity(false)} />
              <TransparentButton title='RESOLVE' onPress={btn_resolve} />
            </View>

          </View>
        </SafeAreaView>
        {isMarkResolveModalVisible && <Toast />}
      </Modal>)
  }

  const ResolveNoteModal = () => {
    return (
      <Modal
        isVisible={resolveNoteModal?.isVisible}
        onBackdropPress={() => setResolveNoteModal({ isVisible: false, note: "" })}
        onBackButtonPress={() => setResolveNoteModal({ isVisible: false, note: "" })}
        useNativeDriverForBackdrop={true}
        animationIn='zoomIn'
        animationOut='zoomOut'
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 10 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
          <View style={{ margin: 20 }}>

            <View style={{ borderBottomWidth: 1 / 4, borderBottomColor: colors.lightText, paddingBottom: 5 }}>
              <MyText fontSize={20} type='medium' color={colors.primary}>
                Note
              </MyText>
            </View>
            <View style={{ marginVertical: 10 }}>
              <MyText fontSize={14} color={colors.text}>
                {resolveNoteModal?.note}
              </MyText>
            </View>



            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CLOSE' onPress={() => setResolveNoteModal({ isVisible: false, note: "" })} />
            </View>

          </View>
        </SafeAreaView>
      </Modal>)
  }

  //? list

  const renderList = ({ item, index }) => {
    return (
      <TouchableHighlight
        underlayColor={colors.secondary}
        // delayLongPress={400}
        onPress={() => {
          navigation.navigate(routes.supportTicketDeatail, {
            ticket: item,
            refreshList: refresh,
            route: route
          })
        }}
        // onLongPress={() => setIsOptionModal({ isVisible: true, for: item })}

        style={{ paddingVertical: 20, paddingLeft: 10, paddingRight: 10, flexDirection: "row" }} >
        <>
          <View style={{}}>
            <UserImage
              image={item?.member?.profile_image}
              name={!!item?.member?.first_name ? item?.member?.first_name : "N/A"}
              size={35}
            />

          </View>
          <View style={{ flex: 1, marginLeft: 10, }}>
            <View style={{ flexDirection: "row", alignItems: "center", }}>
              <View style={{ flex: 1 }}>
                <MyText fontSize={14} type='medium' >{!!item?.member?.first_name ? item?.member?.first_name + " " + item?.member?.last_name : "N/A"}</MyText>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <MyText fontSize={10} type='light'>{convertTimezone(item.last_action_date, timezone).fromNow()}
                </MyText>
                <MenuButton
                  // backgroundColor={colors.transparent}
                  size={22}
                  onPress={() => setIsOptionModal({ isVisible: true, for: item })}
                />
              </View>
            </View>
            <MyText style={{ marginTop: 3 }} fontSize={12} >{item?.subject}</MyText>
            <MyText style={{ marginTop: 3 }} numberOfLines={1} color={colors.lightText} fontSize={12} >
              {item?.description.slice(0, 60)}
            </MyText>
            {route == "need_fixes" && moment(item.issue_fix_date).diff(moment(), 'days') < 2 &&
              <View style={__styles.badges} />}
          </View>
        </>
      </TouchableHighlight >)
  }

  //? main
  return (
    <View style={{ flex: 1 }}>
      {ResolveNoteModal()}
      {MarkResolveModal()}
      {optionsModal()}
      {departmentModal()}
      {CalendarModal()}
      {ConfirmationModal()}
      <View style={{ flex: 1, borderRadius: 20 }}>
        <FlatList
          data={list}
          indicatorStyle="white"
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderList}
          ListEmptyComponent={!isLoading && active && <EmptyView />}
          onEndReached={loadMore}
          automaticallyAdjustKeyboardInsets={true}
          ListFooterComponent={() => {
            return (
              <View style={{ height: 50, alignItems: "center", justifyContent: "center" }}>
                {isLoadingMore && <SimpleLoader />}
              </View>
            )
          }}
        />
      </View>
      <MyLoader enable={isLoading} />
    </View>
  );
};

export default ListView;

const __styles = StyleSheet.create({
  badges: {
    height: 7,
    width: 7,
    borderRadius: 5,
    backgroundColor: colors.delete,
    position: "absolute",
    top: -10,
    right: -10
  }
})


const options = [{
  title: "Detail",
  key: "detail",
  icon: icons.threeLinesMenu,
  routes: {
    support_ticket: {
      waiting: true,
      answered: true,
      need_fixes: true,
      needs_to_attention: true,
      reminder: true,
      ready_to_close: true,
      solved: true,
      trash: true,
    },
    internal_ticket: {
      waiting: true,
      answered: true,
      needs_to_attention: true,
      solved: true,
    }
  }
},
{
  title: "Internal Notes",
  key: "internal_notes",
  icon: icons.threeLinesMenu,
  routes: {
    support_ticket: {
      waiting: true,
      answered: true,
      need_fixes: true,
      needs_to_attention: true,
      reminder: true,
      ready_to_close: true,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: true,
      answered: true,
      needs_to_attention: true,
      solved: false,
    }
  }

},
{
  title: "Mark Resolve",
  key: "mark-resolve",
  icon: icons.tick,
  routes: {
    support_ticket: {
      waiting: true,
      answered: true,
      need_fixes: false,
      needs_to_attention: false,
      reminder: false,
      ready_to_close: true,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: true,
      answered: true,
      needs_to_attention: false,
      solved: false,
    }
  }
},
{
  title: "Attended",
  key: "attended",
  icon: icons.refresh,
  routes: {
    support_ticket: {
      waiting: false,
      answered: false,
      need_fixes: false,
      needs_to_attention: true,
      reminder: false,
      ready_to_close: false,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: false,
      answered: false,
      needs_to_attention: true,
      solved: false,
    }
  }
},
{
  title: "Fixed",
  key: "fixed",
  icon: icons.refresh,
  routes: {
    support_ticket: {
      waiting: false,
      answered: false,
      need_fixes: true,
      needs_to_attention: false,
      reminder: false,
      ready_to_close: false,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: false,
      answered: false,
      needs_to_attention: false,
      solved: false,
    }
  }
},
{
  title: "Change Department",
  key: "change-department",
  icon: icons.refresh,
  routes: {
    support_ticket: {
      waiting: true,
      answered: true,
      need_fixes: true,
      needs_to_attention: true,
      reminder: false,
      ready_to_close: false,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: false,
      answered: false,
      needs_to_attention: false,
      solved: false,
    }
  }
},
{
  title: "Move To Needs Fixes",
  key: "move_to_needs_fixes",
  icon: icons.refresh,
  routes: {
    support_ticket: {
      waiting: true,
      answered: true,
      need_fixes: false,
      needs_to_attention: false,
      reminder: false,
      ready_to_close: false,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: false,
      answered: false,
      needs_to_attention: false,
      solved: false,
    }
  }
},
{
  title: "Move to Needs Attention",
  key: "needs_to_attention",
  icon: icons.refresh,
  routes: {
    support_ticket: {
      waiting: true,
      answered: true,
      need_fixes: false,
      needs_to_attention: false,
      reminder: false,
      ready_to_close: false,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: true,
      answered: true,
      needs_to_attention: false,
      solved: false,
    }
  }
},
{
  title: "Send Reminder",
  key: "send_reminder",
  icon: icons.send1,
  routes: {
    support_ticket: {
      waiting: false,
      answered: false,
      need_fixes: false,
      needs_to_attention: false,
      reminder: true,
      ready_to_close: false,
      solved: false,
      trash: false,
    },
    internal_ticket: {
      waiting: false,
      answered: false,
      needs_to_attention: false,
      solved: false,
    }
  }
},
{
  title: "Note",
  key: "resolve_note",
  icon: icons.threeLinesMenu,
  routes: {
    support_ticket: {
      waiting: false,
      answered: false,
      need_fixes: false,
      needs_to_attention: false,
      reminder: false,
      ready_to_close: false,
      solved: true,
      trash: false,
    },
    internal_ticket: {
      waiting: false,
      answered: false,
      needs_to_attention: false,
      solved: false,
    }
  }
}
]

