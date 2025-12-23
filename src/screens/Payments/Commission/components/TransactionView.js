import {View, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../../../utilities/colors';
import {STRINGS} from '../../../../utilities/strings';
import StatView from '../../../Members/Components/StatView';
import MyText from '../../../../components/MyText';
import UserImage from '../../../../components/UserImage';
import prependCurency from '../../../../functions/prependCurency';
import {dateTimeFormat} from '../../../../utilities/constants';
import {convertTimezone} from '../../../../functions/convertTime';
import {Flex, Row} from '../../../../UIComponents/FlexViews';

const TransactionView = ({item, timezone, isCredit}) => {
  return (
    <View style={styles.itemRootView}>
      {isCredit && (
        <>
          {!!item?.member_info?.first_name ? (
            <Row alignItems="center">
              <UserImage
                image={item?.member_info?.profile_image}
                name={item?.member_info?.first_name}
                backgroundTransparent
                size={35}
              />
              <Flex flex={1} ml={10}>
                <MyText type="medium">
                  {item?.member_info?.first_name +
                    ' ' +
                    item?.member_info?.last_name}
                </MyText>
              </Flex>
            </Row>
          ) : (
            <Row alignItems="center">
              <UserImage
                image={undefined}
                name={item?.shipping_object?.name}
                backgroundTransparent
                size={35}
              />
              <Flex flex={1} ml={10}>
                <MyText type="medium">{item?.shipping_object?.name}</MyText>
              </Flex>
            </Row>
          )}
        </>
      )}
      <View>
        <StatView
          title={STRINGS.COMMISSION_TRANSACTION_VIEW.transactionDate}
          value={
            isCredit
              ? convertTimezone(item?.transaction_date, timezone).format(
                  dateTimeFormat.date,
                )
              : item?.transaction_date
          }
          uppercase
        />
        {isCredit ? (
          <StatView
            title={STRINGS.COMMISSION_TRANSACTION_VIEW.credit}
            value={
              prependCurency(item?.currency) +
              ' ' +
              Number(item?.referral_commission)?.toFixed(2)
            }
          />
        ) : (
          <StatView
            title={STRINGS.COMMISSION_TRANSACTION_VIEW.paid}
            value={
              prependCurency(item?.currency) +
              ' ' +
              Number(item?.amount).toFixed(2)
            }
          />
        )}
      </View>
    </View>
  );
};

export default TransactionView;

const styles = StyleSheet.create({
  itemRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
});
