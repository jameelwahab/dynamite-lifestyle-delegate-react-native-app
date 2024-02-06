import { View, Text, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { CHANGE_ONETIME_PAYMNET_STATUS_TO_PAID, GET_CLIENT_SECRET_FOR_PAY_ONETIME, GET_PAYMENT_REQUEST_DETAIL, PAY_RECURRING } from '../../../DAL'
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
import { CardField, initStripe, confirmPayment, createToken } from '@stripe/stripe-react-native';
import { fonts } from '../../../utilities/fonts'
import { MyButton } from '../../../components/MyButton'
import { selectSettings } from '../../../redux/reducers/settingSlice'
import showToast from '../../../functions/showToast'

const PaymentrequestDetail = ({ navigation, route }) => {
  const { slug, backScreenFunc } = route?.params;
  const { token } = useSelector(selectUser);
  const { settings } = useSelector(selectSettings);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);
  const [isComplete, setIsComplete] = useState(false);


  const getPaymentRequestDeatil = async (isPayment) => {
    setLoader(true);
    let res = await GET_PAYMENT_REQUEST_DETAIL({ navigation, token, slug });
    if (res.code == 200) {
      setData(res)
      setLoader(false);
      if (isPayment) {
        backScreenFunc?.(res?.payment_request, slug);
      }
    } else {
      setLoader(false);
    }
  }
  const striperInitilizer = async () => {
    console.log(settings?.stripeKey, "stripeKey")
    let initilize = await initStripe({ publishableKey: settings?.stripeKey });
    console.log(initilize, "initilize")
  }
  useEffect(() => {
    striperInitilizer();
    getPaymentRequestDeatil(false)
  }, [])


  const onPayPress = () => {
    setLoader(true);
    console.log(data, "data?.payment?.request_type")
    if (data?.payment_request?.request_type == "onetime") {
      payOnetime()

    } else if (data?.payment_request?.request_type == "recurring") {
      payRecurring()
    }
  }

  const payRecurring = async () => {

    try {
      setLoader(true);
      let res = await createToken({ type: "Card" });
      if (!!res?.token?.id) {
        console.log(res, "create token")
        payRecurringPaymentFromServer(res?.token?.id)
      }
      else {
        setLoader(false);
        showToast({ title: "Failed", message: res?.message });
        console.log(res, "createToken error");
      }
    } catch (e) {
      setLoader(false);
      showToast({ title: "Failed", message: e?.message });
      console.log(e, "createToken error");
    }
  }

  const payRecurringPaymentFromServer = async (stripeToken) => {
    let res = await PAY_RECURRING({ navigation, token, body: { payment_request_slug: slug, source_token: stripeToken } });

    if (res.code == 200) {
      showToast({ title: "Payment Successful", type: "success" });
      getPaymentRequestDeatil(true);
    }
  }

  const payOnetime = async () => {
    let res = await GET_CLIENT_SECRET_FOR_PAY_ONETIME({ navigation, token, body: { payment_request_slug: slug } });
    if (res.code == 200) {
      if (!!res?.client_secret) {
        const { paymentIntent, error } = await confirmPayment(res?.client_secret, {
          paymentMethodType: 'Card'
        });

        if (error) {
          console.log(error, "stripe payment error")
          setLoader(false);
          showToast({ title: "Payment Failed", body: error?.localizedMessage });
        } else {
          console.log(paymentIntent, "paymentIntent")
          changePayementStatusToServer()
        }

      } else {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  }

  const changePayementStatusToServer = async () => {
    let res = await CHANGE_ONETIME_PAYMNET_STATUS_TO_PAID({ navigation, token, body: { payment_request_slug: slug } });
    if (res.code == 200) {
      showToast({ title: "Payment Successful", type: "success" });
      getPaymentRequestDeatil(true);
    }
  }

  const paymentView = () => {
    return (
      <View>
        <View style={{ marginTop: 10 }}>
          <MyText color={colors.primary} fontSize={18} type='medium' >Enter Card Details</MyText>
        </View>
        <View style={{ marginTop: 10, }}>
          <CardField
            postalCodeEnabled={false}
            placeholders={{ number: 'Card Number...', }}
            cardStyle={{
              backgroundColor: colors.secondary,
              textColor: colors.white,
              fontFamily: fonts.regular,
              placeholderColor: colors.placeholder,
              keyboardAppearance: "dark",
              borderRadius: 10,
              cursorColor: colors.white,
            }}
            style={{ height: 40, }}
            onCardChange={(res) => {
              setIsComplete(res?.complete)
            }}
          />
        </View>
        {isComplete &&
          <View style={{ alignSelf: "flex-end", marginTop: 10 }}>
            <MyButton onPress={onPayPress} style={{ paddingHorizontal: 20, height: 35 }} invert title='Pay' />
          </View>
        }
      </View >
    )
  }



  const statusView = (value) => {
    return (
      <View style={{ backgroundColor: value ? colors.green + "33" : colors.delete + "33", paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
        <MyText type='medium' color={value ? colors.green : colors.delete} >{value ? "Successful" : "Failed"}</MyText>
      </View>)
  }

  const renderTransaction = (item, index) => {
    return (<View style={{ backgroundColor: colors.secondary, padding: 10, borderRadius: 10, marginTop: 10 }}>

      <StatView title={"Amount:"} value={prependCurency(item?.currency) + " " + item?.amount} />
      <StatView title={"Transaction Note:"} value={item?.transaction_note} />
      <StatView title={"Transaction Date:"} value={item?.transaction_date} />
      <StatView title={"Status:"} view={() => statusView(item?.transaction_status == "succeeded")} />
    </View>)
  }

  const headerView = () => {
    let payment = data?.payment_request;
    if (!!payment) {
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
              {payment?.request_type == "recurring" &&
                <>
                  <StatView title={"Initial Deposit Amount:"} value={prependCurency(payment?.currency) + " " + payment?.initial_amount} />
                  <StatView title={"Total Installments:"} value={payment?.month} />
                  <StatView title={"Installments Plan:"} value={payment?.month + " " + payment?.request_iteration_type} />
                </>}
            </View>
          </View>
          <View>
          </View>
          {(payment?.is_first_paid == false) && paymentView()}

          <View style={{ marginTop: 10 }}>
            <MyText color={colors.primary} fontSize={18} type='medium' >Transactions</MyText>
          </View>
        </View>
      )
    }
    else return null;
  }


  return (
    <RootView title={"Payment Request Transaction"} >
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps="handled">

          {headerView()}
          {(!!data?.payment_request_transaction &&
            data?.payment_request_transaction.length > 0) ?
            data?.payment_request_transaction.map((x, i) => renderTransaction(x, i)) :
            !loader && <EmptyView />
          }

        </ScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default PaymentrequestDetail