import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { GET_PAYMENT_REQUEST_DETAIL } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import StatView from '../../Members/Components/StatView'
import prependCurency from '../../../functions/prependCurency'
import { convertTimezone } from '../../../functions/convertTime'
import moment from 'moment'
import { dateTimeFormat } from '../../../utilities/constants'
import EmptyView from '../../../components/EmptyView'

const PaymentrequestDetail = ({ navigation, route }) => {
  const { slug } = route?.params;
  const { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);
  const getPaymentRequestDeatil = async () => {
    setLoader(true);
    let res = await GET_PAYMENT_REQUEST_DETAIL({ navigation, token, slug });
    if (res.code == 200) {
      setData(res)
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  useEffect(() => {
    getPaymentRequestDeatil()
  }, [])


  const paymentView = () => {

  }

  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' color={value ? colors.green : colors.delete} >{value ? "Successful" : "Failed"}</MyText>
      </View>)
  }

  const renderTransaction = ({ item, index }) => {
    return (<View style={{ backgroundColor: colors.secondary, padding: 10, borderRadius: 10, marginTop: 10 }}>

      <StatView title={"Amount:"} value={prependCurency(item?.currency) + " " + item?.amount} />
      <StatView title={"Transaction Note:"} value={item?.transaction_note} />
      <StatView title={"Transaction Date:"} value={item?.transaction_date} />
      {/* <StatView title={"Currency:"} /> */}
      <StatView title={"Status:"} view={() => statusView(item?.transaction_status == "succeeded")} />

    </View>)
  }

  const headerView = () => {
    let payment = data?.payment_request;
    return (
      <View>
        <View style={{ backgroundColor: colors.secondary, padding: 10, borderRadius: 10 }}>
          <MyText fontSize={16} type='medium'>{payment?.request_title}</MyText>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            {icons.calendar(colors.lightText, 18)}
            <MyText color={colors.lightText} type='medium' style={{ marginLeft: 5 }}>{moment(payment?.createdAt).format(dateTimeFormat.date)}</MyText>
          </View>

          <View style={{ marginTop: 10 }}>
            <StatView title={"Request Type"} value={payment?.request_type} />
            <StatView title={"Total Amount:"} value={prependCurency(payment?.currency) + " " + payment?.total_amount} />
            <StatView title={"Initial Deposit Amount:"} value={prependCurency(payment?.currency) + " " + payment?.initial_amount} />
            <StatView title={"Total Installments:"} value={payment?.month} />
            <StatView title={"Installments Plan:"} value={payment?.month + " " + payment?.request_iteration_type} />
          </View>
        </View>
        <View>
        </View>
        {paymentView()}

        <View style={{ marginTop: 10 }}>
          <MyText color={colors.primary} fontSize={18} type='medium' >Transactions</MyText>
        </View>
      </View>
    )
  }


  return (
    <RootView title={"Payment Request Transaction"} >
      <View style={{ flex: 1 }}>
        <FlatList
          data={!!data?.payment_request_transaction ? data?.payment_request_transaction : []}
          renderItem={renderTransaction}
          ListHeaderComponent={!loader && headerView()}
          ListEmptyComponent={!loader && <EmptyView />}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default PaymentrequestDetail