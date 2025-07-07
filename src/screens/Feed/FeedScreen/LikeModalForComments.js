import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable, TouchableOpacity } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import EmptyView from '../../../components/EmptyView';
import MyLoader from '../../../components/MyLoader';
import Modal from 'react-native-modal';
import utilities from '../../../utilities';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import UserImage from '../../../components/UserImage';
import {  dateTimeFormat } from '../../../utilities/constants';
import { convertTimezone } from '../../../functions/convertTime';
import FooterLoader from '../../../components/FooterLoader';
import { GET_COMMENT_LIKES_LIST } from '../../../DAL';


let page = 0;
let canLoadMore = false;
let commentId = "";

const LikeModalForComments = forwardRef(({ navigation, token, timezone, user, onMessagePress, isChatAllowed }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [likes, setLikes] = useState([]);
  const [footerLoader, setFooterLoader] = useState(false);
  const [loader, setLoader] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      openLikeModal,
      // ... your methods ...
    };
  }, []);

  const closeLikeModal = (fid) => {
    commentId = ""
    setIsVisible(false);
    setLoader(false);
    setFooterLoader(false);
    setLikes([]);
    page = 0;
    canLoadMore = false;
  }
  const openLikeModal = (cId) => {
    commentId = cId
    setIsVisible(true);
    setLoader(true);
    getLikes();
  }
  const onEndReached = () => {
    if (canLoadMore) {
      canLoadMore = false;
      setFooterLoader(true)
      getLikes()
    }
  }
  const getLikes = async () => {
    let fd = new FormData();
    fd.append("comment", commentId);
    fd.append("action_type", "like");
    let res = await GET_COMMENT_LIKES_LIST({ navigation, token, body: fd, page: page });
    if (res.code == 200) {
      if (res?.total_pages > (1 + page)) {
        canLoadMore = true;
        page = page + 1;
      } else {
        canLoadMore = false;
      }
      setLikes([...likes, ...res?.feed_activity])
      setLoader(false);
      setFooterLoader(false)
    } else {
      setLoader(true);
      setFooterLoader(false)
    }
  }

  const userLikeView = ({ item, index }) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, marginTop: 5 }}>
        <View>
          <UserImage
            borderWidth={2}
            borderColor={item?.user_info_action_by?.badge_level_info?.color_code}
            image={item?.user_info_action_by?.profile_image}
            name={item?.user_info_action_by?.name}
            size={35}
          />
          <View style={{ position: "absolute", bottom: 0, right: -5 }}>
            {icons.heartFilled(colors.heart, 15)}
          </View>
        </View>
        <View style={{ marginLeft: 10, flex: 1 }}>
          <MyText fontSize={13} type='bold' >{item?.user_info_action_by?.name}</MyText>
          <MyText style={{ marginTop: 3 }} fontSize={10} color={colors.lightText2} >{convertTimezone(item?.createdAt, timezone).format(dateTimeFormat.dateTimeWithText("at"))}</MyText>
        </View>
        {isChatAllowed && item?.user_info_action_by?.action_by == 'member_user' &&
          <TouchableOpacity
            onPress={() => {
              onMessagePress?.(item)
              closeLikeModal()
            }}
            style={{ padding: 10, }}>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>}

      </View>
    )
  }

  const modalLike = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeLikeModal}
        onBackButtonPress={closeLikeModal}
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
                {icons.heartFilled(colors.heart, 25)}
                <View style={{ marginLeft: 5 }}>
                  <MyText fontSize={18} type='medium' >Likes</MyText>
                </View>
                {/* <MyText color={colors.lightText} fontSize={12}>Select your country from list below</MyText> */}
              </View>
              <Pressable onPress={closeLikeModal}>
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
                ListFooterComponent={<FooterLoader enable={footerLoader} />}
              />
              <MyLoader enable={loader} />
            </View>


          </View>
        </SafeAreaView>
      </Modal>)
  }

  return (
    <View>
      {modalLike()}
    </View>
  )
})

export default LikeModalForComments

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
})