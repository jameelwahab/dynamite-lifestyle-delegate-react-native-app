
import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import MyText from './MyText'
import { TransparentButton } from './MyButton'
import { colors } from '../utilities/colors'

const ConfirmationModal = ({isVisible,closeModal,title,onAgree}) => {
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
          </View>


          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
            <TransparentButton title='CANCEL' onPress={closeModal} />
            <TransparentButton title='AGREE' onPress={onAgree} />
          </View>

        </View>
      </SafeAreaView>
    </Modal>)
}

export default ConfirmationModal