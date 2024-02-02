import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import { colors } from '../../../utilities/colors'
import OptionModal from '../../../components/OptionModal'

const FilterScreen = ({ navigation, route }) => {
  const { title, changeMode, mode } = route?.params;
  const [selectedMode, setSelectedMode] = useState(!!mode?mode:list[0]);
  const [optionModal, setOptionModal] = useState(false)

  const onClearPress = () => {
    setSelectedMode(null);
    changeMode?.(list[0]);
    navigation.goBack();
  }
  const onFilterPress = () => {
    changeMode?.(selectedMode);
    navigation.goBack();
  }

  return (
    <RootView title={"Filter " + title} >
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingTop: 10 }}
          style={{ paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false}>
          <MyTouchableInput
            label='Transaction Mode'
            onPress={() => setOptionModal(true)}
            value={!!selectedMode ? selectedMode?.title : ""}
            // subTextView={() => !!selectedMode && (
            //   <Pressable
            //     style={__styles.clearbtnView}
            //     onPress={() => setSelectedMode(null)}>
            //     <MyText color={colors.primary} >Clear</MyText>
            //   </Pressable>
            // )}
          />

          <View style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: 5 }}>
            <View>
              <MyButton onPress={onClearPress} style={__styles.btn} invert title='Clear' />
            </View>
            <View style={{ marginLeft: 15 }} >
              <MyButton onPress={onFilterPress} style={__styles.btn} textStyle={{ color: colors.black }} title='Filter' />
            </View>
          </View>
        </ScrollView>
      </View>
      <OptionModal
        isVisible={optionModal}
        closeModal={() => setOptionModal(false)}
        optionList={list}
        noIcon
        onSelected={(opt) => {
          setSelectedMode(opt);
          setOptionModal(false)
        }}
      />
    </RootView>
  )
}

export default FilterScreen;

const __styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 10,
    height: 35
  },
  clearbtnView: {
    paddingBottom: 5, paddingLeft: 10, paddingRight: 5
  },
})

const list = [{
  key: "all",
  title: "All"
},
{
  key: "sandBox",
  title: "Sand Box"
},
{
  key: "live",
  title: "Live"
}]