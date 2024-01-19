import { View, Text, StyleSheet, Pressable, SafeAreaView, FlatList, TouchableHighlight, ScrollView } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal'
import { icons } from '../../../utilities/icons';
import MyLoader from '../../../components/MyLoader';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import Toast from 'react-native-toast-message';
import MyTouchableInput from '../../../components/MyTouchableInput';
import MyInputs from '../../../components/MyInputs';
import { MyButton } from '../../../components/MyButton';
import moment from 'moment';
import { dateTimeFormat } from '../../../utilities/constants';
import { DELETE_STATUS_HISTORY, LEAD_STATUS_HISTORY } from '../../../DAL';
import EmptyView from '../../../components/EmptyView';
import StatView from './StatView';
import OptionModal from '../../../components/OptionModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import LeadModal from './LeadModal';

const LeadHistoryModal = forwardRef(({ token, navigation, memberId }, ref) => {
  const leadModalRef2 = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [optionModal, setOptionModal] = useState({ isVisible: false, selectedObj: null });
  const [alertModal, setAlertModal] = useState({ isVisible: false, selectedObj: null });
  const [selectedLeadStatusForEdit, setSelectedLeadStatusForEdit] = useState(null);
  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const getHistory = async () => {

    let res = await LEAD_STATUS_HISTORY({ token, navigation, memberId: memberId, });
    if (res.code == 200) {
      setList(res.member?.lead_status_history);
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    if (isVisible) {
      setLoader(true)
      setTimeout(() => {
        getHistory()
      }, 200);
    } else {
      setList([])
    }
  }, [isVisible])

  const openModal = () => {
    setIsVisible(true);

  }

  const closeModal = () => {
    setIsVisible(false)
  }

  const onOptSelected = (opt) => {
    let item = optionModal?.selectedObj;
    setOptionModal({ isVisible: false, selectedObj: null })
    if (opt.key == "delete") {
      setTimeout(() => {
        setAlertModal({ isVisible: true, selectedObj: item })
      }, 400);
    } else if (opt.key == "edit") {
      setTimeout(() => {
        setSelectedLeadStatusForEdit(item)
        leadModalRef2.current?.openModal()
      }, 400);
    }
  }

  const onAgree = () => {
    setLoader(true)
    deleteTheStatus(alertModal?.selectedObj);
    setAlertModal({ isVisible: false, selectedObj: null })
  }
  const deleteTheStatus = async (obj) => {
    let res = await DELETE_STATUS_HISTORY({
      navigation, token, body: {
        id: obj?._id,
        lead_status: obj.lead_status?._id,
        member_id: memberId
      }
    })
    if (res.code == 200) {
      setList(list => list.filter(x => x._id != obj._id))
      setLoader(false);
    } else {
      setLoader(false);
    }
  }



  const modalHistory = () => {
    const [searchText, setSearchText] = useState("")
    const searchFromList = list => {
      if (searchText.trim() != "") {
        return list.slice().filter(x => x.lead_status?.title.toLowerCase().includes(searchText.toLowerCase().trim()))
      }
      return list.slice()
    }

    const renderHistory = ({ item, index }) => {
      return (
        <View style={__styles.itemRoot} >
          <View style={__styles.itemProfile}>
            <View style={{ flex: 1 }}>
              <View style={[{ backgroundColor: item?.lead_status?.background_color, }, __styles.itemNameView]}>
                <MyText color={item?.lead_status?.text_color} >{item?.lead_status?.title}</MyText>
              </View>
            </View>
            <Pressable
              onPress={() => setOptionModal({ isVisible: true, selectedObj: item })}
              style={__styles.menuBtnView}>
              {icons.threeDots(colors.primary, 12)}
            </Pressable>
          </View>

          <StatView title={"Income Value"} value={item?.income_value} />
          <StatView title={"Action Info"} value={`${item?.action_info?.name}\n(${item?.action_info?.action_user_type.replace("_", " ")})`} />
          <StatView title={"Date"} value={moment(item?.changed_date_time).format(dateTimeFormat.date)} />
        </View>
      )
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
          <View style={[__styles.container]}>
            <View style={{ flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, }}>
              <Pressable onPress={closeModal}>
                {icons.back(colors.primary, 25)}
              </Pressable>
              <View style={{ marginLeft: 10 }}>
                <MyText fontSize={18} color={colors.primary} type='medium' >Lead Status History</MyText>
                {/* <MyText color={colors.lightText} fontSize={12}>Select Lead Status from list below</MyText> */}
              </View>
            </View>
            <View style={{ marginHorizontal: 15 }}>
              <MyInputs
                placeholder='Search...'
                leftIcon={icons.search}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                rightIcon={searchText.length > 0 ?
                  () => icons.crosssWithCircle(colors.white, 20) :
                  () => icons.noIcon()}
                rightIconOnPress={() => setSearchText("")}

              />
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={searchFromList(list)}
                renderItem={renderHistory}
                ListEmptyComponent={!loader && <EmptyView />}
              />
            </View>

          </View>
          <MyLoader enable={loader} />

          <LeadModal
            ref={leadModalRef2}
            navigation={navigation}
            token={token}
            updateLeadStatus={()=>{
              getHistory();
              setSelectedLeadStatusForEdit
            }}
            memberId={memberId}
            oldLead={selectedLeadStatusForEdit}
            edit={true}
          />


          <OptionModal
            isVisible={optionModal?.isVisible}
            onSelected={onOptSelected}
            optionList={optionList}
            closeModal={() => setOptionModal({ isVisible: false, selectedObj: false })}
          />

          <ConfirmationModal
            isVisible={alertModal?.isVisible}
            onAgree={onAgree}
            title={"Are you sure you want to delete it?"}
            closeModal={() => setAlertModal({ isVisible: false, selectedObj: false })}
          />
        </SafeAreaView>
        <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary }} />
        {isVisible && <Toast />}
      </Modal>)
  }

  return (
    <View>
      {modalHistory()}
    </View>
  )
})

export default LeadHistoryModal

const optionList = [
  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },
]

const __styles = StyleSheet.create({


  container: {
    flex: 1,
    paddingBottom: 10,
    // paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  itemRoot: { backgroundColor: colors.secondaryVariant, padding: 10, marginTop: 10, marginHorizontal: 15, borderRadius: 10, },
  itemProfile: { flexDirection: "row", alignItems: "center" },
  itemNameView: { alignSelf: "flex-start", borderRadius: 15, paddingVertical: 3, paddingHorizontal: 10 },
  menuBtnView: { backgroundColor: colors.lightPrimary2, height: 20, width: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" }


});