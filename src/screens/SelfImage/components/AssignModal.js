import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Toast from 'react-native-toast-message'
import Modal from 'react-native-modal'
import MyText from '../../../components/MyText'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import { GET_ACTIVE_DELEGATES, ASSIGN_DELEGATES_FOR_SELF_IMAGE_OR_GOAL_STATEMENT } from '../../../DAL'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import removeUnderscore from '../../../functions/removeUnderscore'
import showToast from '../../../functions/showToast'
import isObject from '../../../functions/isObject'

const AssignModal = forwardRef(({ type, onSuccess }, ref) => {
  const { token } = useSelector(selectUser);
  const [isVisible, setIsVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isOptionListVisible, setIsOptionListVisible] = useState(false)
  const [delegatesList, setDelegatesList] = useState([]);
  const [selectedDelegate, setSelectedDelegate] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedItemId, setselectedItemId] = useState("")
  const navigation = useNavigation();

  const openModal = ({ userId, delegateId, itemId }) => {
    setSelectedUser(userId);
    setselectedItemId(itemId)
    getActiveDelegateListFromServer(delegateId)
    setIsVisible(true);
  }

  const closeModal = () => {
    setIsVisible(false);
    setselectedItemId("");
    setSelectedUser("");
    setSelectedDelegate(null)
    setDelegatesList([])
    setIsOptionListVisible(false)

  }


  const getActiveDelegateListFromServer = async (delegateId = "") => {
    let res = await GET_ACTIVE_DELEGATES({ navigation, token });
    if (res.code == 200) {
      setDelegatesList(res?.consultant)
      if (delegateId) {
        setSelectedDelegate(res?.consultant.find(x => x?._id == delegateId))
      }
    }
  }

  const assignTheDelegate = async () => {
    if (!isObject(selectedDelegate)) {
      showToast({ type: "error", title: "Please select a Delegate" })
      return
    }
    setLoader(true)
    let res = await ASSIGN_DELEGATES_FOR_SELF_IMAGE_OR_GOAL_STATEMENT({
      navigation, token,
      type, delegateId: selectedDelegate?._id, userId: selectedUser
    });
    setLoader(false)
    if (res.code == 200) {
      onSuccess?.(selectedItemId, selectedDelegate)
      closeModal?.()
      setTimeout(() => {
        showToast({ type: "success", title: res?.message })
      }, 100);
    }
  }

  const onChooseDelegatePress = () => {
    setIsOptionListVisible(true)
  }

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={300}
      animationOutTiming={300}
      avoidKeyboard
      style={{ margin: 0 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondaryVariant }}>
        <View style={{ flex: 1 }}>
          <View style={__styles.header}>
            <MyText isHeading>{type == "goal_statement" ? `Assign Goal Statement` : `Assign Self Image`}</MyText>
            {/* <MyText>{member?.first_name + " " + member?.last_name}</MyText> */}
            <TouchableOpacity
              onPress={closeModal}
              style={__styles.closeBtn}>
              {icons.crosss(colors.primary)}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingHorizontal: 15 }}>
            <View style={{ flex: 1 }}>
              <MyTouchableInput
                style={{ marginTop: 15 }}
                label="Choose Delegate"
                value={!!selectedDelegate ? `${selectedDelegate.first_name} ${selectedDelegate.last_name} (${removeUnderscore(selectedDelegate?.team_type)})` : ""}
                onPress={onChooseDelegatePress}
                clearbutton={!!selectedDelegate}
                onClearButtonPress={() => setSelectedDelegate(null)}
              />

            </View>
            <MyButton title='Submit' onPress={assignTheDelegate} />


          </View>

          <OptionModalWithSearch
            title='Delegates'
            onSelected={(delegate) => {
              setSelectedDelegate(delegate)
              setIsOptionListVisible(false)
            }}
            closeModal={()=>setIsOptionListVisible(false)}
            isVisible={isOptionListVisible}
            optionList={delegatesList}
            filterTheList={(list, searchText) => {
              let text = searchText.trim().toLowerCase();
              return list.slice().filter(x => x.first_name.toLowerCase().includes(text) ||
                x.last_name.toLowerCase().includes(text)
                || removeUnderscore(x.team_type).toLowerCase().includes(text))
            }}
            renderText={({ item: member }) => <MyText>{`${member.first_name} ${member.last_name} (${removeUnderscore(member?.team_type)})`}</MyText>}
          />
          <MyLoader enable={loader} />
        </View>
      </SafeAreaView>
      {isVisible && <Toast />}
    </Modal>
  )
})

export default AssignModal

const __styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: colors.white + "55",
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  closeBtn: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.lightPrimary2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemView: {
    // padding: 10,
    marginTop: 20,
  },
  questionView: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomColor: colors.white + "55",
    borderBottomWidth: 1,
    paddingHorizontal: 10
  },
  deleteBtn: {
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 3,
    alignSelf: "flex-start"
  }
})