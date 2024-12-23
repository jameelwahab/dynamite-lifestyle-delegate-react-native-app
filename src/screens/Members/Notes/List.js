import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { colors } from '../../../utilities/colors'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import FAB from '../../../components/FAB'
import { MEMBER_DELETE_NOTE, MEMBER_NOTES_LIST, } from '../../../DAL'
import routes from '../../../navigation/routes'
import MyWebview from '../../../components/MyWebview'
import UserImage from '../../../components/UserImage'
import moment from 'moment'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useNavigation } from '@react-navigation/native'
import EmptyView from '../../../components/EmptyView'
import { convertTimezone } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import { dateTimeFormat } from '../../../utilities/constants'
import AudioPlayerForList from '../../../components/AudioPlayerForList'
const List = ({ navigation, route }) => {
  const ticket = "";
  const { memberId } = route?.params;
  const timezone = useSelector(selectTimeZone)
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false)
  const [list, setList] = useState([]);
  const [autoResponderMsg, setAutoResponderMsg] = useState([]);
  const [optionModal, setOptionModal] = useState({ isVisible: false, for: "" })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "" })
  const [member, setMember] = useState(null)



  const optionsAction = (opt) => {
    if (opt.type == "edit") {
      navigation.navigate(routes.memberAddNote, {
        memberId: memberId,
        refresh: getNotesFromServer,
        note: optionModal?.for,
        autoResponderMsg: autoResponderMsg
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
    let res = await MEMBER_DELETE_NOTE({ token, navigation, member_id: memberId, note_id: noteId });
    if (res.code == 200) {
      getNotesFromServer()
    } else {
      setLoader(false)
    }

  }

  const getNotesFromServer = async () => {
    let res = await MEMBER_NOTES_LIST({ token, navigation, memberId: memberId })
    if (res.code == 200) {
      let userMember = { ...res.member };
      delete userMember.personal_note;
      setList(res.member.personal_note);
      route?.params?.updateNotes?.(res.member.personal_note, memberId);
      setAutoResponderMsg(res?.auto_responder_message)
      setLoader(false);
      setMember(userMember);
    } else {
      setLoader(false)
    }
  }

  const getSrcFromHtml = (html) => {
    // Regular expression to find the 'src' attribute in the HTML
    const srcRegex = /<source[^>]+src="([^"]+)"/i;
    const match = html.match(srcRegex);

    // Return the captured group if a match is found, otherwise return null
    return match ? match[1] : null;
  };

  useEffect(() => {
    setLoader(true)
    getNotesFromServer();
  }, [])

  const renderList = ({ item, index }) => {
    let audioUrl = "";
    if (item?.note.includes("audio")) {
      audioUrl = getSrcFromHtml(item?.note);
    }
    let isColoredNote = item.action_source_type && item.action_source_type === "member_user"
    return (
      <View style={[__styles.itemRootView, {
        backgroundColor: isColoredNote ? "#e4e6eb" : colors.secondary
      }]}>
        <View style={__styles.itemUserView}>
          <UserImage
            image={item?.action_info?.profile_image}
            name={item?.action_info?.name}
            size={30}
          />

          <View style={__styles.itemNameAndDateView} >
            <View style={{ flex: 1 }}>
              <MyText color={colors.primary} fontSize={14} >
                {`${item?.action_info?.name} ${item?.action_by == "admin_user" ? "(Admin)" : "(Delegate)"} `}
              </MyText>
              <MyText fontSize={10} color={isColoredNote ? colors.grey : colors.lightText2} >{"Created at: " + convertTimezone(item?.note_date_time, timezone).format(dateTimeFormat.dateTime)}</MyText>
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
            invert={isColoredNote}
            html={item?.note}
          />
        </View>

        {audioUrl && (
          <View style={{ marginTop: 5 }}>
            <AudioPlayerForList
              id={audioUrl}
              noS3Url={true}
              url={audioUrl}
            />
          </View>
        )}

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
        <View style={{ marginLeft: 5, height: 35, flexDirection: "row", alignItems: "center", }}>
          <UserImage image={member?.profile_image} name={member?.first_name} size={30} />
          <View style={{ marginLeft: 10 }}>
            <MyText type='bold' fontSize={12} >{`${member?.first_name} ${member?.last_name}`}</MyText>
            <MyText type='medium' color={colors.lightText2} fontSize={10} >{`${member?.email}`}</MyText>
          </View>
        </View>

        <View style={{ marginTop: -2, paddingBottom: 5 }}>
          <MyText fontSize={10} type='medium' color={colors.lightText2}>{`Total: ${list?.length}`}</MyText>
        </View>
      </View>
    )
  }

  return (
    <RootView title='Personal Notes' >
      {!!member && topView()}
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



        <MyLoader enable={loader} />
        <FAB
          onPress={() =>
            navigation.navigate(routes.memberAddNote, {
              memberId: memberId,
              refresh: getNotesFromServer,
              autoResponderMsg: autoResponderMsg
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
    </RootView>
  )
}

export default List;

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