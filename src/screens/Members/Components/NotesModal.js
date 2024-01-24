import { View, Text, FlatList, StyleSheet, SafeAreaView, Pressable } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { convertTimezone } from '../../../functions/convertTime';
import { dateTimeFormat } from '../../../utilities/constants';
import { useSelector } from 'react-redux';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import { icons } from '../../../utilities/icons';
import MyWebview from '../../../components/MyWebview';
import routes from '../../../navigation/routes';
const NotesModal = forwardRef(({ memberId, navigation, updateNotes }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [list, setList] = useState([])
  const timezone = useSelector(selectTimeZone)

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])

  const openModal = (notes) => {
    setIsVisible(true);
    setList(notes);
  }

  const closeModal = () => {
    setIsVisible(false);
    setList([]);
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
      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: "auto", backgroundColor: colors.secondary, flex: 0.8 }}>
        <View style={{ padding: 10, paddingHorizontal: 20, paddingTop: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <MyText color={colors.primary} fontSize={20} type='bold' >Notes</MyText>
            <Pressable
              style={{ marginLeft: 10 }}
              onPress={() => {
                closeModal()
                navigation.navigate(routes.memberNotesListing, {
                  for: "members",
                  memberId,
                  updateNotes: updateNotes
                })
              }}>
              {icons.plusCircle(colors.primary, 20)}
            </Pressable>
          </View>

          <View style={{}}>

            <Pressable onPress={closeModal}>
              {icons.crosssWithCircle(colors.white, 25)}
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={list}
            contentContainerStyle={{ paddingTop: 10 }}
            renderItem={({ item, index }) => (
              <View style={{ paddingHorizontal: 20, }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={__styles.noteView}>
                    <MyText color={colors.black} fontSize={14} >{index + 1}</MyText>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <MyText fontSize={12} color={colors.lightText2} >{convertTimezone(item?.note_date_time, timezone).format(dateTimeFormat.date)}</MyText>
                  </View>
                </View>
                <View style={{ marginTop: 5 }}>
                  {/* <MyText>{}</MyText> */}
                  <MyWebview fullWidth html={item?.note} />
                </View>
                <View style={{ height: 0.7, width: "100%", backgroundColor: colors.lightText, marginTop: 10, marginBottom: 20, borderRadius: 10 }} />
              </View>
            )}
          />
        </View>

      </SafeAreaView>
    </Modal>
  )
})

export default NotesModal


const __styles = StyleSheet.create({

  noteView: {
    height: 20, width: 20, borderRadius: 20 / 2, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center"
  },


})