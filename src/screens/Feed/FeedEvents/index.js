import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import MyWebview from '../../../components/MyWebview'
import utilities from '../../../utilities'
import { colors } from '../../../utilities/colors'
import ResponsiveImage from '../../../components/ResponsiveImage'
import { S3_URL } from '../../../utilities/constants'
import { MyButton } from '../../../components/MyButton'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'

const FeedEvents = ({ upcomingEvents, currentEvent, noticeboard }) => {
  console.log(currentEvent, "currentEvent")


  const eventView = (item, index) => {
    return (
      <View style={{}}>
        {index != 0 && <View style={__styles.divider} />}
        <MyText >{item?.title}</MyText>
        <View style={__styles.eventImageView}>
          <ResponsiveImage
            uri={S3_URL + item?.images?.thumbnail_1}
          />
        </View>
        <View style={__styles.eventDescView}>
          <MyWebview html={item?.description} fullWidth />
        </View>
        {!!item?.button_text &&
          <View style={{ alignItems: "center" }}>
            <MyButton
              title={item?.button_text}
              textStyle={{ color: colors.black, }}
              style={{ height: 40, paddingHorizontal: 20, marginTop: 5 }} />
          </View>}
      </View>
    )
  }

  return (
    <View style={{}}>
      <View style={[__styles.noticeboardView, { alignItems: "center", }]}>
        <MyWebview html={noticeboard.replace("56", "2")} fullWidth />
      </View>
      {currentEvent.length > 0 &&
        <View style={__styles.noticeboardView}>
          <View style={__styles.eventHeadingView}>
            <MyText type='medium' fontSize={16} >Current Events</MyText>
          </View>
          {currentEvent.map(eventView)}
        </View>}

      {upcomingEvents.length > 0 &&
        <View style={__styles.noticeboardView}>
          <View style={__styles.eventHeadingView}>
            <MyText type='medium' fontSize={16} >Upcoming Events</MyText>
          </View>
          {upcomingEvents.map(eventView)}
        </View>}
    </View>
  )
}

export default FeedEvents;

const __styles = StyleSheet.create({
  noticeboardView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    marginTop: 10
  },
  divider: {
    height: 1, width: "70%", alignSelf: "center", backgroundColor: colors.border, marginVertical: 30
  },
  eventHeadingView: { marginBottom: 20 },
  eventImageView: { marginTop: 5, alignItems: "center" },
  eventDescView: { marginTop: 5, }
})