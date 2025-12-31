import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {STRINGS} from '../../../utilities/strings';
import UserImage from '../../../components/UserImage';
import MyText from '../../../components/MyText';
import InfoModal from '../../../components/InfoModal';
import {
  convertTimezone,
  convertTimezone2,
} from '../../../functions/convertTime';
import {colors} from '../../../utilities/colors';
import {fonts} from '../../../utilities/fonts';
import {isDev} from '../../../utilities/constants';
import ImagesForFeed from './ImagesForFeed';
import {icons} from '../../../utilities/icons';
import MyWebview from '../../../components/MyWebview';
import MyImage from '../../../components/MyImage';
import CollapsibleText from '../../../components/CollapsibleText';
import WebPlayer from '../../../components/WebPlayer';
import ResponsiveImage2 from '../../../components/ResponsiveImage2';
import utilities from '../../../utilities';
import openUrl from '../../../functions/openUrl';
import DropShadow from 'react-native-drop-shadow';
import {isHtml} from '../../../functions/regex';
import PostWebView from '../../../components/PostWebView';
import FeedText from '../../../components/FeedText';
import Divider from '../../../UIComponents/Divider';
import numFormatter from '../../../functions/numFormatter';
import {MyButton} from '../../../components/MyButton';
import {main} from '../../../utilities/styles';
import {Row, Flex} from '../../../UIComponents/FlexViews';
import isArray from '../../../functions/isArray';

