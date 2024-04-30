import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import { GOAL_STATEMENT_LIST, GOAL_STATEMENT_MARK_INCOMPLETE, GOAL_STATEMENT_SAVE_AND_CLOSE } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import MemberView from '../../../components/MemberView'
import { MenuButton } from '../../../components/MyButton'
import StatView from '../../../components/StatView'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import MyRefreshControl from '../../../components/MyRefreshControl'
import EmptyView from '../../../components/EmptyView'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { icons } from '../../../utilities/icons'
import showToast from '../../../functions/showToast'
import routes from '../../../navigation/routes'
import { selectSocket } from '../../../redux/reducers/socketSlice'

const GoalStatementList = ({ navigation, route }) => {
  const { key, parentKey, type } = route.params;
  const isComplete = type == "complete";
  const isIncomplete = type == "incomplete";
  const isResponded = type == "responded";
  const { navbar } = useSelector(selectNavbar);
  const { token } = useSelector(selectUser);
  const { socket } = useSelector(selectSocket);
  const [title] = useState(navbar?.find(x => x._id == parentKey)?.title);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [options] = useState(isComplete ? optionsListForComplete : isIncomplete ? optionsListForInComplete : [optionsListForComplete[0]])
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null });
  const [confirmModal, setConfirmModal] = useState({ isVisible: false, item: null, statement: "", type: "" });

  useEffect(() => {
    getDataFromServer();
  }, [])

  const onSelected = (opt) => {
    let { item } = optionModal;
    setOptionModal({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "save") {
        setConfirmModal({
          isVisible: true, item, type: opt.key,
          statement: "Are you sure you want save and close?"
        })
      } else if (opt.key == "incomplete") {
        setConfirmModal({
          isVisible: true, item, type: opt.key,
          statement: "Are you sure you want to mark this incomplete?"
        })
      } else if (opt.key == "reminder") {
        setConfirmModal({
          isVisible: true, item, type: opt.key,
          statement: "Are you sure you want to send reminder?"
        })
      }
      else if (opt.key == "detail") {
        onDetailScreen(item)
      }
    }, 500);

  }

  const onConfirmPress = () => {
    let { type, item } = confirmModal;
    setConfirmModal({ isVisible: false, item: null, statement: "", type: "" });
    if (type == "incomplete") {
      incompleteFromServer(item)
    } else if (type == "reminder") {
      sendReminder(item)
    } else if (type == "save") {
      SaveAndCompleteFromServer(item)
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    getDataFromServer()
  }

  const onDetailScreen = (member) => {
    navigation.navigate(routes.goalStatmentDetail, {
      memberId: member?._id
    })
  }

  //! APIs



  const sendReminder = (member) => {
    let postData = { member_id: member?._id };
    socket.emit("send_goal_statement_incomplete_reminder_reciever", postData);
    showToast({ type: 'success', title: "Reminder sent successfully" });
  }

  const getDataFromServer = async (slug) => {
    let res = await GOAL_STATEMENT_LIST({ navigation, token, type })
    if (res.code == 200) {
      setList(res?.member_array)
      setLoader(false)
      setRefreshing(false)
    } else {
      setLoader(false)
      setRefreshing(false)
    }
  }

  const SaveAndCompleteFromServer = async (member) => {
    setLoader(true);
    let fd = new FormData();
    fd.append("member", member?._id);
    fd.append("save_and_close_status", true);
    let res = await GOAL_STATEMENT_SAVE_AND_CLOSE({ navigation, token, formdata: fd })
    if (res.code == 200) {
      showToast({ type: 'success', title: res.message });
      setList((old) => old.filter(x => x._id != member?._id))
      setLoader(false)
      setRefreshing(false)
    } else {
      setLoader(false)
      setRefreshing(false)
    }
  }

  const incompleteFromServer = async (member) => {
    setLoader(true);
    let fd = new FormData();
    fd.append("member", member?._id)
    let res = await GOAL_STATEMENT_MARK_INCOMPLETE({ navigation, token, formdata: fd })
    if (res.code == 200) {
      showToast({ type: 'success', title: res.message });
      setList((old) => old.filter(x => x._id != member?._id))
      setLoader(false)
      setRefreshing(false)
    } else {
      setLoader(false)
      setRefreshing(false)
    }
  }


  const statusView = (value, yes, no) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' capitalize color={value ? colors.green : colors.delete} >{value ? yes : no}</MyText>
      </View>)
  }

  const renderList = useCallback(({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={{ flexDirection: "row", }}>
          <Pressable
            onPress={() => onDetailScreen(item)}
            style={{ flex: 1 }}>
            <MemberView member={item} />
          </Pressable>
          <View style={{ marginTop: 2 }}>
            <MenuButton
              onPress={() => setOptionModal({ isVisible: true, item: item, })}
            />
          </View>
        </View>

        <View>
          <StatView title={"Goal Statement Status"} view={() => statusView(item?.goal_statement_completed_status, "completed", "incomplete")} />
          <StatView title={"Status"} view={() => statusView(item?.status, "active", "inactive")} />
          {isResponded && <StatView title={"Responded"} value={moment(item?.save_and_close_date).format(dateTimeFormat.date)} />}
          {isComplete && <StatView title={"Completed Date"} value={moment(item?.goal_statement_completed_date).format(dateTimeFormat.date)} />}
          <StatView title={"Goal"} view={() => statusView(item?.goal_statement_status, "unlock", "lock",)} />
          {isIncomplete && <StatView title={"Incomplete Date"} value={moment(item?.goal_statement_incompleted_date).format(dateTimeFormat.date)} />}

        </View>
      </View>
    )
  }, [JSON.stringify(list)])
  return (
    <RootView title={title}
      subTitle={`Total : ${list.length}`}
      hideBackBottomButton>
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          refreshControl={<MyRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh} />}
          renderItem={renderList}
          ListEmptyComponent={(!loader) && <EmptyView label={"No Goal Statement Found"} />}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisible}
        onSelected={onSelected}
        optionList={options}
        closeModal={() => setOptionModal({ isVisible: false, item: null, })}
      />

      <ConfirmationModal
        isVisible={confirmModal?.isVisible}
        closeModal={() => setConfirmModal({ isVisible: false, item: null, statement: "", type: "" })}
        onAgree={onConfirmPress}
        title={confirmModal.statement}
      />
    </RootView>
  )
}

export default GoalStatementList;

const optionsListForComplete = [
  {
    title: "Detail",
    key: "detail",
    icon: icons.edit
  },
  {
    title: "Save & Close",
    key: "save",
    icon: icons.edit
  },
  {
    title: "Incomplete",
    key: "incomplete",
    icon: icons.edit
  },
]

const optionsListForInComplete = [
  {
    title: "Detail",
    key: "detail",
    icon: icons.edit
  },
  {
    title: "Send Reminder",
    key: "reminder",
    icon: icons.edit
  },
]

const __styles = StyleSheet.create({
  itemView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
})