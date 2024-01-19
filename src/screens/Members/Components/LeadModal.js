import { View, Text, StyleSheet, Pressable, SafeAreaView, FlatList, TouchableHighlight, ScrollView } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal'
import { icons } from '../../../utilities/icons';
import { CHANGE_LEAD_STATUS, EDIT_LEAD_STATUS, LEAD_STATUS_LIST } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import Toast from 'react-native-toast-message';
import MyTouchableInput from '../../../components/MyTouchableInput';
import MyInputs from '../../../components/MyInputs';
import { MyButton } from '../../../components/MyButton';
import moment from 'moment';
import { dateTimeFormat } from '../../../utilities/constants';
import CalendarModal from '../../../components/CalendarModal';
import showToast from '../../../functions/showToast';
import ConfirmationModal from '../../../components/ConfirmationModal';

const LeadModal = forwardRef(({ token, navigation, updateLeadStatus, memberId, oldLead, edit = false }, ref) => {
  const calendarModalRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [loader, setLoader] = useState(false)
  const [rootLoader, setRootLoader] = useState(false);
  const [list, setList] = useState([]);
  const [leadModaVisible, setLeadModaVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [icome, setIcome] = useState("0");
  const [date, setDate] = useState(moment());
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {
    console.log(oldLead, "oldLead")
    if (isVisible) {
      if (edit) {
        console.log(moment(oldLead?.changed_date_time).format(dateTimeFormat.date), "oldLead")
        setSelectedLead(!!oldLead ? oldLead?.lead_status : null)

        setIcome(!!oldLead?.income_value ? oldLead?.income_value : "0")
        setTimeout(() => {
          setDate(moment(oldLead?.changed_date_time))
        }, 200);
      } else {
        setSelectedLead(!!oldLead ? oldLead : null)
      }
    }
  }, [isVisible])

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    }
  }, [])

  const closeModal = () => {
    setIsVisible(false);
    setLeadModaVisible(false);
    setIcome("0");
    setSelectedLead(null);
    setList([]);
  }


  const openModal = () => {
    setIsVisible(true);
    setLoader(true);
    getLeadStatusList(null);
    setDate(moment());
  }

  const getLeadStatusList = async () => {
    let res = await LEAD_STATUS_LIST({ token, navigation });
    if (res.code == 200) {
      setList(res.lead_status)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const onAgreeClick = () => {
    setIsConfirmationVisible(false);
    setRootLoader(true);
    changeLeadStatusForMember()
  }

  const onUpdateBtnPress = () => {
    if (!!selectedLead == false) {
      showToast({ body: "Please select lead status", title: "Alert", type: "info" })
      return
    } else {
      if (edit) {
        updateLeadStatusForMember();
      } else {
        setIsConfirmationVisible(true);
      }

      // selectLeadStatus({ income: icome, date: moment(date).format('YYYY-MM-DD'), leadId: selectedLead?._id })
      // setRootLoader(true);
    }
  }

  const updateLeadStatusForMember = async () => {
    let res = await EDIT_LEAD_STATUS({
      token, navigation, body: {
        changed_date_time: moment(date).format('YYYY-MM-DD'),
        income_value: Number(icome),
        lead_status: selectedLead?._id,
        member_id: memberId,
        id: oldLead?._id
      }
    });

    if (res.code == 200) {
      setRootLoader(false);
      setIsVisible(false)
      updateLeadStatus?.();
      setIcome("0");
      setDate(moment())
      setSelectedLead(null)
      showToast({ title: "Success", body: res.message, type: "success" })
    } else {
      setRootLoader(false);
    }
  }

  const changeLeadStatusForMember = async () => {
    let res = await CHANGE_LEAD_STATUS({
      token, navigation, body: {
        changed_date_time: moment(date).format('YYYY-MM-DD'),
        income_value: Number(icome),
        lead_status: selectedLead?._id,
        member_id: memberId,

      }
    });

    if (res.code == 200) {
      setRootLoader(false);
      setIsVisible(false)
      updateLeadStatus(selectedLead, icome, date);
      setIcome("0");
      setDate(moment())
      setSelectedLead(null)
      showToast({ title: "Success", body: res.message, type: "success" })
    } else {
      setRootLoader(false);
    }
  }

  const modalLead = () => {
    return (
      <Modal
        isVisible={leadModaVisible}
        onBackButtonPress={() => setLeadModaVisible(false)}
        onBackdropPress={() => setLeadModaVisible(false)}
        useNativeDriverForBackdrop={true}
        style={{ margin: 0 }}
        animationInTiming={300}
        animationOutTiming={300}
      >
        <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 0.8, marginTop: "auto", backgroundColor: colors.secondary }}>

          <View style={ModalStyle.container}>

            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
              <View>
                <MyText fontSize={18} type='medium' >Lead Status</MyText>
                <MyText color={colors.lightText} fontSize={12}>Select Lead Status from list below</MyText>
              </View>
              <Pressable onPress={() => setLeadModaVisible(false)}>
                {icons.crosssWithCircle()}
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={list}
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        height: 0.3,
                        width: '100%',
                        alignSelf: 'center',
                        backgroundColor: '#B4B4B5',
                      }}
                    />
                  )}
                  contentContainerStyle={{ paddingBottom: 30 }}
                  renderItem={({ item, index }) => (
                    <TouchableHighlight
                      onPress={() => {
                        setSelectedLead(item)
                        setLeadModaVisible(false)
                      }}
                      underlayColor={colors.darkSecondary}>
                      <View
                        style={{
                          paddingVertical: 15,
                          paddingHorizontal: 10,
                        }}>

                        <View style={{ marginLeft: 10 }}>
                          <MyText fontSize={16} color={colors.white}>
                            {item?.title}
                          </MyText>
                        </View>

                      </View>
                    </TouchableHighlight>
                  )}
                />
              </View>
              <MyLoader enable={loader} />

            </View>
          </View>
        </SafeAreaView>
        {isVisible && <Toast />}
      </Modal>)
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
      animationIn={"slideInRight"}
      animationOut={"slideOutRight"}
      animationInTiming={300}
      animationOutTiming={300}
    >
      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 1, marginTop: "auto", backgroundColor: colors.secondary }}>
        <View style={[ModalStyle.container]}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, }}>
            <Pressable onPress={closeModal}>
              {icons.back(colors.primary, 25)}
            </Pressable>
            <View style={{ marginLeft: 10 }}>
              <MyText fontSize={18} color={colors.primary} type='medium' >{edit ? "Edit History Lead Status" : "Change Lead Status"}</MyText>
              {/* <MyText color={colors.lightText} fontSize={12}>Select Lead Status from list below</MyText> */}
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
              <View pointerEvents={edit ? "none" : "auto"} opacity={edit ? 0.6 : 1}>
                <MyTouchableInput
                  label='Lead Status*'
                  icon={() => icons.down(colors.primary, 20)}
                  onPress={() => setLeadModaVisible(true)}
                  value={!!selectedLead && selectedLead?.title}
                  placeholder='Please select the lead status'
                />
              </View>
              <MyInputs
                label='Income*'
                value={icome}
                onChangeText={(text) => setIcome(text)}
                keyboardType="number-pad"
              />

              <MyTouchableInput
                label='Date*'
                value={moment(date).format(dateTimeFormat.date)}
                icon={() => icons.calendar(colors.primary, 20)}
                onPress={() => calendarModalRef?.current?.openModal()}
              />

              <MyButton invert title='Update' onPress={onUpdateBtnPress} />
            </ScrollView>
          </View>
        </View>

        <CalendarModal ref={calendarModalRef}
          onDateSelected={(selectedDate) => setDate(selectedDate)} />
        <ConfirmationModal
          isVisible={isConfirmationVisible}
          title={"Are you sure you want to update lead status?"}
          onAgree={onAgreeClick}
          closeModal={() => setIsConfirmationVisible(false)}
        />
        {modalLead()}
        <MyLoader enable={rootLoader} />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary }} />
      {isVisible && <Toast />}
    </Modal>
  )
})

export default LeadModal;


const ModalStyle = StyleSheet.create({
  title: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  modal: {
    margin: 0,
    marginTop: 'auto',
    flex: Platform.OS == 'android' ? 0.99 : 0.95,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  searchView: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryVariant,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10
  },
  flatlistItemText: {
    fontSize: 16,
    paddingVertical: 15,
    fontWeight: 'bold',
  },
});
