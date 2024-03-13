import { View, SafeAreaView, StyleSheet, Pressable } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal';
import { colors } from '../../../../utilities/colors';
import MyText from '../../../../components/MyText';
import { icons } from '../../../../utilities/icons';
import StatView from '../../../../components/StatView';
import MyCheckBox from '../../../../components/MyCheckBox';
import { MyButton } from '../../../../components/MyButton';
import copyText from '../../../../functions/copyText';
import { BANK_PAYMENT_LINK } from '../../../../DAL';
import MyLoader from '../../../../components/MyLoader';
import Toast from 'react-native-toast-message';

const BankOptionModal = forwardRef(({ navigation, token }, ref) => {
  const [paymentCurrency, setPaymentCurrency] = useState("eur");
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      openModal
    }
  }, [])


  const openModal = (data) => {
    setData(data)
  }

  const closeModal = () => {
    if (loader == false) {
      setData(null)
    }
  }


  const copyBankLinkFromServer = async () => {
    setLoader(true);
    let res = await BANK_PAYMENT_LINK({ navigation, token, transactionId: data?.payment_request?._id, currency: paymentCurrency });
    setLoader(false);
    if (res.code == 200) {
      copyText(res?.redirect_url, "Bank URL coppied to clipboard");
      closeModal()
    }
  }


  return (
    <Modal
      isVisible={!!data}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={300}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0, }}>
      <SafeAreaView style={__styles.rootView}>
        <View style={__styles.innerView}>
          <View style={__styles.header}>
            <MyText color={colors.primary} fontSize={20} type='medium'>Payment Request Detail</MyText>
            <Pressable
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              onPress={closeModal}>
              {icons.crosss(colors.white, 25)}
            </Pressable>
          </View>

          <View>
            <StatView
              title={"Name"}
              value={
                !!data?.payment_request?.member?.first_name ?
                  data?.payment_request?.member?.first_name + " " + data?.payment_request?.member?.last_name :
                  "N/A"} />

            <StatView title={"Email"} original
              value={
                !!data?.payment_request?.member?.email ?
                  data?.payment_request?.member?.email :
                  "N/A"
              }  />

          </View>
          <View style={{ marginTop: 20 }}>
            {!!data?.payment_in_euro?.amount &&
              <View style={__styles.checkboxView}>
                <View style={{ flex: 1 }}>
                  <MyCheckBox
                    value={paymentCurrency == "eur"}
                    title='Payment in Euro'
                    onPress={() => setPaymentCurrency("eur")}
                  />
                </View>
                <MyText color={colors.lightGrey} >€ {data?.payment_in_euro?.amount}</MyText>
              </View>}
            {!!data?.payment_in_pound?.amount &&
              <View style={[__styles.checkboxView, { marginTop: 5 }]}>
                <View style={{ flex: 1 }}>
                  <MyCheckBox
                    value={paymentCurrency == "gbp"}
                    title='Payment in Pound'
                    onPress={() => setPaymentCurrency("gbp")}
                  />
                </View>
                <MyText color={colors.lightGrey} >£ {data?.payment_in_pound?.amount}</MyText>
              </View>}
          </View>

          <View style={__styles.btnView}>
            <MyButton
              title='Copy Bank Url'
              invert
              style={{ paddingHorizontal: 10 }}
              onPress={copyBankLinkFromServer}
            />
          </View>
        </View>

        <MyLoader enable={loader} />
      </SafeAreaView>
      {!!data && <Toast />}
    </Modal>
  )
})

export default BankOptionModal;

const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  innerView: {
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.white + "55",
    paddingBottom: 10,
    marginBottom: 10
  },
  checkboxView: {
    flexDirection: "row"
  },
  btnView: { alignItems: "flex-end", marginTop: 20 }
})