import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useRef } from 'react'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import { dateTimeFormat } from '../../../utilities/constants'
import moment from 'moment'
import routes from '../../../navigation/routes'
import EmptyView from '../../../components/EmptyView'
import utilities from '../../../utilities'
import { BarChart } from 'react-native-gifted-charts'
import InfoModal from '../../../components/InfoModal'


const AccountablityTracker = ({ data, navigation, user }) => {
  const ref_infoModal = useRef()
  if (!!data) {


    const charView = () => {
      if (!!data) {
        let screenWidth = utilities.screenWidth();
        let labels = [];
        let values = [];
        let barData = [];
        !!data?.daily_tracker_history && data?.daily_tracker_history.forEach((x, i) => {
          labels.push(`Audio ${i + 1}`)
          values.push(x.listen_count)
          barData.push({
            title: x?.url,
            value: x?.listen_count,
            label: `Audio ${i + 1}`,
            frontColor: colors.primary,
            topLabelComponent: () => (
              <MyText>{x?.listen_count}</MyText>
            ),
          })
        })
        let width = (screenWidth / 50) * labels.length;
        chartBlockWidth = width < screenWidth ? screenWidth : width;
        // chartBlockWidth = screenWidth
        return (
          <View style={{
            backgroundColor: colors.secondary,
            justifyContent: "center", marginTop: 10, borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.white + "11",
            paddingBottom: 40,
            paddingTop: 10
          }}>
            <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
              <MyText fontSize={16} type='bold' >Listen Audios</MyText>
            </View>
            <BarChart
              hideRules
              barWidth={70}
              noOfSections={5}
              barBorderRadius={4}
              data={barData}
              yAxisThickness={1}
              xAxisThickness={1}
              yAxisColor={colors.lightText}
              xAxisColor={colors.lightText}
              yAxisIndicesColor={colors.lightText}
              yAxisTextStyle={{ color: colors.lightText }}
              xAxisIndicesColor={colors.lightText}
              xAxisLabelTexts={{ color: colors.lightText }}
              xAxisLabelsVerticalShift={30}
              xAxisLabelTextStyle={{ color: colors.lightText, fontSize: 10, }}
              onPress={(item) => {
                let str = `${item?.label}: ${item?.value} Times\n\n${item?.title}`
                ref_infoModal?.current?.openModal(str)
              }}
            // xAxisIndicesHeight={10}
            />
          </View>
        )
      }
    }

    return (
      <View style={__styles.rootView} >
        <MyText fontSize={14} color={colors.primary} >
          {`Accountability Analysis from ${data?.date_from} to ${data?.date_to}`}</MyText>
        <>
          {!!data?.daily_dynamite && data?.daily_dynamite?.map((item, index) => (
            <Pressable
              onPress={() => navigation.navigate(routes.delegateReportAccountablityTrackerScreen, { item, user })}
              key={item?._id} style={__styles.activityView} >
              <View style={__styles.activityRow}>
                <MyText>{item?.date}</MyText>
                <View style={__styles.activityNestedRow}>
                  <MyText>{moment(item?.date_time, "YYYY-MM-DD HH:mm").format(dateTimeFormat.time)}</MyText>
                </View>

              </View>
              <View style={{ marginTop: 10 }}>
                <MyText>{item?.statement_array[0]?.option}</MyText>
              </View>
            </Pressable>
          ))}
        </>
        <>
          {!!data?.daily_dynamite && data?.daily_dynamite.length <= 0 && (
            <View style={{ height: 150 }}>
              <EmptyView />
            </View>
          )}

          {charView()}
        </>
        <InfoModal ref={ref_infoModal} />
      </View>
    )
  } else return null
}

export default AccountablityTracker

const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.darkSecondary,
    marginTop: 5,
    padding: 10,
    borderRadius: 20,
  },
  text: {
    marginTop: 5
  },
  activityView: {
    padding: 10,
    backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white + "11"
  },
  activityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  activityNestedRow: { flexDirection: "row", alignItems: "center" }
})