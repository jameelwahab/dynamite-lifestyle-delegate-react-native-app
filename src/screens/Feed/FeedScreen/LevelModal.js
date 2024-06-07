import { View, Text, SafeAreaView, FlatList, Pressable } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { colors } from '../../../utilities/colors';
import utilities from '../../../utilities';
import Modal from 'react-native-modal';
import { fonts } from '../../../utilities/fonts';
import MyText from '../../../components/MyText';
const LevelModal = forwardRef(({ feedLevel, selectFeedlevel, isCosmos, cosmosLevelList }, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      openLvlModal
    }
  }, [])
  const closeModal = () => {
    setIsVisible(false)
  }

  const openLvlModal = () => {
    console.log("openLvlModal func")
    setIsVisible(true)
  }

  const optionView = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          setIsVisible(false);
          setTimeout(() => {
            selectFeedlevel(item)
          }, 300);
        }}
        style={{
          backgroundColor: feedLevel == item ? colors.secondarySelect : undefined,
          paddingVertical: 20, alignItems: "center"
        }} >
        <MyText align='center' style={{ textTransform: item == "pta" ? "uppercase" : "capitalize" }} type='medium' >
          {`${item.split("_").join(" ")}${item == "marketing" ? " Team" : ""}`}
        </MyText>
      </Pressable>
    )
  }

  const modalLvl = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriverForBackdrop={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        hideModalContentWhileAnimating={true}
        style={{ margin: 0, }}>
        <SafeAreaView style={{ marginTop: "auto", }}>
          <View style={{
            backgroundColor: colors.secondary,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            maxHeight: utilities.windowHeight() * 0.7,
            overflow: "hidden"
          }}>

            <FlatList
              data={isCosmos ? cosmosLevelList : sourceOptions}
              renderItem={optionView}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
            />
          </View>


        </SafeAreaView>
        <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondary }} />
      </Modal>
    )
  }

  return (
    <View>
      {modalLvl()}
    </View>
  )
});

const options = ["all", 'delegate', 'consultnant'];
const sourceOptions = ["all", 'dynamite', 'pta', 'elite', 'mastery'];

export default LevelModal