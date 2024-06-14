import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import UserImage from '../../../components/UserImage'
import MyText from '../../../components/MyText'
import { convertTimezone, convertTimezone2 } from '../../../functions/convertTime'
import { colors } from '../../../utilities/colors'
import { S3_URL, isDev } from '../../../utilities/constants'
import ImagesForFeed from './ImagesForFeed'
import { icons } from '../../../utilities/icons'
import MyWebview from '../../../components/MyWebview'
import MyImage2 from '../../../components/MyImage2'
import MyImage from '../../../components/MyImage'
import CollapsibleText from '../../../components/CollapsibleText'
import WebPlayer from '../../../components/WebPlayer'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import utilities from '../../../utilities'
import openUrl from '../../../functions/openUrl'
import DropShadow from "react-native-drop-shadow";
import { isHtml } from '../../../functions/regex'

export const FeedView = ({ item, index, user, token, isInView, timezone, settings, openComments, showLikes, openOptions, onLikebtnPress, isCosmos, sourceLevelIcons, isScheduledFeed, openScheduleTimeModal, onFeedDetail, isEventFeed }) => {


  const [animationState, setAnimationState] = useState(0)

  useEffect(() => {
    if (index == 1)
      if (isInView) {
        startAnimation()
      } else {
        setAnimationState(0)
      }
  }, [isInView])

  const startAnimation = () => {
    setAnimationState(1)
    setTimeout(() => {
      setAnimationState(0)
    }, 5000);
  }


  const animationView = () => {
    return (
      <>
        {!!item?.reward_data?.reward_feed_gif && animationState == 1 &&
          <View style={__style.animationView}>
            <Image
              indicatorProps={{ indeterminate: false }}
              source={{ uri: S3_URL + item?.reward_data?.reward_feed_gif }}
              style={{ height: "100%", width: "100%" }}

            />
          </View>}
      </>
    )
  }

  const profileView = () => (
    <View style={__style.profileView}>
      <View
        style={[__style.profileView, { flex: 1 }]} >
        <UserImage
          image={item?.action_info?.profile_image}
          name={item?.action_info?.name}
          backgroundTransparent={true}
          size={35}
        />
        <View style={__style.profileNameView}>
          <MyText type='bold'  >{item?.action_info?.name}</MyText>

          <View style={{ marginTop: 2 }}>
            <MyText type="light" color={colors.lightText2} fontSize={10}>{convertTimezone(item?.createdAt, timezone).format("DD MMM YYYY [at] hh:mm A")}</MyText>
          </View>
        </View>
      </View>
      {!item?.is_publish &&
        <TouchableOpacity
          onPress={() => openScheduleTimeModal(item?.schedule_date_time)}
          style={{ marginRight: 5 }}>
          <Image source={icons.schedule}
            style={{ tintColor: colors.primary, height: 25, width: 25 }}
          />
        </TouchableOpacity>}
      {!(!!isEventFeed) &&
        <View >
          <MyImage
            indicatorProps={{ color: colors.secondaryVariant }}
            source={{
              uri:
                isCosmos || isScheduledFeed ?
                  // item?.created_for_level_or_type == "delegate" ?
                  // S3_URL + settings?.delegate_feed_icon :
                  // item?.created_for_level_or_type == "consultant" ?
                  //   S3_URL + settings?.consultant_feed_icon :
                  //   item?.created_for_level_or_type == "marketing" ?
                  //     S3_URL + settings?.marketing_feed_icon :
                  //     item?.created_for_level_or_type == "inner_circle" ?
                  //       S3_URL + settings?.inner_circle_feed_icon :
                  S3_URL + settings?.[`${item?.created_for_level_or_type}_feed_icon`] :
                  S3_URL + sourceLevelIcons?.[`${item?.created_for_level_or_type}_badge`]
            }}
            style={__style.feedTypeIcon}
          />
        </View>}
      {(((isCosmos || isScheduledFeed) && user?._id == item?.action_info?.action_id) ||
        (!isCosmos && !isScheduledFeed)) &&
        <TouchableOpacity
          onPress={() => openOptions(item)}
          style={__style.profileTypeIconView}>
          {icons.threeDots(colors.primary, 15)}
        </TouchableOpacity>}
    </View>
  )

  const descriptionView = () => (
    <View style={__style.descriptionRootView}>
      {!!item?.description &&
        <>
          {/*  <MyText fontSize={13}>{item?.description}</MyText> */}
           {/* <CollapsibleText>{item?.description}</CollapsibleText> */}
          {isHtml(item?.description) ?
            <MyWebview enableCollapse={true} html={item?.description} /> :
            <CollapsibleText>{item?.description}</CollapsibleText>}
          {/* <MyWebview html={item?.description} />  */}
        </>
      }
      {item.feed_type == "image" && !!item?.feed_images && item?.feed_images.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <ImagesForFeed id={item._id} list={item.feed_images} />
        </View>
      )}

      {item.feed_type == "video" && item.video_url != '' && (
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <WebPlayer height={250} url={item.video_url} />
        </View>
      )}


      {isDev && item.feed_type == "live" && !!item?.image?.thumbnail_1 &&
        <View style={{ alignItems: "center", minHeight: 20 }} >
          <ResponsiveImage2
            width={utilities.screenWidth() - 40}
            uri={S3_URL + item?.image?.thumbnail_1}
          />
          {item.feed_type == "live" && (
            <View style={__style.streamingStatusView} >
              <View style={[{ backgroundColor: item?.is_live_streaming ? colors.delete : colors.lightText, }, __style.liveSteamStatus]} />
              <MyText type='bold' color={colors.white} fontSize={12}  >
                {item?.is_live_streaming ? "Live" : "Offline"}</MyText>
            </View>
          )}

        </View>
      }

      {item.feed_type == "embed_code" && !!item.embed_code &&
        <View style={{ marginTop: 10 }} >
          <MyWebview
            fullWidth
            html={item.embed_code.replace("width", "")}
          />
        </View>
      }


      {!!item?.event_info?.is_event_info &&
        <View style={__style.eventRootView} >
          <View style={__style.eventTitleView}>
            <MyWebview html={item?.event_info?.event_title} />
          </View>
          <TouchableOpacity
            onPress={() => openUrl(item?.event_info?.button_link)}
            style={[__style.eventBtnView, {
              backgroundColor: item?.event_info?.button_background_color,
              alignSelf: btnAligmnet[item?.event_info?.button_alignment]
            }]}>
            <MyText
              color={item?.event_info?.button_text_color}
              type='medium'
              style={{ paddingHorizontal: 10, }}
            >{item?.event_info?.button_text}</MyText>
          </TouchableOpacity>
        </View>}


    </View>
  )

  const statsView = () => (
    <View style={__style.statView}>
      {!!item?.like_count > 0 ?
        <TouchableOpacity
          onPress={() => showLikes(item?._id)}
          style={__style.likeView}>
          {icons.heartFilled(colors.heart, 20)}
          <View style={__style.likeImagesView}>
            {item?.top_liked_user?.map((item, index) => {
              if (index < 2)
                return (
                  <View
                    key={item?.user_info_action_by?.profile_image}
                    style={[__style.likeImageView, { marginLeft: -(index + 5) }]}>
                    <MyImage
                      style={__style.likeImage}
                      source={{
                        uri: S3_URL + item?.user_info_action_by?.profile_image
                      }}
                    />
                  </View>
                )
              else return null;
            })}
            {item?.like_count > 2 &&
              <MyText fontSize={12}>{` and ${item?.like_count - 2} others`}</MyText>}
          </View>
        </TouchableOpacity> :
        <View />}

      {item?.comment_count > 0 &&
        <TouchableOpacity
          onPress={() => openComments(item?._id, false)}
          style={__style.likeView}>
          <MyText fontSize={12}>{`${item?.comment_count} comments`}</MyText>
        </TouchableOpacity>
      }

    </View>
  )

  const actionView = () => (
    <View style={__style.actionView}>

      <TouchableOpacity
        onPress={() => onLikebtnPress(item?._id, item?.is_liked)}
        style={__style.actionBtn}>
        {item?.is_liked ?
          icons.heartFilled(colors.heart, 18) :
          icons.heartUnfilled(colors.white, 18)}
        <MyText fontSize={12} style={{ marginLeft: 5 }}>{item?.is_liked ? "Liked" : "Like"}</MyText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openComments(item?._id, true)}
        style={__style.actionBtn}>
        {icons.comment(colors.white, 18)}
        <MyText fontSize={12} style={{ marginLeft: 5 }}>{"Comment"}</MyText>
      </TouchableOpacity>
    </View>
  )



  if (item?.is_reward_feed) {
    return (
      <DropShadow style={[__style.shadow, __style.rootShadowView,
      { shadowColor: item?.is_reward_feed ? colors.primary : colors.darkSecondary, }]}>
        <View style={[__style.rootView, item?.is_reward_feed ? __style.rewardBorderView : null]}>
          {animationView()}
          <View >
            {profileView()}
            {descriptionView()}
            {item?.is_publish &&
              <>
                {statsView()}
                {actionView()}
              </>}
          </View>
        </View>
      </DropShadow>
    )
  } else {
    return (
      <View style={__style.rootShadowView}>
        <View style={[__style.rootView,]}>
          {animationView()}
          <View >
            {profileView()}
            {descriptionView()}
            {item?.is_publish &&
              <>
                {statsView()}
                {actionView()}
              </>}
          </View>
        </View>
      </View>
    )
  }
};

