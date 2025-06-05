import { View, Text, SafeAreaView, Pressable, FlatList, TouchableOpacity } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { useNavigation } from '@react-navigation/native';
import { ASSIGN_LABEL_IN_TICKET, DELETE_LABEL, GET_LABEL_LIST } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import Toast from 'react-native-toast-message';
import { Row } from '../../../UIComponents/FlexViews';
import MyCheckBox from '../../../components/MyCheckBox';
import FAB from '../../../components/FAB';
import AddLabelModal from './AddLabelModal';
import ConfirmationModal2 from '../../../components/ConfirmationModal2';
import showToast from '../../../functions/showToast';

const LabelModal = forwardRef(({ onUpdate }, ref) => {
  const ref_confirm = useRef()
  const ref_addLabel = useRef();
  const navigation = useNavigation()
  const { token } = useSelector(selectUser)
  const [isVisible, setIsVisible] = useState(false);
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(false);
  const [selected, setSelected] = useState([]);
  const [ticketId, setTicketId] = useState("")



  const getLabelListFromServer = async () => {
    let res = await GET_LABEL_LIST({ navigation, token });
    setLoader(false)
    if (res?.code == 200) {
      setList(res?.labels)
    }
  }


  const deleteLabelFromServer = async (labelId) => {
    setLoader(true)
    let res = await DELETE_LABEL({ navigation, token, labelId });
    if (res?.code == 200) {
      setList((lst) => lst.filter(x => x?._id != labelId))
      showToast({ title: res?.message, type: "success" });
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  const assignInTicket = async (labelsArr) => {
    let res = await ASSIGN_LABEL_IN_TICKET({ navigation, token, labelsArr, ticketId });
    if (res.code == 200) {
      onUpdate(labelsArr, ticketId);
    }

  }

  const onDeletePress = (item) => {
    ref_confirm?.current?.openModal({
      title: "Confirm Deletion",
      subtitle: "Are you sure you want to delete this Label",
      showAgreeBtnOnly: false,
      agreeFunc: () => deleteLabelFromServer(item?._id)
    })
  }

  const onEditPress = (item) => {
    ref_addLabel?.current?.openModal(item)

  }

  const updateInList = (item) => {
    let index = list.findIndex(x => x?._id == item?._id);
    console.log(index, "index")
    if (index > -1) {
      list.splice(index, 1, item)
    } else {
      list.unshift(item)
      // list = [item, ...list]
    }
    setList([...list])
  }


  const onSelect = (item) => {
    let index = selected.findIndex(x => x?._id == item?._id);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(item)
    }
    setSelected([...selected])
    assignInTicket(selected)

  }

  const openModal = (ticket) => {

    setIsVisible(true);
    setSelected(ticket?.labels)
    setTicketId(ticket?._id)
    setTimeout(() => {
      setLoader(true)
      getLabelListFromServer()
    }, 300);

  }

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setList([])
      setLoader(false)
      setTicketId("");
      setSelected([])
    }, 400);
  }

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    }
  }, [])





  const __renderItem = ({ item, index }) => {
    let isSelected = selected.some(x => x?._id == item?._id)
    return (
      <View>
        <Row alignItems="center" style={{ marginTop: 10, marginHorizontal: 10 }} >
          <MyCheckBox value={isSelected} circle pb={0} onPress={() => onSelect(item)} />
          <View style={{ flex: 1, paddingLeft: 10, justifyContent: "center", paddingVertical: 10, marginLeft: 10, borderRadius: 5, backgroundColor: colors.secondarySelect, borderLeftWidth: 5, borderColor: item?.label_color }}>
            <MyText type='medium' color={colors.primary} >{item?.label_text}</MyText>
          </View>
          <TouchableOpacity
            onPress={() => onEditPress(item)}
            style={{ padding: 5, backgroundColor: colors.primary + "22", borderRadius: 999, marginLeft: 10 }} >
            {icons.editpencil()}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeletePress(item)}
            style={{ padding: 5, backgroundColor: colors.primary + "22", borderRadius: 999, marginLeft: 10 }} >
            {icons.trash()}
          </TouchableOpacity>
        </Row>

      </View>
    )
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      // animationIn={"zoomIn"}
      // animationOut={"zoomOut"}
      // avoidKeyboard={true}
      style={{ margin: 0 }}>
      <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: 'auto', borderTopLeftRadius: 10, borderTopRightRadius: 10, minHeight: 700 }} >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
            <View>
              <MyText fontSize={18} type='medium' >Support Ticket Labels</MyText>
            </View>
            <Pressable onPress={closeModal}>
              {icons.crosss(colors.white, 25)}
            </Pressable>
          </View>

          <View style={{ flex: 1 }}>
            <FlatList

              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 70 }}
              data={list}
              renderItem={__renderItem}
            />
          </View>
          <FAB onPress={() => ref_addLabel?.current?.openModal()} />
        </View>
        <MyLoader enable={loader} />
      </SafeAreaView>

      <AddLabelModal
        ref={ref_addLabel}
        onChange={updateInList}
      />

      <ConfirmationModal2 ref={ref_confirm} />
      {isVisible && <Toast />}
    </Modal>
  )
})

export default LabelModal