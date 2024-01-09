import { View, Text, SafeAreaView, StyleSheet, FlatList, Pressable, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import utilities from '../../../utilities';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import CollapsibleText from '../../../components/CollapsibleText';
import UserImage from '../../../components/UserImage';
import { convertTimezone } from '../../../functions/convertTime';
import { icons } from '../../../utilities/icons';
import { fonts } from '../../../utilities/fonts';
import EmptyView from '../../../components/EmptyView';
import MyLoader from '../../../components/MyLoader';

const CommentModal = ({
  isVisible,
  closeModal,
  comments = [],
  timezone,
  user,
  loader,
  focus
}) => {
  console.log(comments, "comments")

  const commentView = (item, index, isChild) => {
    return (
      <View>

        <View style={[__style.commentView, { marginLeft: isChild ? "10%" : undefined }]}>
          <View style={__style.profiletView}>
            <UserImage
              image={item?.user_info_action_for?.profile_image}
              name={item?.user_info_action_for?.name}
              size={30}
              backgroundTransparent
            />

            <View style={__style.profiletNameView}>
              <MyText fontSize={13} type='bold' >{item?.user_info_action_for?.name}</MyText>
              <View style={{ marginTop: 3 }}>
                <MyText color={colors.lightText2} fontSize={10}>{convertTimezone(item?.createdAt, timezone).format("DD MMM YYYY [at] hh:mm A")}</MyText>
              </View>
            </View>
            {user?._id == item?.user_info_action_for?.action_id &&
              <TouchableOpacity style={__style.menuIconBtn}>
                {icons.threeDots(colors.primary, 12)}
              </TouchableOpacity>}
            <View>

            </View>
          </View>
          <CollapsibleText>{item?.message}</CollapsibleText>

          <View style={[__style.commentActionView, { marginTop: 5 }]}>
            <View style={[__style.commentActionView, { flex: 1 }]}>
              <TouchableOpacity style={__style.actionBtnView}>
                <MyText color={item?.is_liked ? colors.primary : colors.text} fontSize={13} type='medium' >{item?.is_liked ? "Liked" : "Like"}</MyText>
              </TouchableOpacity>
              {!isChild &&
                <TouchableOpacity style={[__style.actionBtnView, { marginLeft: 10 }]}>
                  <MyText type='medium' color={colors.text} fontSize={13} >{"Reply"}</MyText>
                </TouchableOpacity>}
            </View>
            {item?.like_count > 0 &&
              <View style={__style.commentActionView}>
                <View style={__style.likeView}>
                  {icons.heartFilled(colors.heart, 15)}
                </View>
                <View style={[__style.likeView, { marginLeft: -2 }]}>
                  <MyText>{item?.like_count}</MyText>
                </View>
              </View>}

          </View>
        </View>

        {item?.child_comment?.map((item2, index2) => commentView(item2, index2, true))}

      </View>
    )
  }

  const commentModal = () => (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={500}
      avoidKeyboard={true}
      style={{ margin: 0, }}>
      <SafeAreaView style={{ flex: 1 }} >
        <View style={__style.rootView}>
          <View style={__style.headingView}>
            <View>
              <MyText fontSize={18} type='medium' >Comments</MyText>
              {/* <MyText color={colors.lightText} fontSize={12}>Select your country from list below</MyText> */}
            </View>
            <Pressable onPress={closeModal}>
              {icons.crosssWithCircle()}
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              data={comments}
              renderItem={({ item, index }) => commentView(item, index, false)}
              ListEmptyComponent={!loader && <EmptyView label={"No comment exist"} />}
              showsVerticalScrollIndicator={false}
            />
          </View>
          <View style={__style.inputRootView}>
            <View style={__style.textInputView}>
              <TextInput
                style={__style.input}
                selectionColor={colors.selection}
                multiline={true}
                textAlignVertical="top"
                placeholder='Write a comment...'
                placeholderTextColor={colors.placeholder}
                keyboardAppearance="dark"
                autoFocus={focus}
              />
            </View>
            <TouchableOpacity style={__style.btnView}>
              {icons.send(colors.white, 18)}
            </TouchableOpacity>
          </View>
        </View>
        <MyLoader enable={loader} />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 0, backgroundColor: colors.secondaryVariant }} />
    </Modal>
  )

  return (
    <View>
      {commentModal()}
    </View>
  )
}

export default CommentModal;

const __style = StyleSheet.create({
  rootView: {
    marginTop: "auto",
    // height: fle,
    // width: "100%",
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.secondaryVariant,
  },
  headingView: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText
  },
  commentView: {
    backgroundColor: colors.secondarySelect,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 5

  },
  profiletView: {
    flexDirection: "row",
    alignItems: "center"
  },
  profiletNameView: {
    marginLeft: 10,
    flex: 1
  },
  actionBtnView: {
    paddingRight: 10,
    paddingVertical: 5
  },

  menuIconBtn: {
    height: 22,
    width: 22,
    backgroundColor: colors.lightPrimary3,
    borderRadius: 22 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  commentActionView: {
    flexDirection: "row",
    alignItems: "center"
  },

  inputRootView: { flexDirection: "row", alignItems: "flex-end", paddingVertical: 10 },
  textInputView: {
    minHeight: 40,
    backgroundColor: colors.secondary,
    marginHorizontal: 10,
    borderRadius: 10,
    maxHeight: 80,
    padding: 5,
    flex: 1
  },
  input: {
    color: colors.white,
    fontFamily: fonts.regular,
    margin: 0,
    padding: 0,
  },
  btnView: {
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    marginRight: 10,
    marginBottom: 2.5
  },
  likeView: {
    borderWidth: 0.5, borderColor: colors.lightPrimary2, borderRadius: 999, height: 20, width: 20, alignItems: 'center', justifyContent: "center"
  }
})