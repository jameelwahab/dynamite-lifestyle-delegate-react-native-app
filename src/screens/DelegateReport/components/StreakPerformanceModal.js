import { View, Text, SafeAreaView, Pressable, ScrollView } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import moment from 'moment';
import utilities from '../../../utilities';
import { LineChart } from 'react-native-chart-kit';

const StreakPerformanceModal = forwardRef(({ }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [graphData, setGraphData] = useState(null)

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])


  const openModal = (title, arr, data) => {
    setTitle(title)
    setIsVisible(true);
    getArray(data, arr)

  }

  const closeModal = () => {
    setIsVisible(false)
  }

  const getArray = (data, arr) => {
    let lebels = [];
    let values = [];
    let diff = moment(data?.end_date, "DD-MM-YYYY").diff(moment(data?.start_date, "DD-MM-YYYY"), 'days');
    for (let i = 0; i <= diff; i++) {
      let date = moment(data?.start_date, "DD-MM-YYYY").add({ day: i }).format("DD-MM-YYYY");
      lebels.push(moment(date, "DD-MM-YYYY").format("DD MMM"))
      let found = arr.find(x => x.date == date);
      if (!!found) {
        values.push(found.rate)
      } else {
        values.push(0)
      }
    }

    let dataset = {
      labels: lebels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => "#EDBF60",
        },
        {
          data: [10]
        }
      ]
    }

    setGraphData(dataset)


  }

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
      animationIn={"slideInRight"}
      animationOut={"slideOutRight"}
      animationInTiming={300}
      animationOutTiming={300}
    >
      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 1, marginTop: "auto", backgroundColor: colors.secondary }}>
        <View style={{ flexDirection: "row", padding: 10, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText, alignItems: "center" }}>
          <Pressable onPress={closeModal}>
            {icons.crosssWithCircle()}
          </Pressable>
          <View style={{ marginLeft: 10 }}>
            <MyText fontSize={18} type='medium' >{title + " Performance"}</MyText>
          </View>

        </View>
        <View>


          {!!graphData &&
            <View style={{ marginTop: 100 }}>
              <ScrollView horizontal>
                <LineChart
                  data={graphData}
                  width={(utilities.screenWidth() * 0.3) * graphData?.labels?.length}
                  height={500}

                  segments={10}
                  yAxisLabel={''}
                  yAxisSuffix={""}
                  bezier
                  chartConfig={{
                    decimalPlaces: 0,
                    backgroundColor: colors.secondary,
                    backgroundGradientFrom: colors.secondary,
                    backgroundGradientTo: colors.secondary,
                    color: (opacity = 1) => colors.white,
                    labelColor: (opacity = 1) => colors.white,
                    style: {},
                    propsForDots: {
                      stroke: colors.white,
                    },
                  }}
                />
              </ScrollView>
            </View>}
        </View>
      </SafeAreaView>
    </Modal>
  )
})

export default StreakPerformanceModal