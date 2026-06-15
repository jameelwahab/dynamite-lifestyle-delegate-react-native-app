import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import utilities from '../../../utilities';
import {STRINGS} from '../../../utilities/strings';
import MyText from '../../../components/MyText';
import {convertTimezone} from '../../../functions/convertTime';
import {dateTimeFormat} from '../../../utilities/constants';
import {colors} from '../../../utilities/colors';
import ResponsiveImage from '../../../components/ResponsiveImage';
import {isHtml} from '../../../functions/regex';
import MyWebview from '../../../components/MyWebview';
import Markdown from '@ronradtke/react-native-markdown-display';
import {fonts} from '../../../utilities/fonts';
import AudioChatView from './AudioChatView';
import openUrl from '../../../functions/openUrl';
import {icons} from '../../../utilities/icons';
import moment from 'moment';
import urlify from '../../../functions/urlify';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';

const MsgView = ({
  item,
  index,
  user,
  timezone,
  onMsgLongPress,
  openImageZommer,
  playIconClick,
  stopPlayer,
  state,
  setState,
  infoRef,
}) => {
  const {S3_URL} = useSelector(selectUser);
  const isOtherMember = id => {
    return id == user?._id;
  };
  return (
    <TouchableOpacity
      onLongPress={onMsgLongPress}
      style={[
        isOtherMember(item.receiver_id) ? __style.alignStart : __style.alignEnd,
      ]}>
      <View
        style={[
          __style.messageContainer,
          isOtherMember(item.receiver_id)
            ? __style.messageContainerOther
            : __style.messageContainerMine,
        ]}>
        <View>
          {/*//?   Image View  */}

          {item.message_content_type == 'image' && !!item.image && (
            <TouchableOpacity
              activeOpacity={0.5}
              pointerEvents="box-only"
              onLongPress={onMsgLongPress}
              onPress={() => openImageZommer(item.image)}
              style={__style.imagePadding}>
              <ResponsiveImage
                uri={S3_URL + item?.image}
                source={{uri: S3_URL + item?.image}}
              />
            </TouchableOpacity>
          )}

          {/*//?   Audio View  */}

          {item?.message_content_type == 'audio' && !!item?.audio_url && (
            <AudioChatView
              isMine={!isOtherMember(item.receiver_id)}
              currentPlaying={state.isPlaying}
              currentTrack={state.selected_audio}
              thisTrack={item._id}
              onPress={() =>
                playIconClick(
                  item.audio_url,
                  item._id,
                  isOtherMember(item.receiver_id),
                )
              }
              stopPlayer={stopPlayer}
              totalDuration={item?.audio_duration}
              url={item?.audio_url}
            />
          )}

          {/*//?   Message View  */}
          {!!item?.message && (
            <View style={__style.messagePadding}>
              {isHtml(item?.message) ? (
                <MyWebview
                  style={
                    isOtherMember(item.receiver_id)
                      ? WebviewStyleOther
                      : WebviewStyleMine
                  }
                  html={item?.message}
                />
              ) : (
                <Markdown
                  style={
                    isOtherMember(item.receiver_id)
                      ? markdownStyleOther
                      : markdownStyleMine
                  }
                  onLinkPress={url => {
                    openUrl(url);
                    return false;
                  }}>
                  {urlify(item.message.replace(/\n/g, '\n\u200B'))}
                </Markdown>
              )}
            </View>
          )}

          <View style={__style.timestampContainer}>
            {!isOtherMember(item.receiver_id) && (
              <>
                {!!item?.publish_date_time && !!item?.schedule_date_time && (
                  <TouchableOpacity
                    hitSlop={{top: 10, left: 10, right: 10, left: 10}}
                    onPress={() => {
                      let str = `${
                        STRINGS.BROADCAST_MSG_VIEW.publishedAt
                      } ${moment(item?.publish_date_time)
                        .tz(timezone.admin)
                        .format(dateTimeFormat.dateTimeWithText('at'))} (${
                        timezone.admin
                      }) ${STRINGS.BROADCAST_MSG_VIEW.time}`;
                      infoRef?.current?.openModal(str);
                    }}
                    style={__style.infoIConView}>
                    {icons.info('#775F30', 12)}
                  </TouchableOpacity>
                )}

                {item?.message_type == 'schedule' && (
                  <TouchableOpacity
                    hitSlop={{top: 10, left: 10, right: 10, left: 10}}
                    onPress={() => {
                      let str = `${
                        STRINGS.BROADCAST_MSG_VIEW.willBePublishedOn
                      } ${moment
                        .utc(item?.schedule_date_time)
                        .format(dateTimeFormat.dateTimeWithText('at'))} (${
                        timezone.admin
                      }) ${STRINGS.BROADCAST_MSG_VIEW.time}`;
                      infoRef?.current?.openModal(str);
                    }}
                    style={__style.iconMargin}>
                    {icons.clock(colors.primary, 15)}
                  </TouchableOpacity>
                )}

                {item?.status == 'publish' && (
                  <View style={__style.iconMargin}>
                    {icons.seen(colors.primary, 18)}
                  </View>
                )}
              </>
            )}
            <MyText
              fontSize={10}
              color={
                isOtherMember(item.receiver_id) ? colors.black : undefined
              }>
              {convertTimezone(item?.createdAt, timezone).format(
                dateTimeFormat.dateTime,
              )}
            </MyText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MsgView;

const __style = StyleSheet.create({
  alignStart: {
    alignSelf: 'flex-start',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
  messageContainer: {
    minWidth: utilities.screenWidth() * 0.4,
    maxWidth: utilities.screenWidth() * 0.8,
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  messageContainerOther: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 0,
    backgroundColor: colors.lightText2,
  },
  messageContainerMine: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 10,
    backgroundColor: colors.secondaryVariant,
  },
  imagePadding: {
    padding: 2,
  },
  messagePadding: {
    paddingHorizontal: 5,
  },
  timestampContainer: {
    marginTop: 5,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginRight: 5,
  },
  infoIConView: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: '#775F30',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18 / 2,
    marginLeft: 10,
    marginRight: 5,
  },
});

const markdownStyleMine = {
  body: {
    color: colors.white,
    fontFamily: fonts.regular,
  },
  link: {
    textDecorationLine: 'underline',
    color: colors.primary2,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  strong: {
    fontFamily: fonts.bold,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  },
};

const markdownStyleOther = {
  body: {
    fontFamily: fonts.regular,
    color: colors.black,
    margin: 0,
  },
  link: {
    textDecorationLine: 'underline',
    color: colors.primary2,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  strong: {
    fontFamily: fonts.bold,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  },
};

const WebviewStyleMine = {
  a: {
    color: colors.primary2,
    textDecorationColor: colors.primary2,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  div: {
    color: colors.white,
    fontFamily: fonts.regular,
  },
};

const WebviewStyleOther = {
  a: {
    color: colors.black,
    textDecorationColor: colors.black,
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  div: {
    color: colors.black,
    fontFamily: fonts.regular,
  },
};
