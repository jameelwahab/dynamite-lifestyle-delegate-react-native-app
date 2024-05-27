import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyCheckBox from '../../../components/MyCheckBox';
import MyText from '../../../components/MyText';
import { TransparentButton } from '../../../components/MyButton';
import showToast from '../../../functions/showToast';
import Toast from 'react-native-toast-message';


const EventOptionModal = forwardRef(({title, onAgree }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState("")
  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])


  const openModal = () => {
    setValue("")
    setIsVisible(true)
  }

  const closeModal = () => {
    setIsVisible(false);
  }

  const submit = () => {
    if (!!value == false) {
      showToast({ title: "Alert", body: "Please select an option!", type: "info" })

    } else {
      onAgree?.(value)
      closeModal()
    }
  }



  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn='zoomIn'
      animationOut='zoomOut'
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 10 }}>
      <View style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10 }} >
        <View style={{ marginVertical: 10 }}>
          <MyText isHeading>{title}</MyText>
        </View>
        <View style={{ paddingTop: 10 }}>
          <MyCheckBox
            circle
            title='This Event'
            value={value == "current"}
            onPress={() => setValue("current")}
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <MyCheckBox
            circle
            title='This and following events'
            value={value == "current_and_after"}
            onPress={() => setValue("current_and_after")}
          />
        </View>
        <View style={{ paddingTop: 10 }}>
          <MyCheckBox
            circle
            title='All Events'
            value={value == "all"}
            onPress={() => setValue("all")}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TransparentButton title='CANCEL'
            onPress={closeModal}
          />

          <TransparentButton title='AGREE'
            onPress={submit}
          />
        </View>
      </View>
    {isVisible && <Toast/>}
    </Modal>
  )
})

export default EventOptionModal