function areEqual(prevProps, nextProps) {
  console.log(prevProps, "prevProps");
  console.log(nextProps, "nextProps");
  if (JSON.stringify(prevProps) == JSON.stringify(nextProps)) {
    return true
  }
  return false
}


export default React.memo(FeedView);

const btnAligmnet = {
  "center": "center",
  "left": "flex-start",
  "right": "flex-end"
}

const __style = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 7,

  },
  rewardBorderView: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
  },
  rootShadowView: {
    marginTop: 15,
    marginHorizontal: 10,
  },
  rootView: {
    padding: 10,
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },


  animationView: {
    width: "100%",
    height: "100%",
    position: 'absolute',
    zIndex: -1,
    overflow: "hidden",
  },

  profileView: {
    flexDirection: "row",
    alignItems: "center",

  },
  eventRootView: {
    borderWidth: 1,
    marginVertical: 20,
    borderColor: colors.white,
    backgroundColor: colors.black,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 5
  },
  eventTitleView: {
    margin: 0,
    padding: 5
  },
  eventBtnView: {
    flexGrow: 1,
    minHeight: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingVertical: 3,
    marginVertical: 3,
    // alignSelf:"center"
    // flex: 1,
    // minWidth: 50
  },
  liveSteamStatus: {
    borderRadius: 999, height: 10, width: 10,
    marginRight: 5
  },
  streamingStatusView: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary2,
    paddingHorizontal: 10,
    position: "absolute",
    top: 5,
    left: 5,
    paddingVertical: 3,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    alignItems: "center",
  },
  profileNameView: {
    marginLeft: 10,
    flex: 1
  },
  profileTypeIconView: {
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: "center"
  },
  feedTypeIcon: {
    height: 22,
    width: 22
  },
  descriptionRootView: {
    marginTop: 10
  },
  actionView: {
    borderTopColor: colors.lightText2,
    borderBottomColor: colors.lightText2,
    borderBottomWidth: 1 / 3,
    borderTopWidth: 1 / 3,
    height: 40,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 30
  },
  statView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  },
  likeView: { flexDirection: "row", alignItems: "center", height: "100%" },
  likeImagesView: { flexDirection: "row", alignItems: "center", marginLeft: 5 },
  likeImageView: { width: 18, height: 18, borderRadius: 18 / 2, overflow: "hidden", borderWidth: 2, borderColor: colors.white },
  likeImage: { width: 16, height: 16 }
})