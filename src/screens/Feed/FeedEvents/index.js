import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import MyWebview from '../../../components/MyWebview'
import utilities from '../../../utilities'
import { colors } from '../../../utilities/colors'
import ResponsiveImage from '../../../components/ResponsiveImage'
import { MyButton } from '../../../components/MyButton'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import openUrl from '../../../functions/openUrl'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'

const FeedEvents = ({ upcomingEvents, currentEvent, noticeboard, isEventFeed }) => {


  const { S3_URL } = useSelector(selectUser)

  const eventView = (item, index) => {
    return (
      <View style={{ backgroundColor: colors.secondary, borderRadius: 10, padding: 10, marginTop: 10 }}>
        {/* {index != 0 && <View style={__styles.divider} />} */}

        <View style={__styles.eventImageView}>
          <ResponsiveImage
            uri={S3_URL + item?.images?.thumbnail_1}
            style
          />
        </View>
        <View style={__styles.eventDescView}>
          <MyText fontSize={16} type='medium' >{item?.title}</MyText>
          <MyWebview html={item?.description} fullWidth />
        </View>
        {!!item?.button_text &&
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <MyButton
              onPress={() => openUrl(item?.button_link)}
              title={item?.button_text}
              textStyle={{ color: colors.black, }}
              style={{ height: 40, paddingHorizontal: 20, marginTop: 5 }} />
          </View>}
      </View>
    )
  }

  return (
    <View style={{ marginHorizontal: 10 }}>
      {!isEventFeed &&
        <View style={[__styles.noticeboardView, { alignItems: "center", }]}>
          <MyWebview html={noticeboard.replace("56", "2")} fullWidth
            style={{ p: { margin:0, marginBottom: 10 } }}
          />
        </View>}
      {currentEvent.length > 0 &&
        <View style={__styles.noticeboardView}>
          <View style={__styles.eventHeadingView}>
            <MyText type='bold' color={colors.primary} fontSize={18} >Current Events</MyText>
          </View>
          {currentEvent.map(eventView)}
        </View>}



      {upcomingEvents.length > 0 &&
        <View style={__styles.noticeboardView}>
          <View style={__styles.eventHeadingView}>
            <MyText type='bold' color={colors.primary} fontSize={18} >Upcoming Events</MyText>
          </View>
          {upcomingEvents.map(eventView)}
        </View>}
    </View>
  )
}

export default FeedEvents;

const __styles = StyleSheet.create({
  noticeboardView: {
    // backgroundColor: colors.secondary,
    borderRadius: 10,
    // padding: 10,
    marginTop: 10
  },
  divider: {
    height: 1, width: "70%", alignSelf: "center", backgroundColor: colors.border, marginVertical: 30
  },
  eventHeadingView: {},
  eventImageView: {
    // marginTop: 10,
    alignItems: "center",
  },
  eventDescView: { marginTop: 10, }
})
