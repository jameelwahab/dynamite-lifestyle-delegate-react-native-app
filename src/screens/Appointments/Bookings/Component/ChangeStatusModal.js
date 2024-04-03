import { View, Text, SafeAreaView, StyleSheet, Pressable, } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../../utilities/colors'
import MyText from '../../../../components/MyText'
import { icons } from '../../../../utilities/icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyTouchableInput from '../../../../components/MyTouchableInput'
import Editor from '../../../../components/Editor'
import { MyButton } from '../../../../components/MyButton'
import MyCheckBox from '../../../../components/MyCheckBox'
import { BOOKING_UPDATE_STATUS, GET_BOOKING_STATUSES } from '../../../../DAL'
import OptionModalWithSearch from '../../../../components/OptionModalWithSearch'
import showToast from '../../../../functions/showToast'
import MyLoader from '../../../../components/MyLoader'


const ChangeStatusModal = forwardRef(({ navigation, token, onStatusChange }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [addNotes, setAddNotes] = useState(false);
  const [desc, setDesc] = useState("<b>BIO:</b><span>    <br><b>GOAL:</b> <br><b>PARADIGM:</b> <br><b>SOLUTION:</b>")
  const [optionModalVisibility, setOptionModalVisibility] = useState(false);
  const [id, setId] = useState("");
  const [loader, setLoader] = useState(false)
  const closeModal = () => {
    setIsVisible(false);

  }

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const resetState = () => {
    setSelectedStatus(null)
    setAddNotes(false);
    setDesc("<b>BIO:</b><span>    <br><b>GOAL:</b> <br><b>PARADIGM:</b> <br><b>SOLUTION:</b>");
    setOptionModalVisibility(false);
    setId("");
  }

  const openModal = (item) => {
    setTimeout(() => {
      setId(item?._id);
      setSelectedStatus(item?.booking_status_info)
    }, 400);
    setIsVisible(true);
  }

  useEffect(() => {
    if (isVisible) {
      getBookingStatuesFromServer()
    } else {
      resetState()
    }
  }, [isVisible])

  const filterTheList = (list, text) => {
    let nlist = list.slice().filter(x => x._id != selectedStatus?._id)
    if (text.trim() == "") {
      return nlist;
    } else {
      return nlist.slice().filter(x => x.title.toLowerCase().includes(text.trim().toLowerCase()))
    }

  }

  const getBookingStatuesFromServer = async () => {
    let res = await GET_BOOKING_STATUSES({ navigation, token, });
    if (res.code == 200) {
      setStatusList(res?.active_booking_status);
    }
  }

  const onSubmit = async () => {
    if (!selectedStatus) {
      showToast({ body: 'Please select booking status', title: "Alert", type: "info" })
    } else {
      let obj = {
        add_as_personal_note: addNotes,
        note: desc,
        status: selectedStatus
      }
      changeStausFromServer(obj)
    }
  }

  const changeStausFromServer = async (obj) => {
    setLoader(true);
    let res = await BOOKING_UPDATE_STATUS({ token, navigation, id, data: obj });
    setLoader(false);
    if (res.code == 200) {
      showToast({ body: res?.message, title: "Status Changed", type: "success" })
      onStatusChange?.(res?.booking);
      closeModal()
    }
  }


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
      style={{ margin: 0 }} >
      <SafeAreaView style={__styles.rootView}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
          <View>
            <MyText fontSize={18} type='medium' >Change Booking Status</MyText>
          </View>
          <Pressable
            onPress={closeModal}  >
            {icons.crosssWithCircle()}
          </Pressable>
        </View>
        <View style={__styles.rootInnerView}>
          <View style={{ flex: 1, marginTop: 20 }}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>

              <MyTouchableInput
                label='Booking Status'
                onPress={() => setOptionModalVisibility(true)}
                value={selectedStatus?.title}
                clearbutton={!!selectedStatus}
                onClearButtonPress={() => setSelectedStatus(null)}
              />


              <View style={__styles.radioRootView}>
                <MyText isLabel>Would you like to add it to Personal Notes? *</MyText>
                <View style={__styles.radioView}>
                  <View style={__styles.radioItem}>
                    <MyCheckBox
                      title='Yes'
                      onPress={() => setAddNotes(true)}
                      value={addNotes}
                    />
                  </View>
                  <View style={__styles.radioItem}>
                    <MyCheckBox
                      title='No'
                      onPress={() => setAddNotes(false)}
                      value={!addNotes}
                    />
                  </View>
                </View>
              </View>


              <Editor
                label='Note'
                backgroundColor={colors.secondarySelect}
                height={150}
                initialValue={desc}
                onChange={(text) => setDesc(text)}
              />

              <MyButton
                style={{ marginTop: 10 }}
                invert
                title='Update'
                onPress={onSubmit}
              />



            </KeyboardAwareScrollView>
          </View>
        </View>

        <OptionModalWithSearch
          optionList={statusList}
          closeModal={() => setOptionModalVisibility(false)}
          isVisible={optionModalVisibility}
          filterTheList={filterTheList}
          title='Status'
          onSelected={(opt) => {
            setOptionModalVisibility(false)
            setSelectedStatus(opt);
          }}
        />

        <MyLoader enable={loader} />
      </SafeAreaView>
    </Modal>
  )
})

export default ChangeStatusModal

const __styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  rootInnerView: {
    paddingHorizontal: 20,
    flex: 1,
  },
  radioRootView: {

    marginBottom: 15
  },
  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },
})