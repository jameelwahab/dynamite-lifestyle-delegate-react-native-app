import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import { colors } from '../../../utilities/colors'
import MyLoader from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import FAB from '../../../components/FAB'
import routes from '../../../navigation/routes'
import MyWebview from '../../../components/MyWebview'
import UserImage from '../../../components/UserImage'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import EmptyView from '../../../components/EmptyView'
import { convertTimezone, } from '../../../functions/convertTime'
import { dateTimeFormat } from '../../../utilities/constants'
import MemberView from '../../../components/MemberView'
import { BOOKING_NOTES_DELETE, PROGRESS_NOTES_DELETE, PROGRESS_NOTES_LIST, } from '../../../DAL'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import { selectUser } from '../../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'

const PorgressNotesList = ({ navigation, route }) => {
  const { reportId } = route?.params;
  const timezone = useSelector(selectTimeZone);
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false)
  const [list, setList] = useState([]);
  const [optionModal, setOptionModal] = useState({ isVisible: false, for: "" })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "" });



  useEffect(() => {
    getDataFromServer()
  }, [])

  const optionsAction = (opt) => {
    if (opt.type == "edit") {
      navigation.navigate(routes.progresssAddNote, {
        reportId: reportId,
        refresh: getDataFromServer,
        oldNote: optionModal?.for
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
    let res = await PROGRESS_NOTES_DELETE({ token, navigation, progressId: reportId, id: noteId });
    if (res.code == 200) {
      getDataFromServer()
    } else {
      setLoader(false)
    }

  }

  const getDataFromServer = async () => {
    let res = await PROGRESS_NOTES_LIST({ token, navigation, id: reportId });
    if (res.code == 200) {
      setList(res?.internal_note?.internal_note)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }



  const renderList = ({ item, index }) => {
    console.log(item?.user_info?.action_by)
    return (
      <View style={__styles.itemRootView}>
        <View style={__styles.itemUserView}>
          <UserImage
            image={item?.action_user_info?.profile_image}
            name={item?.action_user_info?.action_name}
            size={30}
          />

          <View style={__styles.itemNameAndDateView} >
            <View style={{ flex: 1 }}>
              <MyText color={colors.primary} fontSize={14} >
                {`${item?.action_user_info?.action_name}`}
              </MyText>
              <MyText fontSize={10} color={colors.lightText2} >{convertTimezone(item?.note_date_time, timezone).format(dateTimeFormat.dateTime)}</MyText>
            </View>

            {item?.action_by != "admin_user" &&
              <TouchableOpacity
                onPress={() => setOptionModal({ isVisible: true, for: item })}
                style={__styles.threeDotBtnView}>
                {icons.threeDots()}
              </TouchableOpacity>}
          </View>
        </View>
        {!!item?.internal_note &&
          <View style={{ paddingVertical: 5 }}>
            <MyWebview
              html={item?.internal_note}
            />
          </View>}
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
    <RootView
      title='Progress Notes'
      customBackPress={() => navigation.navigate(routes?.progresssList, { callList: true })}
    >
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
            navigation.navigate(routes.progresssAddNote, {
              reportId: reportId,
              refresh: getDataFromServer,
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

export default PorgressNotesList;

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