export const FeedView = ({
  item,
  index,
  user,
  feedSettings,
  isInView,
  timezone,
  settings,
  openComments,
  showLikes,
  openOptions,
  onLikebtnPress,
  isCosmos,
  sourceLevelIcons,
  isScheduledFeed,
  openScheduleTimeModal,
  onFeedDetail,
  isNoteMainFeed,
  filterTheOptions,
  onVotePress,
  pollSettings,
  openPollDetail,
  onStartQuestionnairPress,
  openSurveyDetail,
  onReportedPress,
  S3_URL,
}) => {
  const [animationState, setAnimationState] = useState(0);
  const ref_info = useRef();

  useEffect(() => {
    if (index == 1)
      if (isInView) {
        startAnimation();
      } else {
        setAnimationState(0);
      }
  }, [isInView]);

  const startAnimation = () => {
    setAnimationState(1);
    setTimeout(() => {
      setAnimationState(0);
    }, 5000);
  };

  const animationView = () => {
    return (
      <>
        {!!item?.reward_data?.reward_feed_gif && animationState == 1 && (
          <View style={__style.animationView}>
            <Image
              indicatorProps={{indeterminate: false}}
              source={{uri: S3_URL + item?.reward_data?.reward_feed_gif}}
              style={__style.animationImage}
            />
          </View>
        )}
      </>
    );
  };
  const badgesView = badgeList => {
    return (
      <View>
        <Text style={[main.heading, __style.badgesTitle]}>
          {STRINGS.FEED_VIEW.badges}
        </Text>
        <Divider mt={10} />
        <View style={__style.badgesListContainer}>
          <FlatList
            horizontal
            scrollEnabled={false}
            data={badgeList || []}
            renderItem={({item, index}) => {
              return (
                <View style={__style.badgeItem}>
                  <Row alignItems="center">
                    <MyImage
                      source={{uri: S3_URL + item?.icon?.thumbnail_1}}
                      style={__style.badgeIcon}
                    />
                  </Row>
                </View>
              );
            }}
          />
        </View>
      </View>
    );
  };

  const profileView = () => (
    <View style={__style.profileView}>
      <View style={[__style.profileView, __style.profileViewFlex]}>
        <UserImage
          image={item?.action_info?.profile_image}
          name={item?.action_info?.name}
          backgroundTransparent={true}
          borderWidth={isCosmos ? 1 / 4 : 2}
          borderColor={
            !isCosmos
              ? !!item?.show_feed_to
                ? item?.show_feed_to == 'all' &&
                  item?.action_info?.action_by == 'consultant_user'
                  ? feedSettings?.color_code_for_all_level
                  : !!item?.badge_level_info
                  ? item?.badge_level_info?.color_code
                  : item?.feed_badge_levels[0]?.color_code
                : undefined
              : undefined
          }
          size={35}
        />
        <View style={__style.profileNameView}>
          <MyText type="bold">{item?.action_info?.name}</MyText>

          <View style={__style.marginTop2}>
            <MyText type="light" color={colors.lightText2} fontSize={10}>
              {convertTimezone(item?.createdAt, timezone).format(
                'DD MMM YYYY [at] hh:mm A',
              )}
            </MyText>
          </View>
        </View>
      </View>
      {!item?.is_publish && (
        <TouchableOpacity
          onPress={() => openScheduleTimeModal(item?.schedule_date_time)}
          style={__style.marginRight5}>
          <Image source={icons.schedule} style={__style.scheduleIcon} />
        </TouchableOpacity>
      )}

      <InfoModal ref={ref_info} />

      {!!item?.show_feed_to &&
        item?.show_feed_to == 'specific' &&
        item?.action_info?.action_by == 'consultant_user' && (
          <>
            {isArray(item?.feed_badge_levels) && (
              <Pressable
                onPress={() => {
                  if (item?.feed_badge_levels?.length > 1) {
                    ref_info?.current?.openModal(
                      '',
                      '',
                      false,
                      badgesView(item?.feed_badge_levels),
                    );
                  }
                }}
                style={__style.rowAlignCenter}>
                <MyImage
                  source={{
                    uri: S3_URL + item?.feed_badge_levels[0]?.icon?.thumbnail_1,
                  }}
                  style={__style.badgeLevelIcon}
                />
                {item?.feed_badge_levels?.length > 1 && (
                  <Text style={[main.description, __style.badgeCountText]}>
                    {item?.feed_badge_levels?.length - 1}+{' '}
                  </Text>
                )}
              </Pressable>
            )}
          </>
        )}

      {!!item?.show_feed_to &&
        item?.show_feed_to == 'all' &&
        item?.action_info?.action_by == 'consultant_user' && (
          <MyImage
            source={{uri: S3_URL + feedSettings?.icon_for_all_level}}
            style={__style.badgeLevelIcon}
          />
        )}

      {(!!item?.badge_level_info?.icon?.thumbnail_1 || isCosmos) && (
        <View>
          <MyImage
            indicatorProps={{color: colors.secondaryVariant}}
            resizeMode={'contain'}
            source={{
              uri: isCosmos
                ? //   // item?.created_for_level_or_type == "delegate" ?
                  //   // S3_URL + settings?.delegate_feed_icon :
                  //   // item?.created_for_level_or_type == "consultant" ?
                  //   //   S3_URL + settings?.consultant_feed_icon :
                  //   //   item?.created_for_level_or_type == "marketing" ?
                  //   //     S3_URL + settings?.marketing_feed_icon :
                  //   //     item?.created_for_level_or_type == "inner_circle" ?
                  //   //       S3_URL + settings?.inner_circle_feed_icon :
                  S3_URL +
                  settings?.[`${item?.created_for_level_or_type}_feed_icon`]
                : S3_URL + item?.badge_level_info?.icon?.thumbnail_1,
            }}
            style={__style.feedTypeIcon}
          />
        </View>
      )}

      {(((isCosmos || isScheduledFeed) &&
        user?._id == item?.action_info?.action_id) ||
        (!isCosmos && !isScheduledFeed)) &&
        filterTheOptions(item) > 0 && (
          <TouchableOpacity
            onPress={() => openOptions(item)}
            style={__style.profileTypeIconView}>
            {icons.threeDots(colors.primary, 15)}
          </TouchableOpacity>
        )}
    </View>
  );

  const inRevivewView = () => {
    return (
      <View style={__style.review}>
        <MyText color={colors.primary} fontSize={16} type="medium">
          {STRINGS.FEED_VIEW.reviewReason}
        </MyText>
        <View style={__style.marginTop3}>
          <MyText color={colors.lightText2} type="regular">
            {item?.review_info?.reason}
          </MyText>
        </View>
      </View>
    );
  };

  const descriptionView = () => (
    <View style={__style.descriptionRootView}>
      {!!item?.description && (
        <>
          {/*  <MyText fontSize={13}>{item?.description}</MyText> */}
          {/* <CollapsibleText>{item?.description}</CollapsibleText> */}
          {
            isHtml(item?.description) ? (
              <PostWebView enableCollapse={true} html={item?.description} />
            ) : // <CollapsibleText>{item?.description}</CollapsibleText>
            !!item?.mentioned_users ? (
              <FeedText
                keywords={
                  isArray(item?.feed_keywords) ? item?.feed_keywords : []
                }
                list={item?.mentioned_users}
                text={item?.description}
              />
            ) : (
              <CollapsibleText>{item?.description}</CollapsibleText>
            )
            // <MyWebview html={item?.description} />
          }
        </>
      )}

      {item.feed_type == 'image' &&
        !!item?.feed_images &&
        item?.feed_images.length > 0 && (
          <View style={__style.marginTop10}>
            <ImagesForFeed id={item._id} list={item.feed_images} />
          </View>
        )}

      {item.feed_type == 'video' && item.video_url != '' && (
        <View style={__style.centerMarginTop10}>
          <WebPlayer height={250} url={item.video_url} />
        </View>
      )}

      {isDev && item.feed_type == 'live' && !!item?.image?.thumbnail_1 && (
        <View style={__style.liveContainer}>
          <ResponsiveImage2
            width={utilities.screenWidth() - 40}
            uri={S3_URL + item?.image?.thumbnail_1}
          />
          {item.feed_type == 'live' && (
            <View style={__style.streamingStatusView}>
              <View
                style={[
                  {
                    backgroundColor: item?.is_live_streaming
                      ? colors.delete
                      : colors.lightText,
                  },
                  __style.liveSteamStatus,
                ]}
              />
              <MyText type="bold" color={colors.white} fontSize={12}>
                {item?.is_live_streaming
                  ? STRINGS.FEED_VIEW.live
                  : STRINGS.FEED_VIEW.offline}
              </MyText>
            </View>
          )}
        </View>
      )}

      {item.feed_type == 'embed_code' && !!item.embed_code && (
        <View style={__style.marginTop10}>
          <MyWebview fullWidth html={item.embed_code.replace('width', '')} />
        </View>
      )}

      {item.feed_type == 'poll' && (
        <View style={__style.margin10}>{pollFeedView(item)}</View>
      )}

      {item.feed_type == 'survey' && (
        <View style={__style.margin10}>{surveyFeedView(item)}</View>
      )}

      {!!item?.event_info?.is_event_info && (
        <View style={__style.eventRootView}>
          <View style={__style.eventTitleView}>
            <MyWebview html={item?.event_info?.event_title} />
          </View>
          <TouchableOpacity
            onPress={() => openUrl(item?.event_info?.button_link)}
            style={[
              __style.eventBtnView,
              {
                backgroundColor: item?.event_info?.button_background_color,
                alignSelf: btnAligmnet[item?.event_info?.button_alignment],
              },
            ]}>
            <MyText
              color={item?.event_info?.button_text_color}
              type="medium"
              style={__style.eventBtnText}>
              {item?.event_info?.button_text}
            </MyText>
          </TouchableOpacity>
        </View>
      )}

      {item?.is_reported && (
        <TouchableOpacity onPress={onReportedPress}>
          <Row paddingHorizontal={5} style={__style.reportedView}>
            {icons.warnOctagon(colors.delete, 20)}
            <Text style={__style.reportedText}>
              {STRINGS.FEED_VIEW.reportedByUsers}
            </Text>
          </Row>
        </TouchableOpacity>
      )}
    </View>
  );

  const statsView = () => (
    <View style={__style.statView}>
      {!!item?.like_count > 0 ? (
        <TouchableOpacity
          onPress={() => showLikes(item?._id)}
          style={__style.likeView}>
          {icons.heartFilled(colors.heart, 15)}
          <View style={__style.likeImagesView}>
            <MyText fontSize={12}>{numFormatter(item?.like_count, 1)}</MyText>
          </View>
        </TouchableOpacity>
      ) : (
        <View />
      )}

      {item?.comment_count > 0 && (
        <TouchableOpacity
          onPress={() => openComments(item?._id, false)}
          style={__style.likeView}>
          {icons.comment(colors.white, 15)}
          <View style={__style.likeImagesView}>
            <MyText fontSize={12}>{`${numFormatter(
              item?.comment_count,
              1,
            )}`}</MyText>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const actionView = () => (
    <View style={__style.actionView}>
      <TouchableOpacity
        onPress={() => onLikebtnPress(item?._id, item?.is_liked)}
        style={__style.actionBtn}>
        {item?.is_liked
          ? icons.heartFilled(colors.heart, 18)
          : icons.heartUnfilled(colors.white, 18)}
        <MyText fontSize={12} style={__style.marginLeft5}>
          {item?.is_liked ? STRINGS.FEED_VIEW.liked : STRINGS.FEED_VIEW.like}
        </MyText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openComments(item?._id, true)}
        style={__style.actionBtn}>
        {icons.comment(colors.white, 18)}
        <MyText fontSize={12} style={__style.marginLeft5}>
          {STRINGS.FEED_VIEW.comment}
        </MyText>
      </TouchableOpacity>
    </View>
  );

  const get_winner_option = options => {
    if (options.length === 0) {
      return null;
    }
    return options.reduce(
      (max, option) => (option.votes > max.votes ? option : max),
      options[0],
    );
  };

  const pollFeedView = item => {
    let feed_setting = pollSettings;
    return (
      <View>
        {item?.poll_info?.poll_status == 'expired' ? (
          <>
            <View style={__style.marginBottom10}>
              {!!feed_setting?.poll_winner_description && (
                <MyWebview
                  html={feed_setting?.poll_winner_description.replace(
                    /{winner_option}/g,
                    get_winner_option(item?.poll_info?.options)?.text,
                  )}
                />
              )}
            </View>
          </>
        ) : (
          <>
            {item?.poll_info?.options.map(option => {
              let isSelected =
                !!item?.selected_options &&
                item?.selected_options.some(x => x._id == option?._id);
              return (
                <TouchableOpacity
                  onPress={() => onVotePress?.(item?._id, option?._id)}
                  style={__style.pollOptionContainer}>
                  <View
                    style={[
                      __style.pollOptionButton,
                      isSelected && __style.pollOptionSelected,
                    ]}>
                    <View style={__style.pollOptionContentRow}>
                      <View
                        style={[
                          __style.pollRadioButton,
                          isSelected && __style.pollRadioSelected,
                        ]}>
                        {isSelected && <View style={__style.pollRadioInner} />}
                      </View>
                      <MyText color={isSelected ? colors.black : colors.white}>
                        {option?.text}
                      </MyText>
                    </View>
                    {option?.votes > 0 && (
                      <MyText color={isSelected ? colors.black : colors.white}>
                        {numFormatter(option?.votes, 1)}
                      </MyText>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
        <View style={__style.centerAlign}>
          <MyText fontSize={12} color={colors.lightText2}>
            {item?.poll_info?.poll_status == 'expired'
              ? `${STRINGS.FEED_VIEW.pollExpiredOn} ${convertTimezone2(
                  item?.poll_info?.expiry_date_time,
                  timezone,
                ).format('MMMM DD, YYYY [at] hh:mm A')}`
              : `${STRINGS.FEED_VIEW.pollExpiresOn} ${convertTimezone2(
                  item?.poll_info?.expiry_date_time,
                  timezone,
                ).format('MMMM DD, YYYY [at] hh:mm A')}`}
          </MyText>
        </View>

        {/* <View style={{ height: 1, width: "100%", backgroundColor: colors.lightGolden3, marginTop: 10 }} /> */}
        {(item?.poll_info?.poll_result == 'public' ||
          user?._id == item?.action_info?.action_id) && (
          <Pressable
            onPress={() => openPollDetail?.(item)}
            style={__style.viewDetailsButton}>
            <MyText color={colors.primary}>
              {STRINGS.FEED_VIEW.viewDetails}
            </MyText>
          </Pressable>
        )}
      </View>
    );
  };

  const surveyFeedView = item => {
    return (
      <View style={__style.marginTop10}>
        {item?.survey_info?.survey_status == 'expired' ? (
          <>
            <View style={__style.marginBottom10}>
              <MyButton
                onPress={() => onStartQuestionnairPress(item)}
                fullWidth
                // noCapitalize
                title={STRINGS.FEED_VIEW.viewSurveyQuestionnaire}
              />
            </View>
          </>
        ) : (
          <View>
            <MyButton
              onPress={() => onStartQuestionnairPress(item)}
              fullWidth
              // noCapitalize
              title={STRINGS.FEED_VIEW.surveyQuestionnaire}
            />
          </View>
        )}

        <View style={__style.centerMarginTop10}>
          <MyText fontSize={12} color={colors.lightText2}>
            {item?.survey_info?.survey_status == 'expired'
              ? `${STRINGS.FEED_VIEW.surveyExpiredOn} ${convertTimezone2(
                  item?.survey_info?.expiry_date_time,
                  timezone,
                ).format('MMMM DD, YYYY [at] hh:mm A')}`
              : `${STRINGS.FEED_VIEW.surveyExpiresOn} ${convertTimezone2(
                  item?.survey_info?.expiry_date_time,
                  timezone,
                ).format('MMMM DD, YYYY [at] hh:mm A')}`}
          </MyText>
        </View>

        {(item?.survey_info?.survey_result == 'public' ||
          user?._id == item?.action_info?.action_id) && (
          <Pressable
            onPress={() => openSurveyDetail?.(item)}
            style={__style.viewDetailsButton}>
            <MyText color={colors.primary}>
              {STRINGS.FEED_VIEW.viewDetails}
            </MyText>
          </Pressable>
        )}
      </View>
    );
  };

  if (item?.is_reward_feed) {
    return (
      <DropShadow
        style={[
          __style.shadow,
          __style.rootShadowView,
          {
            shadowColor: item?.is_reward_feed
              ? colors.primary
              : colors.darkSecondary,
          },
        ]}>
        <View
          style={[
            __style.rootView,
            item?.is_reward_feed ? __style.rewardBorderView : null,
          ]}>
          {animationView()}
          <View>
            {profileView()}
            {descriptionView()}
            {item?.is_publish && (
              <>
                {statsView()}
                {actionView()}
              </>
            )}
          </View>
        </View>
      </DropShadow>
    );
  } else {
    return (
      <View style={__style.rootShadowView}>
        {item?.feed_appear_by == 'win' && (
          <View style={__style.winfeedIcon}>{icons.winFeed(50)}</View>
        )}
        <View style={[__style.rootView]}>
          {animationView()}
          <View>
            {profileView()}
            {descriptionView()}
            {item?.review_status == 'pending'
              ? inRevivewView()
              : item?.is_publish && (
                  <>
                    {statsView()}
                    {actionView()}
                  </>
                )}
          </View>
        </View>
      </View>
    );
  }
};

function areEqual(prevProps, nextProps) {
  if (JSON.stringify(prevProps) == JSON.stringify(nextProps)) {
    return true;
  }
  return false;
}

export default React.memo(FeedView);

const btnAligmnet = {
  center: 'center',
  left: 'flex-start',
  right: 'flex-end',
};

const __style = StyleSheet.create({
  winfeedIcon: {
    position: 'absolute',
    top: -15,
    left: -15,
    zIndex: 2,
    transform: [{rotateZ: '-45deg'}],
  },
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
  reportedView: {
    borderLeftWidth: 3,
    borderColor: colors.delete,
    backgroundColor: colors.delete + '22',
    borderRadius: 5,
    paddingVertical: 7,
    marginTop: 10,
  },
  reportedText: {
    marginLeft: 10,
    ...main.description,
    color: colors.white,
  },
  animationView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
    overflow: 'hidden',
  },
  animationImage: {
    height: '100%',
    width: '100%',
  },
  badgesTitle: {
    fontFamily: fonts.medium,
  },
  badgesListContainer: {
    marginTop: 10,
  },
  badgeItem: {
    marginRight: 20,
  },
  badgeIcon: {
    height: 20,
    width: 20,
  },
  profileView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileViewFlex: {
    flex: 1,
  },
  profileNameView: {
    marginLeft: 10,
    flex: 1,
  },
  marginTop2: {
    marginTop: 2,
  },
  marginTop3: {
    marginTop: 3,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  margin10: {
    margin: 10,
  },
  marginRight5: {
    marginRight: 5,
  },
  marginLeft5: {
    marginLeft: 5,
  },
  scheduleIcon: {
    tintColor: colors.primary,
    height: 25,
    width: 25,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeLevelIcon: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  badgeCountText: {
    textDecorationLine: 'underline',
    color: colors.primary2,
  },
  profileTypeIconView: {
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedTypeIcon: {
    height: 22,
    width: 22,
  },
  review: {
    marginTop: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: 5,
    padding: 5,
    backgroundColor: colors.primary + '0F',
  },
  descriptionRootView: {
    marginTop: 10,
  },
  centerMarginTop10: {
    alignItems: 'center',
    marginTop: 10,
  },
  centerAlign: {
    alignItems: 'center',
  },
  liveContainer: {
    alignItems: 'center',
    minHeight: 20,
  },
  liveSteamStatus: {
    borderRadius: 999,
    height: 10,
    width: 10,
    marginRight: 5,
  },
  streamingStatusView: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary2,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 5,
    left: 5,
    paddingVertical: 3,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventRootView: {
    borderWidth: 1,
    marginVertical: 20,
    borderColor: colors.white,
    backgroundColor: colors.black,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 5,
  },
  eventTitleView: {
    margin: 0,
    padding: 5,
  },
  eventBtnView: {
    flexGrow: 1,
    minHeight: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingVertical: 3,
    marginVertical: 3,
  },
  eventBtnText: {
    paddingHorizontal: 10,
  },
  statView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  likeView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  likeImagesView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  likeImageView: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
  },
  likeImage: {
    width: 16,
    height: 16,
  },
  actionView: {
    borderTopColor: colors.lightText2,
    borderBottomColor: colors.lightText2,
    borderBottomWidth: 1 / 3,
    borderTopWidth: 1 / 3,
    height: 40,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 30,
  },
  pollOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  pollOptionButton: {
    backgroundColor: colors.transparent,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 40,
    borderWidth: 1 / 2,
    borderColor: colors.border,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  pollOptionSelected: {
    backgroundColor: colors.primary,
  },
  pollOptionContentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollRadioButton: {
    marginRight: 10,
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollRadioSelected: {
    borderColor: colors.black,
  },
  pollRadioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: colors.black,
  },
  viewDetailsButton: {
    borderWidth: 1,
    borderColor: colors.lightPrimary,
    borderRadius: 5,
    marginTop: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
