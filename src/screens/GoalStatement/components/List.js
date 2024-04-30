import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../utilities/colors'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import FAB from '../../../components/FAB'
import routes from '../../../navigation/routes'
import MyWebview from '../../../components/MyWebview'
import moment from 'moment'
import OptionModal from '../../../components/OptionModal'
import ConfirmationModal from '../../../components/ConfirmationModal'
import { useNavigation } from '@react-navigation/native'
import EmptyView from '../../../components/EmptyView'
import { convertTimezone } from '../../../functions/convertTime'
import RootView from '../../../components/RootView'
import { MenuButton } from '../../../components/MyButton'
import { dateTimeFormat } from '../../../utilities/constants'
import AudioPlayerForList from '../../../components/AudioPlayerForList'
import { QUESTIONS_DELETE_DYNAMIYE_REPLY } from '../../../DAL/Questions'
import showToast from '../../../functions/showToast'
import { GOAL_STATEMENT_DELETE_DYNAMITE_REPLY } from '../../../DAL/GoalStatement'
const List = ({ list, refresh, }) => {
  const navigation = useNavigation();
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false)
  const [optionModal, setOptionModal] = useState({ isVisible: false, for: "" })
  const [confirmationModal, setConfirmationModal] = useState({ isVisible: false, title: "" })




  const optionsAction = (opt) => {
    if (opt.type == "delete") {
      setTimeout(() => {
        setConfirmationModal({ isVisible: true, title: "Are you sure you want to delete this reply?" });
      }, 400);
      setOptionModal({ ...optionModal, isVisible: false, })
    }
  }

  const deleteNote = async (item) => {
    setLoader(true);
    let res = await GOAL_STATEMENT_DELETE_DYNAMITE_REPLY({
      token, navigation, replyId: item?._id
    });
    if (res.code == 200) {
      showToast({ title: res.message, type: "success" });
      refresh?.();
      setLoader(false)
      // getNotesList()
    } else {
      setLoader(false)
    }

  }


  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.itemRootView}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <MyText fontSize={10} color={colors.white} >{moment(item?.message_date_time).format(dateTimeFormat.date)}</MyText>
          </View>
          <View style={{}}>
            <MenuButton
              onPress={() => setOptionModal({ isVisible: true, for: item })}
            />
          </View>
        </View>

        {!!item?.message &&
          <View style={{ paddingVertical: 5, flexDirection: "row" }}>
            <View style={__styles.dot} />
            <View style={{ flex: 1 }}>
              <MyWebview
                html={item?.message}
              />
            </View>
          </View>}

        {!!item?.audio_file &&
          <View style={{ marginVertical: 10 }}>
            <AudioPlayerForList url={item?.audio_file} id={item._id} />
          </View>}

      </View>
    )
  }

  return (
    <View style={{ flex: 1 }} >

      <View style={{ flex: 1, marginHorizontal: 10 }}>
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
            deleteNote(optionModal.for);
            setOptionModal({ isVisible: false, for: "" })
          }}
        />
      </View>
    </View>
  )
}

export default List;

const myOptions = [
  //   {
  //   icon: icons.edit,
  //   title: "Edit",
  //   type: "edit"

  // },
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
    marginBottom: 10,

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
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: colors.primary,
    marginRight: 5,
    marginTop: 4
  }
})