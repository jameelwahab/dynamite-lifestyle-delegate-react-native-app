import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import UserImage from '../../../components/UserImage'
import MyText from '../../../components/MyText'
import { convertTimezone } from '../../../functions/convertTime'
import { colors } from '../../../utilities/colors'
import { S3_URL } from '../../../utilities/constants'
import ImagesForFeed from './ImagesForFeed'
import { icons } from '../../../utilities/icons'
import MyWebview from '../../../components/MyWebview'
import MyImage2 from '../../../components/MyImage2'
import MyImage from '../../../components/MyImage'
import CollapsibleText from '../../../components/CollapsibleText'
import WebPlayer from '../../../components/WebPlayer'

function FeedView({ item, index, user, token, timezone, settings, openComments, showLikes, openOptions, onLikebtnPress }) {
  console.log( item?.feed_created_for == "delegate","is-delegate")
  const profileView = () => (
    <View style={__style.profileView}>
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
      <View >
        <Image source={{
          uri:
            item?.created_for_level_or_type == "delegate" ?
              S3_URL + settings?.delegate_feed_icon :
              S3_URL + settings?.consultant_feed_icon
        }}
          style={__style.feedTypeIcon}
        />
      </View>
      {user?._id == item?.action_info?.action_id &&
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
        // <MyText fontSize={13}>{item?.description}</MyText>
        <CollapsibleText>{item?.description}</CollapsibleText>
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

      {item.feed_type == "embed_code" && !!item.embed_code &&
        <View >
          <MyWebview
            fullWidth={true}
            html={item.embed_code}
          />
        </View>
      }

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
                  <View style={[__style.likeImageView, { marginLeft: -(index + 5) }]}>
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

  return (
    <View style={__style.rootView}>
      {profileView()}
      {descriptionView()}
      {statsView()}
      {actionView()}
    </View>
  )
};

function areEqual(prevProps, nextProps) {
  console.log(prevProps, "prevProps");
  console.log(nextProps, "nextProps");
  if (JSON.stringify(prevProps) !== JSON.stringify(nextProps)) {
    return true
  }
  return false
}


export default React.memo(FeedView)


const __style = StyleSheet.create({
  rootView: {
    marginTop: 10,
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10
  },
  profileView: {
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