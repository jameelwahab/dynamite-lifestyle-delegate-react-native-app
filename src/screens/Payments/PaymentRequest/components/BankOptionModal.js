import {View, SafeAreaView, StyleSheet, Pressable} from 'react-native';
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../../../utilities/colors';
import {STRINGS} from '../../../../utilities/strings';
import MyText from '../../../../components/MyText';
import {icons} from '../../../../utilities/icons';
import StatView from '../../../../components/StatView';
import MyCheckBox from '../../../../components/MyCheckBox';
import {MyButton} from '../../../../components/MyButton';
import copyText from '../../../../functions/copyText';
import {BANK_PAYMENT_LINK} from '../../../../DAL';
import MyLoader from '../../../../components/MyLoader';
import Toast from 'react-native-toast-message';

const BankOptionModal = forwardRef(({navigation, token}, ref) => {
  const [paymentCurrency, setPaymentCurrency] = useState('eur');
  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal,
      };
    },
    [],
  );

  const openModal = data => {
    setData(data);
  };

  const closeModal = () => {
    if (loader == false) {
      setData(null);
    }
  };

  const copyBankLinkFromServer = async () => {
    setLoader(true);
    let res = await BANK_PAYMENT_LINK({
      navigation,
      token,
      transactionId: data?.payment_request?._id,
      currency: paymentCurrency,
    });
    setLoader(false);
    if (res.code == 200) {
      copyText(res?.redirect_url, STRINGS.BANK_OPTION_MODAL.bankUrlCopied);
      closeModal();
    }
  };

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
      style={styles.modal}>
      <SafeAreaView style={styles.rootView}>
        <View style={styles.innerView}>
          <View style={styles.header}>
            <MyText color={colors.primary} fontSize={20} type="medium">
              {STRINGS.BANK_OPTION_MODAL.title}
            </MyText>
            <Pressable hitSlop={styles.hitSlop} onPress={closeModal}>
              {icons.crosss(colors.white, 25)}
            </Pressable>
          </View>

          <View>
            <StatView
              title={STRINGS.BANK_OPTION_MODAL.name}
              value={
                !!data?.payment_request?.member?.first_name
                  ? data?.payment_request?.member?.first_name +
                    ' ' +
                    data?.payment_request?.member?.last_name
                  : STRINGS.GENERIC.N_A
              }
            />

            <StatView
              title={STRINGS.BANK_OPTION_MODAL.email}
              original
              value={
                !!data?.payment_request?.member?.email
                  ? data?.payment_request?.member?.email
                  : STRINGS.GENERIC.N_A
              }
            />
          </View>
          <View style={styles.checkboxContainer}>
            {!!data?.payment_in_euro?.amount && (
              <View style={styles.checkboxView}>
                <View style={styles.checkboxFlex}>
                  <MyCheckBox
                    value={paymentCurrency == 'eur'}
                    title={STRINGS.BANK_OPTION_MODAL.paymentInEuro}
                    onPress={() => setPaymentCurrency('eur')}
                  />
                </View>
                <MyText color={colors.lightGrey}>
                  € {data?.payment_in_euro?.amount}
                </MyText>
              </View>
            )}
            {!!data?.payment_in_pound?.amount && (
              <View style={[styles.checkboxView, styles.checkboxSpacing]}>
                <View style={styles.checkboxFlex}>
                  <MyCheckBox
                    value={paymentCurrency == 'gbp'}
                    title={STRINGS.BANK_OPTION_MODAL.paymentInPound}
                    onPress={() => setPaymentCurrency('gbp')}
                  />
                </View>
                <MyText color={colors.lightGrey}>
                  £ {data?.payment_in_pound?.amount}
                </MyText>
              </View>
            )}
          </View>

          <View style={styles.btnView}>
            <MyButton
              title={STRINGS.BANK_OPTION_MODAL.copyBankUrl}
              invert
              style={styles.button}
              onPress={copyBankLinkFromServer}
            />
          </View>
        </View>

        <MyLoader enable={loader} />
      </SafeAreaView>
      {!!data && <Toast />}
    </Modal>
  );
});

export default BankOptionModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  rootView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  innerView: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.white + '55',
    paddingBottom: 10,
    marginBottom: 10,
  },
  hitSlop: {
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
  },
  checkboxContainer: {
    marginTop: 20,
  },
  checkboxView: {
    flexDirection: 'row',
  },
  checkboxFlex: {
    flex: 1,
  },
  checkboxSpacing: {
    marginTop: 5,
  },
  btnView: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 10,
  },
});
