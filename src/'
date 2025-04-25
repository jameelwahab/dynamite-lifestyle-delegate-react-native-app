import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import MyWebview from '../../../components/MyWebview';
import ResponsiveImage2 from '../../../components/ResponsiveImage2';
import utilities from '../../../utilities';
import { colors } from '../../../utilities/colors';
import { MyButton } from '../../../components/MyButton';
import ChatModal from './Components/ChatModal';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';

const PortalEventsVideo = ({ navigation, route }) => {
  const { video } = route?.params;
  const { token, user, S3_URL } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [event,] = useState(video)
  const [isChatEnable, setIsChatEnable] = useState(false)

  useEffect(() => {
    if (event?.is_chat_enable) {
      setTimeout(() => {
        setIsChatEnable(true)
      }, 300);
    }
  }, [])
  return (
    <RootView title={!!event ? event?.title : ""} >
      {!!event && (
        <View style={__style.rootView} >

          {
            !!event?.video_url ?
              <MyWebview
                html={event?.video_url}
                width={utilities.screenWidth() - 20}
              /> :
              !!event?.images?.thumbnail_1 ?
                <ResponsiveImage2
                  uri={S3_URL + event?.images?.thumbnail_1}
                  width={utilities.screenWidth() - 20}
                />
                : <View />
          }

          {event?.is_chat_enable &&
            <View style={__style.btnRow}>
              <MyButton
                onPress={() => setIsChatEnable(true)}
                title={!isChatEnable ? "Show Chat" : "Hide Chat"}
                invert style={__style.btnStyle} />
            </View>}
        </View>
      )}

      <ChatModal
        isVisible={isChatEnable}
        closeModal={() => setIsChatEnable(false)}
        videoId={event?._id}
        token={token}
        navigation={navigation}
        timezone={timezone}
        purchaseLink={!!event?.is_purchase_link ? event?.link : ""}
        linkImage={event?.link_image}
        user={user}
      />

    </RootView>
  )
}

export default PortalEventsVideo

const __style = StyleSheet.create({
  rootView: {
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 5
  },
  btnStyle: {
    paddingHorizontal: 10,
    height: 40
  },
  titleView: {
    marginBottom: 5,
    width: "100%"
  }

})
