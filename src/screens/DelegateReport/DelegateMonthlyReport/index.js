import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import { GET_MONTHY_REPORT_BY_DELEGATE } from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import MonthlyReport from './MonthlyReport';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import MyTouchableInput from '../../../components/MyTouchableInput';
import { icons } from '../../../utilities/icons';
import moment from 'moment';
import MonthYearPicker from '../../../components/MonthYearPicker';
import { colors } from '../../../utilities/colors';
import MemberView from '../../../components/MemberView';

const DelegateMonthlyReport = ({ navigation, route }) => {
  const { item } = route?.params;
  const { token } = useSelector(selectUser);
  const ref_monthPicker = useRef();
  const [loader, setLoader] = useState(false);
  const [itemDetail, setItemDetail] = useState(null)
  const [currentMonYear, setCurrentMonYear] = useState(moment().format("MM-YYYY"))

  useEffect(() => {
    setItemDetail(null);
    setLoader(true)
    getMonthlyReportDetail()
  }, [currentMonYear])

  const getMonthlyReportDetail = async () => {
    let res = await GET_MONTHY_REPORT_BY_DELEGATE({
      navigation, token, body: {
        delegate_id: item?._id,
        type: "performance_info",
        month_with_year: !currentMonYear,
      },
    });
    if (res.code == 200) {
      setLoader(false)
      setItemDetail(res)
    } else {
      setLoader(false)
    }
  }

  return (
    <RootView title='Delegate Monthly Report' >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }} >

          <MemberView
            member={item}
            customImage={item?.image?.thumbnail_1}
          />
          <View style={{ marginTop: 10 }}>
            <MyTouchableInput
              label='Month & Year *'
              icon={() => icons.calendar(colors.primary)}
              onPress={() => ref_monthPicker?.current?.openModal(currentMonYear)}
              value={moment(currentMonYear, "MM-YYYY").format("MMMM YYYY")}
            />
          </View>


          {!!itemDetail &&
            <MonthlyReport data={itemDetail} currentMonYear={"05-2024"} />}

        </ScrollView>
      </View>
      <MyLoader enable={loader} />

      <MonthYearPicker
        ref={ref_monthPicker}
        onAgree={(res) => setCurrentMonYear(res)}
      />
    </RootView>
  )
}

export default DelegateMonthlyReport