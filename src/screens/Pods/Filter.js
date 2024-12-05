import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import MyTouchableInput from '../../components/MyTouchableInput'
import { MyButton, MyClearButton } from '../../components/MyButton'
import { colors } from '../../utilities/colors'
import OptionModal from '../../components/OptionModal'
import routes from '../../navigation/routes'

const Filter = ({ navigation, route }) => {
  const [filter, setFilter] = useState(route?.params?.filters);

  const [options, setOptions] = useState({ isVisible: false, type: "", list: [] })

  const closeModal = () => { setOptions({ isVisible: false, type: "", list: [] }) }
  const onClearButtonPress = () => {
    navigation.navigate(route?.params?.screen, {
      filters: {
        communityLevel: { title: "All", key: "all" },
        podType: { title: "All", key: "all" },
      }
    })
  }

  const onSubmitButtonPress = () => {
    navigation.navigate(route?.params?.screen, { filters: filter })
  }

  return (
    <RootView title='Filter' >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}>

        <MyTouchableInput
          label='Community Level'
          value={filter?.communityLevel?.title}
          onPress={() => setOptions({ isVisible: true, type: "communityLevel", list: communityLevels })}
        />
        {!route?.params?.isBookCall &&
          <MyTouchableInput
            label='Pod Type'
            value={filter?.podType?.title}
            onPress={() => setOptions({ isVisible: true, type: "podType", list: podTypeList })}
          />}



        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={onClearButtonPress}
          />



          <MyButton
            style={__styles.btn}
            title='Submit'
            onPress={onSubmitButtonPress}
          />

        </View>


        <OptionModal
          optionList={options.list}
          isVisible={options.isVisible}
          closeModal={closeModal}
          noIcon
          onSelected={(opt) => {
            setFilter({ ...filter, [options.type]: opt })
            closeModal()
          }}
        />

      </ScrollView>
    </RootView>
  )
}

export default Filter

const communityLevels = [
  {
    title: "All",
    key: "all"
  },
  {
    title: "Dynamite",
    key: "dynamite"
  },
  {
    title: "PTA",
    key: "pta"
  },
  {
    title: "Elite",
    key: "elite"
  },
  {
    title: "VIP Gold",
    key: "mastery"
  },
]


const podTypeList = [
  {
    title: "All",
    key: "all"
  },
  {
    title: "General",
    key: "gernal"
  },
  {
    title: "Automated",
    key: "automated"
  }
]


const __styles = StyleSheet.create({
  clearBtnText: {
    color: colors.delete
  },
  btn: {
    flex: 1
  },
  clearBtn: {
    // marginTop: 20,
    borderColor: colors.delete,
    backgroundColor: colors.delete + "22",
    marginRight: 10
  },
})