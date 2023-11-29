import { View, Text, SafeAreaView, FlatList, Image, TouchableHighlight } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import { colors } from '../utilities/colors'
import MyText from './MyText'


const OptionModal = ({
  isVisible,
  closeModal,
  onSelected,
  optionList
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 0 }}>
      <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, }} >
        <FlatList
          data={optionList}
          scrollEnabled={false}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item, index }) => (
            <TouchableHighlight
              onPress={() => onSelected?.(item)}
              underlayColor={colors.secondary} >
              <View style={{ paddingVertical: 12, flexDirection: "row", alignItems: "center", paddingLeft: 20 }}>
                <View style={{ height: 25, width: 25 ,justifyContent:"center",alignItems:"center"}}>
                  {typeof (item.icon) == "function" ? item.icon() :
                    <Image source={item.icon} style={{ height: 25, width: 25, tintColor: colors.primary }} />}
                </View>
                <View style={{ marginLeft: 10 }}>

                  <MyText fontSize={16} >{item.title}</MyText>
                </View>
              </View>
            </TouchableHighlight>
          )}
        />
      </SafeAreaView>
    </Modal>)
}

export default OptionModal