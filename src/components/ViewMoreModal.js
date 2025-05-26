import { View, Text, Pressable, FlatList, SafeAreaView } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { icons } from '../utilities/icons'
import { colors } from '../utilities/colors';
import MyText from './MyText';
import Modal from 'react-native-modal'

const ViewMoreModal = forwardRef(({ renderItem }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [list, setList] = useState([]);
  const [type, setType] = useState("");


  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal,
    }
  }, [])


  const openModal = ({ title, data, type }) => {
    setIsVisible(true);
    setType(type);
    setTitle(title);
    setList(data);

  }
  const closeModal = () => {
    setIsVisible(false);
    setType("");
    setTitle("");
    setList([]);
  }


  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0 }}>
      <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, marginTop: "auto", borderTopLeftRadius: 10, borderTopRightRadius: 10, height: 700 }} >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", height: 40, alignItems: "center", paddingHorizontal: 10 }}>
            <View style={{ flex: 1 }} >
              <MyText color={colors.primary} fontSize={16} type='bold' >{title}</MyText>
            </View>
            <Pressable
              onPress={closeModal}
              style={{}}>
              {icons.crosss(colors.primary)}
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => renderItem({ item, index, type })}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
})

export default ViewMoreModal