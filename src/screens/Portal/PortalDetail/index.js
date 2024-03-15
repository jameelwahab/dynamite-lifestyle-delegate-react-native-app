import { View, Text, FlatList, StyleSheet, Pressable, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MyText from '../../../components/MyText'
import RootView from '../../../components/RootView'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_PORTAL_DETAIL, GET_PORTAL_LIST } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { S3_URL } from '../../../utilities/constants'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import { colors } from '../../../utilities/colors'
import routes from '../../../navigation/routes'
import WebPlayer from '../../../components/WebPlayer'
import MyWebview from '../../../components/MyWebview'
import utilities from '../../../utilities'
import openUrl from '../../../functions/openUrl'
import { MyButton } from '../../../components/MyButton'
import ChatModal from './Components/ChatModal'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'

const EventListing = ({ navigation, route }) => {
  const { eventId } = route?.params
  const { token, user } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [loader, setLoader] = useState(true);
  const [event, setEvent] = useState(null);
  const [isChatEnable, setIsChatEnable] = useState(false)


  const getDataFromServer = async () => {
    let res = await GET_PORTAL_DETAIL({ navigation, token, eventId: eventId });
    if (res.code == 200) {
      setEvent(res?.member_dynamite_event)
      setLoader(false);
      setTimeout(() => {
        if (res?.member_dynamite_event?.feature_video?.is_chat_enable) {
          setIsChatEnable(true);
        }
      }, 200);
    } else {
      setLoader(false)
    }
  }

  useEffect(() => {
    getDataFromServer()
  }, [])


  const toggleChatModal = () => {
    setIsChatEnable(val => !val);
  }






  return (
    <RootView title={event?.title}>
      <View style={{ flex: 1, marginHorizontal: -10 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isChatEnable}
        >
          {!!event && (
            <View >
              {(!!event?.feature_video?.video_url || event?.video_url) ?
                <View style={{ height: 250, }}>
                  <MyWebview
                    html={!!event?.feature_video?.video_url ? event?.feature_video?.video_url : event?.video_url}
                    width={utilities.screenWidth()}
                  />
                </View>
                :
                <ResponsiveImage2
                  uri={S3_URL + event?.images?.thumbnail_1}
                  width={utilities.screenWidth()}
                />
              }
              <View style={{ paddingHorizontal: 10 }}>
                {event?.feature_video?.is_chat_enable &&
                  <View style={__style.btnRow}>
                    <MyButton
                      onPress={toggleChatModal}
                      title={isChatEnable ? 'Hide Chat' : "Show Chat"}
                      invert style={__style.btnStyle} />
                  </View>}

                <View style={__style.bannerImagesView}>
                  {!!event?.banner1_image?.thumbnail_1 &&
                    <Pressable
                      onPress={() => openUrl("")}
                      style={__style.bannerImageView}>
                      <ResponsiveImage2 uri={S3_URL + event?.banner1_image?.thumbnail_1} />
                    </Pressable>}

                  {!!event?.banner2_image?.thumbnail_1 &&
                    <Pressable
                      onPress={() => openUrl(event?.banner2_link)}
                      style={__style.bannerImageView}>
                      <ResponsiveImage2 uri={S3_URL + event?.banner2_image?.thumbnail_1} />
                    </Pressable>}
                </View>

                {!!event?.detail_description &&
                  <View style={{ marginTop: 10 }}>
                    <MyWebview
                      html={event?.detail_description}
                      width={utilities.screenWidth()}
                    />
                  </View>}
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <ChatModal
        isVisible={isChatEnable}
        closeModal={() => setIsChatEnable(false)}
        videoId={event?.feature_video?._id}
        token={token}
        navigation={navigation}
        timezone={timezone}
        purchaseLink={!!event?.is_purchase_link ? event?.link : ""}
        linkImage={event?.link_image}
        eventId={eventId}
        user={user}
      />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default EventListing

const __style = StyleSheet.create({
  bannerImagesView: {
    // flexDirection: "row",

  },

  bannerImageView: {
    // flex: 1,
    // height:200,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10
  },

  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10
  },
  btnStyle: {
    paddingHorizontal: 10,
    height: 40
  }

})