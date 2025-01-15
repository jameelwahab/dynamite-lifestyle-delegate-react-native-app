import { View, Text } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import RootView from '../../../components/RootView'

const SmsModal = forwardRef(({ }, ref) => {
  const [isVisible, setIsVisible] = useState(false)

  const openModal = () => {
    setIsVisible(true)
  }

  const closeModal = () => {
    setIsVisible(false)
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
      style={{ margin: 10 }}>
      <RootView hideHeader >

      </RootView>
    </Modal>
  )
})

export default SmsModal