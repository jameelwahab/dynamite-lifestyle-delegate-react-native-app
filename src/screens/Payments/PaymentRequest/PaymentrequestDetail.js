import {View, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {
  CHANGE_ONETIME_PAYMNET_STATUS_TO_PAID,
  CONFIRM_RECURRING_PAYMENT,
  GET_CLIENT_SECRET_FOR_PAY_ONETIME,
  GET_PAYMENT_REQUEST_DETAIL,
  PAY_RECURRING,
} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import MyLoader from '../../../components/MyLoader';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import {icons} from '../../../utilities/icons';
import StatView from '../../Members/Components/StatView';
import prependCurency from '../../../functions/prependCurency';
import moment from 'moment';
import {dateTimeFormat} from '../../../utilities/constants';
import EmptyView from '../../../components/EmptyView';
import {
  CardField,
  initStripe,
  confirmPayment,
  createToken,
} from '@stripe/stripe-react-native';
import {fonts} from '../../../utilities/fonts';
import {MyButton, TransparentButton} from '../../../components/MyButton';
import {selectSettings} from '../../../redux/reducers/settingSlice';
import showToast from '../../../functions/showToast';
import MyCheckBox from '../../../components/MyCheckBox';
import EmailModal from '../../../components/ReminderModals/EmailModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import {selectSocket} from '../../../redux/reducers/socketSlice';
import NotificationModal from '../../../components/ReminderModals/NotificationModal';
import MessageModal from '../../../components/ReminderModals/MessageModal';
import WhatsappModal from '../../../components/ReminderModals/WhatsappModal';
import MemberView from '../../../components/MemberView';

const PaymentrequestDetail = ({navigation, route}) => {
  const {slug, backScreenFunc} = route?.params;
  const refEmailModal = useRef();
  const refNotificationModal = useRef();
  const refMessageModal = useRef();
  const refWhatsappModal = useRef();
  const {token} = useSelector(selectUser);
  const {settings} = useSelector(selectSettings);
  const {socket} = useSelector(selectSocket);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [reminders, setReminders] = useState({
    isEmailChecked: true,
    isNotificationChecked: true,
    isMessageChecked: true,
    isWhatsappChecked: true,
  });

  const getPaymentRequestDeatil = async isPayment => {
    setLoader(true);
    let res = await GET_PAYMENT_REQUEST_DETAIL({navigation, token, slug});
    if (res.code == 200) {
      setData(res);
      setReminders({
        isEmailChecked: res?.notification_action?.email_notification_access,
        isNotificationChecked:
          res?.notification_action?.push_notification_access,
        isMessageChecked: res?.notification_action?.message_notification_access,
        isWhatsappChecked:
          res?.notification_action?.whatsapp_notification_access,
      });
      setLoader(false);
      if (isPayment) {
        backScreenFunc?.(res?.payment_request, slug);
      }
    } else {
      setLoader(false);
    }
  };
  const striperInitilizer = async () => {
    let initilize = await initStripe({publishableKey: settings?.stripeKey});
  };
  useEffect(() => {
    striperInitilizer();
    getPaymentRequestDeatil(false);
  }, []);

  const onPayPress = () => {
    setLoader(true);

    if (data?.payment_request?.request_type == 'onetime') {
      payOnetime();
    } else if (data?.payment_request?.request_type == 'recurring') {
      payRecurring();
    }
  };

  const payRecurring = async () => {
    try {
      setLoader(true);
      let res = await createToken({type: 'Card'});
      if (!!res?.token?.id) {
        payRecurringPaymentFromServer(res?.token?.id);
      } else {
        setLoader(false);
        showToast({
          title: STRINGS.PAYMENT_REQUEST_DETAIL.failed,
          message: res?.message,
        });
      }
    } catch (e) {
      setLoader(false);
      showToast({
        title: STRINGS.PAYMENT_REQUEST_DETAIL.failed,
        message: e?.message,
      });
    }
  };

  const payRecurringPaymentFromServer = async stripeToken => {
    let res = await PAY_RECURRING({
      navigation,
      token,
      body: {payment_request_slug: slug, source_token: stripeToken},
    });
    if (res.code == 200) {
      showToast({
        title: STRINGS.PAYMENT_REQUEST_DETAIL.paymentSuccessful,
        type: 'success',
      });
      getPaymentRequestDeatil(true);
    } else if (res.code == 210) {
      const {paymentIntent, error} = await confirmPayment(res?.client_secret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        setLoader(false);
        showToast({
          title: STRINGS.PAYMENT_REQUEST_DETAIL.paymentFailed,
          body: error?.localizedMessage,
        });
      } else {
        confirmRecurringPaymentToServer(res);
      }
    } else {
      setLoader(false);
      showToast({
        title: STRINGS.PAYMENT_REQUEST_DETAIL.failed,
        message: res?.message,
      });
    }
  };
  const confirmRecurringPaymentToServer = async obj => {
    let res = await CONFIRM_RECURRING_PAYMENT({
      navigation,
      token,
      body: {
        payment_request_slug: slug,
        price_id: obj?.stripe_initial_price_id,
        recurring_price_id: obj?.strip_recurring_price_id,
        subscription_id: obj?.strip_subscription_id,
      },
    });
    if (res.code == 200) {
      showToast({
        title: STRINGS.PAYMENT_REQUEST_DETAIL.paymentSuccessful,
        type: 'success',
      });
      getPaymentRequestDeatil(true);
    } else {
      setLoader(false);
      showToast({
        title: STRINGS.PAYMENT_REQUEST_DETAIL.failed,
        message: res?.message,
      });
    }
  };

  const payOnetime = async () => {
    let res = await GET_CLIENT_SECRET_FOR_PAY_ONETIME({
      navigation,
      token,
      body: {payment_request_slug: slug},
    });
    if (res.code == 200) {
      if (!!res?.client_secret) {
        const {paymentIntent, error} = await confirmPayment(
          res?.client_secret,
          {
            paymentMethodType: 'Card',
          },
        );

        if (error) {
          setLoader(false);
          showToast({
            title: STRINGS.PAYMENT_REQUEST_DETAIL.paymentFailed,
            body: error?.localizedMessage,
          });
        } else {
          changePayementStatusToServer();
        }
      } else {
        setLoader(false);
      }
    } else {
      setLoader(false);
    }
  };

  const changePayementStatusToServer = async () => {
    let res = await CHANGE_ONETIME_PAYMNET_STATUS_TO_PAID({
      navigation,
      token,
      body: {payment_request_slug: slug},
    });
    if (res.code == 200) {
      showToast({
        title: STRINGS.PAYMENT_REQUEST_DETAIL.paymentSuccessful,
        type: 'success',
      });
      getPaymentRequestDeatil(true);
    } else {
      setLoader(false);
    }
  };

  const onReminderSavePress = newData => {
    let newObj = {
      ...data,
      notification_action: {
        ...data?.notification_action,
        ...newData,
      },
    };
    setData(newObj);
  };

  const sendReminder = () => {
    setIsConfirmationVisible(false);
    socket.emit('send_payment_request_reminder_reciever', {
      payment_request_id: data?.payment_request?._id,
      notification_action: data?.notification_action,
    });
    showToast({
      title: STRINGS.PAYMENT_REQUEST_DETAIL.reminderSentSuccess,
      type: 'success',
    });
  };

  const paymentView = () => {
    return (
      <View>
        <View style={styles.sectionHeader}>
          <MyText color={colors.primary} fontSize={18} type="medium">
            {STRINGS.PAYMENT_REQUEST_DETAIL.enterCardDetails}
          </MyText>
        </View>
        <View style={styles.cardFieldContainer}>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: STRINGS.PAYMENT_REQUEST_DETAIL.cardNumberPlaceholder,
            }}
            cardStyle={{
              backgroundColor: colors.secondary,
              textColor: colors.white,
              fontFamily: fonts.regular,
              placeholderColor: colors.placeholder,
              keyboardAppearance: 'dark',
              borderRadius: 10,
              cursorColor: colors.white,
            }}
            style={styles.cardFieldStyle}
            onCardChange={res => {
              setIsComplete(res?.complete);
            }}
          />
        </View>

        {isComplete && (
          <View style={styles.payButtonContainer}>
            <MyButton
              onPress={onPayPress}
              style={styles.payButton}
              invert
              title={STRINGS.PAYMENT_REQUEST_DETAIL.pay}
            />
          </View>
        )}
      </View>
    );
  };

  const statusView = value => {
    return (
      <View
        style={[
          styles.statusBadge,
          {backgroundColor: value ? colors.green + '33' : colors.delete + '33'},
        ]}>
        <MyText type="medium" color={value ? colors.green : colors.delete}>
          {value
            ? STRINGS.PAYMENT_REQUEST_DETAIL.successful
            : STRINGS.PAYMENT_REQUEST_DETAIL.failed}
        </MyText>
      </View>
    );
  };

  const renderTransaction = (item, index) => {
    return (
      <View key={item?._id} style={styles.transactionItem}>
        <StatView
          title={STRINGS.PAYMENT_REQUEST_DETAIL.amount}
          value={prependCurency(item?.currency) + ' ' + item?.amount}
        />
        <StatView
          title={STRINGS.PAYMENT_REQUEST_DETAIL.transactionNote}
          value={item?.transaction_note}
        />
        <StatView
          title={STRINGS.PAYMENT_REQUEST_DETAIL.transactionDate}
          value={item?.transaction_date}
        />
        <StatView
          title={STRINGS.PAYMENT_REQUEST_DETAIL.status}
          view={() => statusView(item?.transaction_status == 'succeeded')}
        />
      </View>
    );
  };

  const reminderView = () => {
    return (
      <View>
        <View style={styles.sectionHeader}>
          <MyText color={colors.primary} fontSize={18} type="medium">
            {STRINGS.PAYMENT_REQUEST_DETAIL.reminder}
          </MyText>
        </View>
        <View style={[styles.cardView, styles.reminderCard]}>
          {reminders?.isEmailChecked && (
            <View style={styles.checkView}>
              <View style={styles.checkboxVIew}>
                <MyCheckBox
                  value={data?.notification_action?.email_notification_access}
                  onPress={() =>
                    onReminderSavePress({
                      email_notification_access:
                        !data?.notification_action?.email_notification_access,
                    })
                  }
                  title={STRINGS.PAYMENT_REQUEST_DETAIL.email}
                />
              </View>
              <View style={styles.cardViewEditBtn}>
                <TransparentButton
                  onPress={() =>
                    refEmailModal?.current?.openModal(
                      data?.notification_action?.email_notification_info,
                    )
                  }
                  icon={() => icons.editpencil()}
                />
              </View>
            </View>
          )}

          {reminders?.isNotificationChecked && (
            <View style={styles.checkView}>
              <View style={styles.checkboxVIew}>
                <MyCheckBox
                  value={data?.notification_action?.push_notification_access}
                  onPress={() =>
                    onReminderSavePress({
                      push_notification_access:
                        !data?.notification_action?.push_notification_access,
                    })
                  }
                  title={STRINGS.PAYMENT_REQUEST_DETAIL.notification}
                />
              </View>
              <View style={styles.cardViewEditBtn}>
                <TransparentButton
                  onPress={() =>
                    refNotificationModal?.current?.openModal(
                      data?.notification_action?.push_notification_info,
                    )
                  }
                  icon={() => icons.editpencil()}
                />
              </View>
            </View>
          )}

          {reminders?.isMessageChecked && (
            <View style={styles.checkView}>
              <View style={styles.checkboxVIew}>
                <MyCheckBox
                  value={data?.notification_action?.message_notification_access}
                  onPress={() =>
                    onReminderSavePress({
                      message_notification_access:
                        !data?.notification_action?.message_notification_access,
                    })
                  }
                  title={STRINGS.PAYMENT_REQUEST_DETAIL.message}
                />
              </View>
              <View style={styles.cardViewEditBtn}>
                <TransparentButton
                  onPress={() =>
                    refMessageModal?.current?.openModal(
                      data?.notification_action?.message_notification_info,
                    )
                  }
                  icon={() => icons.editpencil()}
                />
              </View>
            </View>
          )}

          {reminders?.isWhatsappChecked && (
            <View style={styles.checkView}>
              <View style={styles.checkboxVIew}>
                <MyCheckBox
                  value={
                    data?.notification_action?.whatsapp_notification_access
                  }
                  onPress={() =>
                    onReminderSavePress({
                      whatsapp_notification_access:
                        !data?.notification_action
                          ?.whatsapp_notification_access,
                    })
                  }
                  title={STRINGS.PAYMENT_REQUEST_DETAIL.whatsapp}
                />
              </View>
              <View style={styles.cardViewEditBtn}>
                <TransparentButton
                  onPress={() =>
                    refWhatsappModal?.current?.openModal(
                      data?.notification_action?.whatsapp_notification_info,
                    )
                  }
                  icon={() => icons.editpencil()}
                />
              </View>
            </View>
          )}

          <View style={styles.reminderButtonContainer}>
            <MyButton
              invert
              style={styles.reminderButton}
              title={STRINGS.PAYMENT_REQUEST_DETAIL.sendReminder}
              onPress={() => setIsConfirmationVisible(true)}
            />
          </View>
        </View>
      </View>
    );
  };

  const headerView = () => {
    let payment = data?.payment_request;
    if (!!payment) {
      return (
        <View>
          <View style={styles.cardView}>
            <MyText fontSize={16} type="medium">
              {payment?.request_title}
            </MyText>
            <View style={styles.dateContainer}>
              {icons.calendar(colors.lightText, 18)}
              <MyText
                color={colors.lightText}
                type="medium"
                style={styles.dateText}>
                {moment(payment?.createdAt).format(dateTimeFormat.date)}
              </MyText>
            </View>

            <View style={styles.statsContainer}>
              <StatView
                title={STRINGS.PAYMENT_REQUEST_DETAIL.requestType}
                value={payment?.request_type}
              />
              <StatView
                title={STRINGS.PAYMENT_REQUEST_DETAIL.totalAmount}
                value={
                  prependCurency(payment?.currency) +
                  ' ' +
                  payment?.total_amount
                }
              />
              {payment?.request_type == 'recurring' && (
                <>
                  <StatView
                    title={STRINGS.PAYMENT_REQUEST_DETAIL.initialDepositAmount}
                    value={
                      prependCurency(payment?.currency) +
                      ' ' +
                      payment?.initial_amount
                    }
                  />
                  <StatView
                    title={STRINGS.PAYMENT_REQUEST_DETAIL.totalInstallments}
                    value={payment?.month}
                  />
                  <StatView
                    title={STRINGS.PAYMENT_REQUEST_DETAIL.installmentsPlan}
                    value={
                      payment?.month + ' ' + payment?.request_iteration_type
                    }
                  />
                </>
              )}
            </View>
          </View>
          {Object.values(reminders).some(x => x == true) && reminderView()}
          <View></View>
          {payment?.is_first_paid == false && paymentView()}

          <View style={styles.sectionHeader}>
            <MyText color={colors.primary} fontSize={18} type="medium">
              {STRINGS.PAYMENT_REQUEST_DETAIL.transactions}
            </MyText>
          </View>
        </View>
      );
    } else return null;
  };

  return (
    <RootView title={STRINGS.PAYMENT_REQUEST_DETAIL.title}>
      {!!data?.member_info && <MemberView member={data?.member_info} />}
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps="handled">
          {headerView()}
          {!!data?.payment_request_transaction &&
          data?.payment_request_transaction.length > 0
            ? data?.payment_request_transaction.map((x, i) =>
                renderTransaction(x, i),
              )
            : !loader && <EmptyView />}
        </ScrollView>
      </View>
      <MyLoader enable={loader} />
      <EmailModal
        ref={refEmailModal}
        onReminderSavePress={onReminderSavePress}
      />

      <NotificationModal
        ref={refNotificationModal}
        onReminderSavePress={onReminderSavePress}
      />

      <MessageModal
        ref={refMessageModal}
        onReminderSavePress={onReminderSavePress}
      />

      <WhatsappModal
        ref={refWhatsappModal}
        onReminderSavePress={onReminderSavePress}
      />

      <ConfirmationModal
        title={STRINGS.PAYMENT_REQUEST_DETAIL.sendReminderConfirmation}
        isVisible={isConfirmationVisible}
        onAgree={sendReminder}
        closeModal={() => setIsConfirmationVisible(false)}
      />
    </RootView>
  );
};

export default PaymentrequestDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  cardView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
  },
  checkView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxVIew: {
    flex: 1,
  },
  cardViewEditBtn: {
    marginBottom: 0,
  },
  sectionHeader: {
    marginTop: 10,
  },
  cardFieldContainer: {
    marginTop: 10,
  },
  cardFieldStyle: {
    height: 40,
  },
  payButtonContainer: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  payButton: {
    paddingHorizontal: 20,
    height: 35,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderRadius: 10,
  },
  transactionItem: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  reminderCard: {
    marginTop: 10,
  },
  reminderButtonContainer: {
    marginTop: 10,
  },
  reminderButton: {
    marginHorizontal: 0,
    height: 35,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dateText: {
    marginLeft: 5,
  },
  statsContainer: {
    marginTop: 10,
  },
});
