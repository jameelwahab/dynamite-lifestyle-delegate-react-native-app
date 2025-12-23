import {View, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import StatView from '../../../Members/Components/StatView';
import MyText from '../../../../components/MyText';
import {colors} from '../../../../utilities/colors';
import {STRINGS} from '../../../../utilities/strings';
import prependCurency from '../../../../functions/prependCurency';
import {fonts} from '../../../../utilities/fonts';
import {MenuButton} from '../../../../components/MyButton';
import MemberView from '../../../../components/MemberView';
import moment from 'moment';
import {dateTimeFormat} from '../../../../utilities/constants';
import StatusView from '../../../../components/StatusView';

const RequestView = ({item, index, openOptionModal, onDetail}) => {
  return (
    <View style={styles.itemRootView}>
      <View style={styles.profileView}>
        <Pressable
          onPress={() => onDetail(item?.payment_request_slug)}
          style={[styles.profileView, styles.pressableProfile]}>
          <MemberView
            member={item?.member}
            marginLeft={0}
            size={35}
            titleSize={14}
          />
        </Pressable>
        <MenuButton onPress={() => openOptionModal(item)} size={20} />
      </View>
      <View>
        <StatView
          title={STRINGS.REQUEST_VIEW.requestTitle}
          value={
            !!item?.request_title ? item?.request_title : STRINGS.GENERIC.N_A
          }
          noFontTransform
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.product}
          value={
            !!item?.product?.name ? item?.product?.name : STRINGS.GENERIC.N_A
          }
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.paymentTemplate}
          value={
            !!item?.payment_template?.title
              ? item?.payment_template?.title
              : STRINGS.GENERIC.N_A
          }
          noFontTransform
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.requestType}
          value={item?.request_type}
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.totalAmount}
          value={prependCurency(item?.currency) + ' ' + item?.total_amount}
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.initialAmount}
          value={prependCurency(item?.currency) + ' ' + item?.initial_amount}
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.installmentAmount}
          value={
            prependCurency(item?.currency) + ' ' + item?.installment_amount
          }
        />
        <StatView title={STRINGS.REQUEST_VIEW.month} value={item?.month} />
        {!!item?.sale_page && (
          <StatView
            title={STRINGS.REQUEST_VIEW.salePage}
            value={item?.sale_page?.sale_page_title}
          />
        )}
        <StatView
          title={STRINGS.REQUEST_VIEW.considerPurchasingUser}
          value={item?.consider_purchasing_user || STRINGS.GENERIC.N_A}
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.leadStatus}
          view={() =>
            !!item?.payment_template?.lead_status ? (
              <StatusView
                bgColor={item?.payment_template?.lead_status?.background_color}
                value={item?.payment_template?.lead_status?.title}
              />
            ) : (
              <MyText fontSize={12} type="medium">
                {STRINGS.GENERIC.N_A}
              </MyText>
            )
          }
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.firstPaid}
          view={() => (
            <PaidView
              value={item?.is_first_paid}
              text={
                item?.payment_status == 'cancelled'
                  ? `${STRINGS.REQUEST_VIEW.cancelledOn} ${moment(
                      item?.cancel_date,
                    ).format(dateTimeFormat.date)}`
                  : item?.is_first_paid
                  ? `${STRINGS.REQUEST_VIEW.paidOn} ${moment(
                      item?.subscription_date,
                    ).format(dateTimeFormat.date)} `
                  : item?.payment_status == 'processing'
                  ? STRINGS.REQUEST_VIEW.processing
                  : STRINGS.REQUEST_VIEW.pending
              }
            />
          )}
        />
        <StatView
          title={STRINGS.REQUEST_VIEW.status}
          view={() => (
            <PaidView
              value={item?.status}
              text={
                item?.status
                  ? STRINGS.REQUEST_VIEW.active
                  : STRINGS.REQUEST_VIEW.inactive
              }
            />
          )}
        />
      </View>
    </View>
  );
};

const PaidView = ({value, text}) => {
  return (
    <View
      style={[
        styles.statusView,
        {backgroundColor: value ? colors.green + '33' : colors.delete + '33'},
      ]}>
      <MyText
        color={value ? colors.green : colors.delete}
        style={styles.statusText}>
        {text}
      </MyText>
    </View>
  );
};

export default RequestView;

const styles = StyleSheet.create({
  itemRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  profileView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressableProfile: {
    flex: 1,
    marginRight: 10,
  },
  profileNameView: {
    flex: 1,
    marginLeft: 10,
  },
  statusView: {
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
});
