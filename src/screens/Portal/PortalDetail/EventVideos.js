import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { MyButton } from '../../../components/MyButton'
import ResponsiveImage2 from '../../../components/ResponsiveImage2'
import MyWebview from '../../../components/MyWebview'
import { S3_URL } from '../../../utilities/constants'
import utilities from '../../../utilities'
import { colors } from '../../../utilities/colors'
import MyText from '../../../components/MyText'
import routes from '../../../navigation/routes'
import EmptyView from '../../../components/EmptyView'
const EventVideos = ({ selectedEvent: event, navigation }) => {


  const onVideoDetailScreen = (video) => {
    navigation.navigate(routes?.portalEventVidoScreen, {
      video: video
    })
  }
console.log(event,"event")
  return (
    <View>
      {!!event && (
        <View style={__style.rootView} >

          {(!!event?.dynamite_event_category_video && event?.dynamite_event_category_video.length > 0) ?
            event?.dynamite_event_category_video.map((x, i) =>
              <View>
                <View >
                  <View style={__style.titleView}>
                    <MyText color={colors.primary} fontSize={16} type='medium' >{x?.title}</MyText>
                  </View>
                  <MyWebview
                    html={x?.video_url}
                    width={utilities.screenWidth() - 40}
                  />
                  {x?.is_chat_enable &&
                    <View style={__style.btnRow}>
                      <MyButton
                        onPress={() => onVideoDetailScreen(x)}
                        title={"Show Chat"}
                        invert style={__style.btnStyle} />
                    </View>}
                </View>
              </View>) :


            !!event?.video_url ?
              <MyWebview
                html={event?.video_url}
                width={utilities.screenWidth() - 40}
              /> :


              !!event?.images?.thumbnail_1 ?
                <ResponsiveImage2
                  uri={S3_URL + event?.images?.thumbnail_1}
                  width={utilities.screenWidth() - 40}
                />
                : <EmptyView/>
          }

        </View>
      )}
    </View >
  )
}

export default EventVideos

const __style = StyleSheet.create({
  rootView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 10
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