import { View, StyleSheet, Pressable, } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MyText from '../../../components/MyText'
import RootView from '../../../components/RootView'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { GET_PORTAL_DETAIL, GET_PORTAL_LIST } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import { S3_URL } from '../../../utilities/constants'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import MyWebview from '../../../components/MyWebview'
import utilities from '../../../utilities'
import openUrl from '../../../functions/openUrl'
import { MyButton } from '../../../components/MyButton'
import ChatModal from './Components/ChatModal'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import FeedScreen from '../../Feed/FeedScreen'
import EventVideos from './EventVideos'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import routes from '../../../navigation/routes'
import MyImage from '../../../components/MyImage'
import AudioPlayerForList from '../../../components/AudioPlayerForList'


const PortalDetail = (props) => {
  const { navigation, route } = props;
  console.log(props, "props")
  const { eventId } = route?.params
  const { token, user } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [loader, setLoader] = useState(true);
  const [event, setEvent] = useState(null);
  const [isChatEnable, setIsChatEnable] = useState(false)
  const [eventTabs, setEventTabs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [isScheduledFeedAllowd, setIsScheduledFeedAllowd] = useState(false)

  const onEventsChatScreen = () => {
    navigation.navigate(routes.portalChatList, {
      eventId: eventId,
      eventSlug: event?.event_slug
    })
  }
  const getDataFromServer = async () => {
    let res = await GET_PORTAL_DETAIL({ navigation, token, eventId: eventId });
    if (res.code == 200) {
      let eventTabs = [];
      let incrementer = 2;
      if (res?.scheduled_feed) {
        incrementer = 3;
        // eventTabs.push({
        //   title: "Your Scheduled Feed",
        //   key: "your_scheduled_feed",
        //   index: 2
        // })
      }

      res?.member_dynamite_event.dynamite_event_category.forEach((x, i) => {
        eventTabs.push({
          title: x?.title,
          key: x?.dynamite_event_category_slug,
          index: i + incrementer
        })

      })
      console.log(eventTabs, "eventTabs")
      setIsScheduledFeedAllowd(res?.scheduled_feed)
      setEventTabs(eventTabs)
      setEvent(res?.member_dynamite_event);
      setUpcomingEvents(res?.upcoming_events_array);
      setCurrentEvents(res?.current_events_array)
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

  const showTabView = (tab) => {
    let incrementer = isScheduledFeedAllowd ? 3 : 2
    return <EventVideos
      selectedEvent={event?.dynamite_event_category[tab - incrementer]}
      navigation={navigation}
    />
  }

  useEffect(() => {
    getDataFromServer()
  }, [])


  const toggleChatModal = () => {
    setIsChatEnable(val => !val);
  }


  const bannerView = () => {
    return (
      <>
        <View style={{ marginTop: 10 }}>
          {!!event?.feature_video && event?.feature_video?.video_type == "audio" && event?.feature_video?.audio_file_url &&
            <AudioPlayerForList
              url={event?.feature_video?.audio_file_url}
              id={event?.feature_video?._id} />
          }
        </View>
        <View style={__style.bannerImagesView}>

          {!!event?.banner1_image?.thumbnail_1 &&
            <Pressable
              onPress={() => openUrl(event?.banner1_link)}
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
          </View>
        }

      </>
    )
  }


  const titleView = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <MyText fontSize={18} type='medium' color={colors.primary} >{event?.title}</MyText>
        </View>
        {user?.is_chat_allow && !!event &&
          <Pressable
            onPress={onEventsChatScreen}
            style={__style.chatBtn}>
            <View style={__style.chatBtnIcon}>
              {icons.chat(colors.black, 15)}
            </View>
          </Pressable>}
      </View>
    )
  }


  return (
    <RootView titleView={titleView}>
      <View style={{ flex: 1, marginHorizontal: -10 }}>

        {!!event && (
          <View>
            {(!!event?.feature_video?.video_url || event?.video_url) ?
              <View style={{}}>
                <MyWebview
                  html={!!event?.feature_video?.video_url ? event?.feature_video?.video_url : event?.video_url}
                  width={utilities.screenWidth()}
                />
              </View>
              :
              <ResponsiveImage2
                uri={S3_URL + event?.images?.thumbnail_1}
                width={utilities.screenWidth()}
              />}

            <View style={{ paddingHorizontal: 10 }}>
              {event?.feature_video?.is_chat_enable &&
                <View style={__style.btnRow}>
                  <MyButton
                    onPress={toggleChatModal}
                    title={isChatEnable ? 'Hide Chat' : "Show Chat"}
                    invert style={__style.btnStyle} />
                </View>}
            </View>
          </View>
        )}


        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <FeedScreen
            isScheduleFeedTabAllowed={isScheduledFeedAllowd}
            CustomHeader={bannerView}
            CustomTabs={eventTabs}
            showTabView={showTabView}
            upcomingEvents={upcomingEvents}
            currentEvents={currentEvents}
            {...props}
          />
        </View>
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

export default PortalDetail

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
    marginTop: 10,
    marginBottom: 5
  },
  btnStyle: {
    paddingHorizontal: 10,
    height: 40
  },
  chatBtn: {
    height: "100%",
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  chatBtnIcon: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  }

})