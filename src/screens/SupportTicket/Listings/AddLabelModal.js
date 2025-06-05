import { View, Text, SafeAreaView, Pressable, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { useNavigation } from '@react-navigation/native';
import { ADD_OR_UPDATE_LABEL, GET_LABEL_LIST } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import Toast from 'react-native-toast-message';
import { Row } from '../../../UIComponents/FlexViews';
import MyCheckBox from '../../../components/MyCheckBox';
import FAB from '../../../components/FAB';
import MyInputs from '../../../components/MyInputs';
import ColorModal from '../../../components/ColorModal';
import MyTouchableInput from '../../../components/MyTouchableInput';
import { MyButton } from '../../../components/MyButton';
import showToast from '../../../functions/showToast';

const AddLabelModal = forwardRef(({ onChange }, ref) => {
  const navigation = useNavigation()
  const { token } = useSelector(selectUser)
  const [isVisible, setIsVisible] = useState(false);
  const [list, setList] = useState([])
  const [loader, setLoader] = useState(false)
  const [colorModal, setColorModal] = useState(false);
  const [text, setText] = useState("")
  const [color, setColor] = useState("#000000");
  const [selectedLabelId, setSelectedLabelId] = useState(undefined);


  const openModal = (label) => {
    setIsVisible(true);
    if (label) {
      setText(label?.label_text)
      setSelectedLabelId(label?._id)
      setColor(label?.label_color)
    }
  }

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setText("");
      setColor("#000000");
      setSelectedLabelId(undefined)
    }, 300);
  }


  const addLabelToServer = async () => {
    if (text.trim() == "") {
      showToast({ title: "Please add Label", type: "info" });
      return
    }
    setLoader(true)
    let res = await ADD_OR_UPDATE_LABEL({ navigation, token, color, text, labelId: selectedLabelId });
    setLoader(false)
    if (res?.code == 200) {
      onChange(res?.label)
      closeModal?.()
      showToast({ title: res?.message, type: "success" });
    }
  }




  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    }
  }, [])




  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      animationIn={"zoomIn"}
      animationOut={"zoomOut"}
      backdropOpacity={0.9}
      avoidKeyboard={true}
      style={{ margin: 5 }}>
      <View style={{ backgroundColor: colors.secondary, borderRadius: 10 }} >
        <View style={{}}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
            <View>
              <MyText fontSize={18} type='medium' >{selectedLabelId ? "Edit Label" : "Add Label"}</MyText>
            </View>
            <Pressable onPress={closeModal}>
              {icons.crosss(colors.white, 25)}
            </Pressable>
          </View>
          <View style={{ padding: 10 }}>
            {selectedLabelId &&
              <View style={{ marginVertical: 10, borderLeftWidth: 5, padding: 10, borderLeftColor: colors.primary, borderRadius: 5, backgroundColor: colors.darkSecondary }} >
                <MyText type='i'>
                  <MyText color={colors?.primary} type='bold' >Note: </MyText>This label will be updated in all support tickets</MyText>
              </View>}
            <View >
              <MyInputs
                label='Label*'
                autoFocus={true}
                value={text}
                onChangeText={(val) => setText(val)}
              />

              <MyTouchableInput
                onPress={() => setColorModal(true)}
                label='Color*'
                view={() => (
                  <View style={[__styles.colorView, { backgroundColor: color, }]} />
                )}
              />

              <View style={{ marginTop: 10, paddingHorizontal: "15%" }}>
                <MyButton
                  onPress={addLabelToServer}
                  title='Submit'
                />
              </View>

            </View>
          </View>


        </View>

        <ColorModal
          clodeModal={() => setColorModal(false)}
          getColor={(color) => setColor(color)}
          isVisible={colorModal}
          selectedColor={color}
        />


        <MyLoader enable={loader} />
      </View>
      {isVisible && <Toast />}
    </Modal>
  )
})

export default AddLabelModal


const __styles = StyleSheet.create({
  colorView: {
    borderWidth: 1,
    borderColor: colors.white,
    height: 30,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
})