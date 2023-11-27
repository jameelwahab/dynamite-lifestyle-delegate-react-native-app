import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import { colors } from '../../utilities/colors'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import MyLoader from '../../components/MyLoader'
import MyText from '../../components/MyText'
import { icons } from '../../utilities/icons'
import FAB from '../../components/FAB'
import { DELETE_NOTES, LIST_OF_NOTES } from '../../DAL'
import routes from '../../navigation/routes'
import MyWebview from '../../components/MyWebview'
import UserImage from '../../components/UserImage'
import moment from 'moment'
import OptionModal from '../../components/OptionModal'
import ConfirmationModal from '../../components/ConfirmationModal'
import { useNavigation } from '@react-navigation/native'
const List = ({ ticket, user, }) => {
  const navigation = useNavigation()
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false)

  const [list, setList] = useState([])
  const [optionModal, setOptionModal] = useState({ isVisible: false, for: "" })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "" })


  const getNotesList = async () => {
    let res = await LIST_OF_NOTES({ token, navigation, id: ticket?._id });
    setLoader(false)
    if (res.code == 200) {
      setList(res?.support_ticket?.internal_note)
    }
  }

  const optionsAction = (opt) => {
    if (opt.type == "edit") {
      navigation.navigate(routes.addNote, {
        ticketId: ticket?._id,
        refresh: getNotesList,
        note: optionModal?.for
      });
      setOptionModal({ isVisible: false, for: "" })
    } else if (opt.type == "delete") {
      setTimeout(() => {
        setConfirmationModal({ isVisible: true, title: "Are you sure you want to delete this note?" });
      }, 1000);
      setOptionModal({ ...optionModal, isVisible: false, })
    }
  }

  const deleteNote = async (noteId) => {
    setLoader(true);
    let res = await DELETE_NOTES({ token, navigation, ticketId: ticket?._id, noteId });
    if (res.code == 200) {
      getNotesList()
    } else {
      setLoader(false)
    }

  }

  useEffect(() => {
    if (!!ticket) {
      setList(ticket?.internal_note)
    }
    // getNotesList()
  }, [ticket])

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
            <MyText fontSize={10} >{moment(item?.note_date_time).format("YYYY-MM-DD hh:mm A")}</MyText>

            <TouchableOpacity
              onPress={() => setOptionModal({ isVisible: true, for: item })}
              style={__styles.threeDotBtnView}>
              {icons.threeDots()}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingVertical: 5 }}>
          <MyWebview
            html={item?.internal_note}
          />
        </View>
      </View>
    )
  }

  return (
    <RootView hideHeader >
      <View style={{ flex: 1, marginHorizontal: -10 }}>
        {/* <View style={__styles.headerView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={__styles.closeBtnView}>
          {icons.crosss(colors.primary, 25)}
        </TouchableOpacity>

        <View style={{ marginLeft: 10, justifyContent: "center" }}>
          <MyText fontSize={16} color={colors.primary} >
            {`${user?.name} (${user?.email})`}
          </MyText>
        </View>
      </View> */}

        <View style={{ flex: 1, marginTop: 10, }}>
          <FlatList
            data={list}
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 70 }}
          />
        </View>



        <MyLoader enable={loader} />
        <FAB
          onPress={() =>
            navigation.navigate(routes.addNote, {
              ticketId: ticket?._id,
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