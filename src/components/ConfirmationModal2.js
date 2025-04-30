
import { View, Text, SafeAreaView } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import MyText from './MyText'
import { TransparentButton } from './MyButton'
import { colors } from '../utilities/colors'

const ConfirmationModal2 = forwardRef(({ }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({
    title: "",
    subtitle: "",
    showAgreeBtnOnly: false,
    agreeFunc: () => { }
  })
  const { title, subtitle, showAgreeBtnOnly, agreeFunc } = data

  const closeModal = () => {
    setIsVisible(false)
    setData({
      title: "",
      subtitle: "",
      showAgreeBtnOnly: false,
      agreeFunc: () => { }
    })

  }

  const openModal = ({ title = "", subtitle = "", showAgreeBtnOnly = false, agreeFunc = () => { } }) => {
    setIsVisible(true)

    setData({
      title, subtitle, showAgreeBtnOnly, agreeFunc
    })
  }

  const onAgree = () => {
    closeModal?.();
    setTimeout(() => {
      agreeFunc?.()
    }, 400);
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
      animationIn='zoomIn'
      animationOut='zoomOut'
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 10 }}>
      <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
        <View style={{ margin: 10 }}>
          <View style={{ margin: 10 }}>
            <MyText fontSize={18} type='medium' color={colors.primary}>
              {title}
            </MyText>
            {!!subtitle &&
              <MyText 
								style={{marginTop:5}}
								fontSize={16}
								color={colors.white}
								>
                {subtitle}
              </MyText>}
          </View>


          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
            {!showAgreeBtnOnly &&
              <TransparentButton title='CANCEL' onPress={closeModal} />}
            <TransparentButton title='AGREE' onPress={onAgree} />
          </View>

        </View>
      </SafeAreaView>
    </Modal>)
})

export default ConfirmationModal2
