import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import utilities from '../../../utilities';
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
}) => {
  const {S3_URL} = useSelector(selectUser);
  const isOtherMember = id => {
    return id == user?._id;
  };

  let breakChar = ' ';
  const doBreak = false;
  doBreak ? (breakChar = '\n') : (breakChar = ' ');

  return (
    <TouchableOpacity
      onLongPress={onMsgLongPress}
      style={[
        styles.messageContainer,
        {
          alignSelf: isOtherMember(item?.receiver_id)
            ? 'flex-start'
            : 'flex-end',
        },
      ]}>
      <View
        style={[
          styles.messageBubble,
          {
            borderBottomRightRadius: isOtherMember(item?.receiver_id) ? 10 : 0,
            borderBottomLeftRadius: isOtherMember(item?.receiver_id) ? 0 : 10,
            backgroundColor: isOtherMember(item?.receiver_id)
              ? colors.lightText2
              : colors.secondaryVariant,
            minWidth: utilities.screenWidth() * 0.4,
            maxWidth: utilities.screenWidth() * 0.8,
          },
        ]}>
        <View>
          {/*//?   Image View  */}

          {item?.message_type == 'image' && !!item?.image && (
            <TouchableOpacity
              activeOpacity={0.5}
              pointerEvents="box-only"
              onLongPress={onMsgLongPress}
              onPress={() => openImageZommer(item?.image)}
              style={styles.imageContainer}>
              <ResponsiveImage
                uri={S3_URL + item?.image}
                source={{uri: S3_URL + item?.image}}
              />
            </TouchableOpacity>
          )}

          {/*//?   Audio View  */}

          {item?.message_type == 'audio' && !!item?.audio_url && (
            <AudioChatView
              isMine={!isOtherMember(item.receiver_id)}
              currentPlaying={state.isPlaying}
              currentTrack={state.selected_audio}
              thisTrack={item._id}
              onPress={() =>
                playIconClick(
                  item?.audio_url,
                  item?._id,
                  isOtherMember(item?.receiver_id),
                )
              }
              stopPlayer={stopPlayer}
              totalDuration={item?.audio_duration}
              url={item?.audio_url}
            />
          )}

          {/*//?   Message View  */}
          {index == 0 && console.log(item?.message.replace(/\n/g, '  \n'))}
          {!!item?.message && (
            <View style={styles.messageTextContainer}>
              {isHtml(item?.message) ? (
                <MyWebview
                  style={
                    isOtherMember(item?.receiver_id)
                      ? WebviewStyleOther
                      : WebviewStyleMine
                  }
                  html={item?.message}
                />
              ) : (
                <Markdown
                  style={
                    isOtherMember(item?.receiver_id)
                      ? markdownStyleOther
                      : markdownStyleMine
                  }
                  onLinkPress={url => {
                    openUrl(url);
                    return false;
                  }}>
                  {urlify(item?.message.replace(/\n/g, '\n\u200B'))}
                </Markdown>
              )}
            </View>
          )}

          <View style={styles.metadataContainer}>
            {!isOtherMember(item?.receiver_id) && (
              <View style={styles.iconSpacing}>
                {!!item?.status == false || item?.status == 'sent'
                  ? icons.sent(colors.white, 18)
                  : icons.seen(
                      item?.status == 'read' ? colors.primary : colors.white,
                      18,
                    )}
              </View>
            )}
            {!!item?.is_broadcast && (
              <View style={styles.iconSpacing}>
                <Image source={icons.broadcast} style={styles.broadcastIcon} />
              </View>
            )}
            <MyText
              fontSize={10}
              color={
                isOtherMember(item?.receiver_id) ? colors.black : undefined
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

const styles = StyleSheet.create({
  messageContainer: {},
  messageBubble: {
    padding: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  imageContainer: {
    padding: 2,
  },
  messageTextContainer: {
    paddingHorizontal: 5,
  },
  metadataContainer: {
    marginTop: 5,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 5,
  },
  broadcastIcon: {
    height: 20,
    width: 20,
    tintColor: colors.primary,
  },
});

export default MsgView;

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
