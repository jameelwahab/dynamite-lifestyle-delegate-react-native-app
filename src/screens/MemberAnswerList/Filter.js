import { View, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../components/RootView'
import MyTouchableInput from '../../components/MyTouchableInput'
import OptionModal from '../../components/OptionModal'
import { MyButton, MyClearButton } from '../../components/MyButton'
import routes from '../../navigation/routes'
import { colors } from '../../utilities/colors'

const Filter = ({ navigation, route }) => {
  const { filters } = route?.params
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    selectedItem: null,
  });
  const [appliedFilters, setAppliedFilters] = useState({
    createdFor: !!filters?.createdFor ? filters?.createdFor : null,
  })

  const onSubmit = () => {
    navigation.navigate(routes.memberAnswersList, {
      appliedFilters
    })
  }

  const onClear = () => {
    navigation.navigate(routes.memberAnswersList, {
      appliedFilters: { createdFor: null }
    })
  }

  const onOptionSelected = (opt) => {
    closeOptionModal()
    setTimeout(() => {
      setAppliedFilters({
        createdFor: opt
      })
    }, 200);
  }





  const openOptionModal = () => {
    setOptionModal({ isVisible: true, selectedItem: null, })
  }

  const closeOptionModal = () => {
    setOptionModal({ isVisible: false, selectedItem: null, })
  }



  return (
    <RootView title='Filter' >
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 5 }}
      >


        <MyTouchableInput
          label='Created For'
          onPress={() => openOptionModal()}
          value={appliedFilters?.createdFor?.title}
          clearbutton={!!appliedFilters?.createdFor?.title}
          onClearButtonPress={() => setAppliedFilters({ createdFor: null })}

        />




        <View style={{ flexDirection: "row", }}>

          <MyClearButton
            style={{ flex: 1, marginRight: 10 }}
            title='Clear Filter'
            onPress={onClear}
          />


          <MyButton
            style={__styles.btn}
            title='Submit'
            onPress={onSubmit}
          />


        </View>
      </ScrollView>


      <OptionModal
        optionList={CREATED_FOR_LIST}
        isVisible={optionModal?.isVisible}
        onSelected={onOptionSelected}
        closeModal={closeOptionModal}
        noIcon

      />



    </RootView>
  )
}

export default Filter;


const __styles = StyleSheet.create({
  clearBtn: {
    // marginTop: 20,
    borderColor: colors.delete,
    backgroundColor: colors.delete + "22",
    marginRight: 10
  },
  clearBtnText: {
    color: colors.delete
  },
  btn: {
    flex: 1
  }
})

const CREATED_FOR_LIST = [
  {
    created_for: "lesson",
    title: "Lesson Questions",
  },
  {
    created_for: "programme",
    title: "Delegate Questions",
  },
  {
    created_for: "self_image",
    title: "Self Image Questions",
  },
  {
    created_for: "page",
    title: "Page Questions",
  },
  {
    created_for: "90-day-questions",
    title: "90 Day Questions",
  },
  {
    created_for: "delegate-90-day-questions",
    title: "90 Day Questions For Delegate",
  },
  {
    created_for: "dynamite_event_video",
    title: "Dynamite Event Video Questions",
  },
];