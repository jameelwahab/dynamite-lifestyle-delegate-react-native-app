import { View, Text, TouchableHighlight, SafeAreaView } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';

const SortModal = forwardRef(({ onSelected, alreadySelected }, ref) => {
  const [isVisible, setIsVisible] = useState(false);


  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const selectSort = (item) => {
    setIsVisible(false);
    onSelected(item)
  }

  const openModal = () => {
    setIsVisible(true);
  }

  const closeModal = () => {
    setIsVisible(false);
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      animationInTiming={300}
      animationOutTiming={300}
    >
      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: "auto", backgroundColor: colors.secondary }}>
        <View style={{ padding: 10, paddingHorizontal: 20, paddingTop: 20 }}>
          <MyText color={colors.primary} fontSize={20} type='bold' >Sort By</MyText>
        </View>
        <View>
          {sortList.slice().filter(x => x.key != alreadySelected?.key).map((item, index) => {
            return (
              <TouchableHighlight
                onPress={() => selectSort(item)}
                underlayColor={colors.secondarySelect} >
                <View style={{ paddingVertical: 12, justifyContent: "center", paddingLeft: 10 }}>
                  <View style={{ marginLeft: 10 }}>

                    <MyText fontSize={16} >{item.title}</MyText>
                  </View>
                </View>
              </TouchableHighlight>
            )
          })}
        </View>
      </SafeAreaView>
    </Modal>
  )
})

export default SortModal

const sortList = [
  {
    key: "registration_date_asc",
    title: "Registration Date (Oldest First)"
  },
  {
    key: "registration_date_desc",
    title: "Registration Date (Newest First)"
  },
  {
    key: "membership_expiry_date_asc",
    title: "Membership Expiry Date (Oldest First)"
  },
  {
    key: "membership_expiry_date_desc",
    title: "Membership Expiry Date (Newest First)"
  },
  {
    key: "last_login_date_asc",
    title: "Last Login Date (Oldest First)"
  },
  {
    key: "last_login_date_desc",
    title: "Last Login Date (Newest First)"
  },

]