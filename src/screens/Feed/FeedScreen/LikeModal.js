import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import EmptyView from '../../../components/EmptyView';
import MyLoader from '../../../components/MyLoader';
import Modal from 'react-native-modal';
import utilities from '../../../utilities';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import UserImage from '../../../components/UserImage';
import { S3_URL, dateTimeFormat } from '../../../utilities/constants';
import { convertTimezone } from '../../../functions/convertTime';
import FooterLoader from '../../../components/FooterLoader';


const LikeModal = ({
  isVisible,
  closeModal,
  likes = [],
  timezone,
  user,
  loader,
  onEndReached,
  footerLoader,
  onMessagePress,
  type = "like"
}) => {


  const userLikeView = ({ item, index }) => {
    return (
      <View style={type == "report" ? __style.boxReportView : {}}>
        <View style={__style.boxView}>
          <View>
            <UserImage
				      borderWidth={2}
						  borderColor={item?.user_info_action_by?.badge_level_info?.color_code}
              image={item?.user_info_action_by?.profile_image}
              name={item?.user_info_action_by?.name}
              size={35}
            />
            {type == "like" &&
              <View style={{ position: "absolute", bottom: 0, right: -5 }}>
                {icons.heartFilled(colors.heart, 15)}
              </View>}
          </View>
          <View style={{ marginLeft: 10, flex: 1, }}>
            <View style={{}}>
              <MyText fontSize={13} type='bold' >{item?.user_info_action_by?.name}</MyText>
              <MyText style={{ marginTop: 3 }} fontSize={10} color={colors.lightText2} >{convertTimezone(item?.createdAt, timezone).format(dateTimeFormat.dateTimeWithText("at"))}</MyText>
            </View>

          </View>
          {user?.is_chat_allow && item?.user_info_action_by?.action_by == 'member_user' &&
            <TouchableOpacity
              onPress={() => onMessagePress?.(item)}
              style={{ padding: 10, }}>
              {icons.message(colors.primary, 20)}
            </TouchableOpacity>}
        </View>
        {!!item?.report_reason &&
          <View style={{ marginLeft: 10, padding: 5 }}>
            <MyText type='medium' >{item?.report_reason}</MyText>
          </View>}
      </View>
    )
  }

  const modalLike = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriverForBackdrop={true}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={400}
        animationOutTiming={400}
        avoidKeyboard={true}
        style={{ margin: 0, marginHorizontal: 5 }}>
        <SafeAreaView style={{ flex: 1 }} >
          <View style={__style.rootView}>
            <View style={__style.headingView}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>

                {type == "report" ? icons.warnOctagon(colors.primary, 18) : icons.heartFilled(colors.heart, 25)}
                <View style={{ marginLeft: 5 }}>
                  <MyText fontSize={18} type='medium' >{type == "report" ? "Reported Users" : "Likes"}</MyText>
                </View>
                {/* <MyText color={colors.lightText} fontSize={12}>Select your country from list below</MyText> */}
              </View>
              <Pressable onPress={closeModal}>
                {icons.crosssWithCircle()}
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <FlatList
                data={likes}
                showsVerticalScrollIndicator={false}
                renderItem={userLikeView}
                onEndReached={onEndReached}
                keyExtractor={(item) => item?._id}
                // ListEmptyComponent={!loader && <EmptyView label={"No Likes Exist"} />}
                ListFooterComponent={<FooterLoader enable={footerLoader} />}
              />
            </View>

            <MyLoader enable={loader} />
          </View>
        </SafeAreaView>
      </Modal>)
  }

  return (
    <View>
      {modalLike()}
    </View>
  )
}

export default LikeModal;

const __style = StyleSheet.create({
  rootView: {
    // flex: 1,
    borderRadius: 20,
    backgroundColor: colors.secondaryVariant,
    height: utilities.screenHeight() / 2,
    marginTop: "auto",
    marginBottom: "auto"
  },
  headingView: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText
  },
  boxReportView: {
    borderWidth: 1 / 2,
    borderColor: colors.primary2,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 5
  },
  boxView: {

    flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, marginTop: 5,

  }
})
