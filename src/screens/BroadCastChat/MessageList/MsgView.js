import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import utilities from '../../../utilities';
import MyText from '../../../components/MyText';
import {convertTimezone} from '../../../functions/convertTime';
import {dateTimeFormat} from '../../../utilities/constants';
import {colors} from '../../../utilities/colors';
import ResponsiveImage from '../../../components/ResponsiveImage';
import {isHtml} from '../../../functions/regex';
import MyWebview from '../../../components/MyWebview';
import copyText from '../../../functions/copyText';
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
      style={{
        alignSelf: isOtherMember(item.receiver_id) ? 'flex-start' : 'flex-end',
      }}>
      <View
        style={{
          borderBottomRightRadius: isOtherMember(item.receiver_id) ? 10 : 0,
          borderBottomLeftRadius: isOtherMember(item.receiver_id) ? 0 : 10,
          backgroundColor: isOtherMember(item.receiver_id)
            ? colors.lightText2
            : colors.secondaryVariant,
          minWidth: utilities.screenWidth() * 0.4,
          maxWidth: utilities.screenWidth() * 0.8,
          padding: 5,
          borderRadius: 10,
          marginTop: 10,
        }}>
        <View>
          {/*//?   Image View  */}

          {item.message_content_type == 'image' && !!item.image && (
            <TouchableOpacity
              activeOpacity={0.5}
              pointerEvents="box-only"
              onLongPress={onMsgLongPress}
              onPress={() => openImageZommer(item.image)}
              style={{padding: 2}}>
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
            <View style={{paddingHorizontal: 5}}>
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

          <View
            style={{
              marginTop: 5,
              alignSelf: 'flex-end',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {!isOtherMember(item.receiver_id) && (
              <>
                {!!item?.publish_date_time && !!item?.schedule_date_time && (
                  <TouchableOpacity
                    hitSlop={{top: 10, left: 10, right: 10, left: 10}}
                    onPress={() => {
                      let str = `This message was published at ${moment(
                        item?.publish_date_time,
                      )
                        .tz(timezone.admin)
                        .format(dateTimeFormat.dateTimeWithText('at'))} (${
                        timezone.admin
                      }) time`;
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
                      let str = `This message will be published on ${moment
                        .utc(item?.schedule_date_time)
                        .format(dateTimeFormat.dateTimeWithText('at'))} (${
                        timezone.admin
                      }) time`;
                      infoRef?.current?.openModal(str);
                    }}
                    style={{marginRight: 5}}>
                    {icons.clock(colors.primary, 15)}
                  </TouchableOpacity>
                )}

                {item?.status == 'publish' && (
                  <View style={{marginRight: 5}}>
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
