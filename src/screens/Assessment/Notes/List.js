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
import { ASSESSMENT_NOTE_DELETE, ASSESSMENT_NOTE_LIST, } from '../../../DAL'
import routes from '../../../navigation/routes'
import MyWebview from '../../../components/MyWebview'
import UserImage from '../../../components/UserImage'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useNavigation } from '@react-navigation/native'
import EmptyView from '../../../components/EmptyView'
import { convertTimezone } from '../../../functions/convertTime'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'

const List = ({ navigation, route }) => {
  const { type, assessmentId } = route?.params;

  const { token } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [loader, setLoader] = useState(false)
  const [list, setList] = useState([])
  const [optionModal, setOptionModal] = useState({ isVisible: false, for: "" })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "", item: null })


  const getNotesList = async () => {
    let res = await ASSESSMENT_NOTE_LIST({ token, navigation, type, assessmentId });
    setLoader(false)
    if (res.code == 200) {
      setList(res?.internal_notes)
    }
  }

  const optionsAction = (opt) => {
    let notes = optionModal?.for;
    setOptionModal({ for: "", isVisible: false, })
    if (opt.type == "edit") {
      navigation.navigate(routes.assessmentNotesAddEdit, {
        type, assessmentId,
        oldNote: notes,
        refresh: getNotesList,
      });
    } else if (opt.type == "delete") {
      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          item: notes,
          title: "Are you sure you want to delete this note?"
        });
      }, 400);

    }
  }

  const deleteNote = async (noteId) => {
    setLoader(true);
    let res = await ASSESSMENT_NOTE_DELETE({ token, navigation, type, assessmentId, noteId });
    if (res.code == 200) {
      getNotesList()
    } else {
      setLoader(false)
    }

  }

  useEffect(() => {
    getNotesList()
  }, [route])

  const renderList = ({ item, index }) => {
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
                {item?.action_user_info?.action_name}
              </MyText>
            </View>
            <MyText fontSize={10} >{convertTimezone(item?.note_date_time, timezone).format("YYYY-MM-DD hh:mm A")}</MyText>

            <TouchableOpacity
              onPress={() => setOptionModal({ isVisible: true, for: item })}
              style={__styles.threeDotBtnView}>
              {icons.threeDots()}
            </TouchableOpacity>
          </View>
        </View>
        {!!item?.internal_note_message &&
          <View style={{ paddingVertical: 5 }}>
            <MyWebview
              html={item?.internal_note_message}
            />
          </View>}
      </View>
    )
  }

  return (
    <RootView title='Notes' >

      <View style={{ flex: 1 }}>


        <View style={{ flex: 1, marginTop: 10, }}>
          <FlatList
            data={list}
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 70 }}
            ListEmptyComponent={() =>
              <EmptyView label={"No notes"} />
            }
          />
        </View>



        <MyLoader enable={loader} />
        <FAB
          onPress={() =>
            navigation.navigate(routes.assessmentNotesAddEdit, {
              type, assessmentId,
              refresh: getNotesList
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
          closeModal={() => setConfirmationModal({ isVisible: false, title: "", item: null })}
          onAgree={() => {
            deleteNote(confirmationModal.item?._id)
            setConfirmationModal({ isVisible: false, title: "", item: null })

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