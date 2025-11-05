import {View, Text, TouchableOpacity, Pressable} from 'react-native';
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
import {MyButton} from '../../../components/MyButton';
import UserImage from '../../../components/UserImage';
import urlify from '../../../functions/urlify';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';

const MsgView = ({
  item,
  user,
  timezone,
  openImageZommer,
  playIconClick,
  stopPlayer,
  state,
  templates,
}) => {
  const {S3_URL} = useSelector(selectUser);

  const showTemplate = (type, isMe1) => {
    let template = templates.find(x => x.name == type);
    if (!!template) {
      let header,
        body,
        footer,
        button = [];
      template?.components.forEach(component => {
        if (component.type == 'HEADER') header = component;
        else if (component.type == 'BODY') body = component;
        else if (component.type == 'FOOTER') footer = component;
        else if (component.type == 'BUTTONS') button = component?.buttons;
      });
      return (
        <View>
          {!!header && (
            <View>
              {header?.format == 'IMAGE' ? (
                templateImage(header?.example?.header_handle[0])
              ) : (
                <View style={{marginBottom: 5}}>
                  <MyText
                    color={isMe1 ? colors.white : colors.black}
                    fontSize={14}
                    type="bold">
                    {header?.text}
                  </MyText>
                </View>
              )}
            </View>
          )}

          {!!body?.text && (
            <View>
              {body?.format == 'IMAGE' ? (
                templateImage(body?.example?.header_handle[0])
              ) : (
                <MyText color={isMe1 ? colors.white : colors.black}>
                  {body?.text}
                </MyText>
              )}
            </View>
          )}

          {!!footer?.text && (
            <View style={{marginTop: 10}}>
              {footer?.format == 'IMAGE' ? (
                templateImage(footer?.example?.header_handle[0])
              ) : (
                <MyText
                  color={isMe1 ? colors.lightText : colors.border}
                  fontSize={10}
                  type="medium">
                  {footer?.text}
                </MyText>
              )}
            </View>
          )}

          {button.map((x, i) => (
            <View style={{marginTop: 10}}>
              <MyButton
                style={{height: 35}}
                textStyle={{textTransform: 'capitalize'}}
                invert
                onPress={() => openUrl(x?.url)}
                title={x?.text}
              />
            </View>
          ))}
        </View>
      );
    }
  };

  const templateImage = image => {
    return <ResponsiveImage uri={image} source={{uri: image}} />;
  };

  const isMe = id => {
    return id == user?._id;
  };

  return (
    <View
      style={
        !isMe(item.sender_info?._id) && {flexDirection: 'row', marginTop: 10}
      }>
      {!isMe(item.sender_info?._id) && (
        <View style={{marginTop: 10, marginRight: 10}}>
          <UserImage
            image={item.sender_info?.profile_image}
            name={item.sender_info?.first_name}
            backgroundTransparent
            size={30}
          />
        </View>
      )}

      <View>
        {!isMe(item.sender_info?._id) && (
          <View style={{marginBottom: 2}}>
            <MyText fontSize={12} type="medium">{`${
              item.sender_info?.first_name
            } ${item.sender_info?.last_name} (${
              item.sender_info?.user_type == 'consultant'
                ? 'Delegate'
                : item.sender_info?.user_type == 'member'
                ? 'Member'
                : ''
            })`}</MyText>
          </View>
        )}
        <View
          style={{
            alignSelf: isMe(item.sender_info?._id) ? 'flex-end' : 'flex-start',
          }}>
          <View
            style={{
              borderBottomRightRadius: isMe(item.sender_info?._id) ? 0 : 10,
              borderBottomLeftRadius: isMe(item.sender_info?._id) ? 10 : 0,
              backgroundColor: isMe(item.sender_info?._id)
                ? colors.secondaryVariant
                : colors.lightText2,
              minWidth: utilities.screenWidth() * 0.4,
              maxWidth: utilities.screenWidth() * 0.8,
              padding: 5,
              borderRadius: 10,
              marginTop: !isMe(item.sender_info?._id) ? 0 : 10,
            }}>
            <View>
              {/*//?   Image View  */}

              {item.message_type == 'image' && !!item.image && (
                <TouchableOpacity
                  activeOpacity={0.5}
                  pointerEvents="box-only"
                  onPress={() => openImageZommer(item.image)}
                  style={{padding: 2}}>
                  <ResponsiveImage
                    uri={S3_URL + item?.image}
                    source={{uri: S3_URL + item?.image}}
                  />
                </TouchableOpacity>
              )}

              {/*//?   Audio View  */}

              {item?.message_type == 'audio' && !!item?.audio_url && (
                <AudioChatView
                  isMine={isMe(item.sender_info?._id)}
                  currentPlaying={state.isPlaying}
                  currentTrack={state.selected_audio}
                  thisTrack={item._id}
                  onPress={() =>
                    playIconClick(
                      item.audio_url,
                      item._id,
                      isMe(item.sender_info?._id),
                    )
                  }
                  stopPlayer={stopPlayer}
                  totalDuration={item?.audio_duration}
                  url={item?.audio_url}
                />
              )}

              {/*//?   Message View  */}

              <View style={{paddingHorizontal: 5}}>
                {item?.message_type == 'template' ? (
                  showTemplate(
                    item?.message?.message,
                    isMe(item.sender_info?._id),
                  )
                ) : isHtml(item?.message) ? (
                  <MyWebview
                    style={
                      isMe(item.sender_info?._id)
                        ? WebviewStyleMine
                        : WebviewStyleOther
                    }
                    html={item?.message?.message}
                  />
                ) : (
                  <Markdown
                    style={
                      isMe(item.sender_info?._id)
                        ? markdownStyleMine
                        : markdownStyleOther
                    }
                    onLinkPress={url => {
                      openUrl(url);
                      return false;
                    }}>
                    {urlify(item?.message?.message.replace(/\n/g, '\n\u200B'))}
                  </Markdown>
                )}
              </View>

              <View
                style={{
                  marginTop: 5,
                  alignSelf: 'flex-end',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {isMe(item.sender_info?._id) && (
                  <View style={{marginRight: 5}}>
                    {!!item?.status == false || item?.status == 'sent'
                      ? icons.sent(colors.white, 18)
                      : item?.status == 'failed'
                      ? icons.failed(colors.delete, 18)
                      : icons.seen(
                          item?.status == 'read'
                            ? colors.primary
                            : colors.white,
                          18,
                        )}
                  </View>
                )}
                <MyText
                  fontSize={10}
                  color={
                    isMe(item.sender_info?._id) ? colors.white : colors.black
                  }>
                  {convertTimezone(item?.createdAt, timezone).format(
                    dateTimeFormat.dateTime,
                  )}
                </MyText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

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
