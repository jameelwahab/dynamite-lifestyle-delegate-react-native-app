import React from 'react';
import { View } from 'react-native';
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';

const convertCurrencyToSign = (currency) => {
  switch (currency?.toLowerCase()) {
    case 'usd':
      return '$';
    case 'eur':
      return '€';
    case 'gbp':
      return '£';
    default:
      return currency || '$';
  }
};

export const DiscountInformationView = ({ item }) => {
  const { currency, discount_info } = item;
  let Currency = convertCurrencyToSign(currency);

  if (!discount_info) {
    return (
      <MyText fontSize={12} type="medium">
        N/A
      </MyText>
    );
  }

  return (
    <View>
      <View style={{ marginBottom: 3 }}>
        <MyText fontSize={12} type="bold" color={colors.primary}>
          Original Amount:{' '}
        </MyText>
        <MyText fontSize={12} type="medium">
          {Currency + discount_info.original_amount}
        </MyText>
      </View>

      {discount_info.discount_amount > 0 && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>
            Discount:{' '}
          </MyText>
          <MyText fontSize={12} type="medium">
            {Currency + discount_info.discount_amount.toFixed(2)}
          </MyText>
        </View>
      )}

      {discount_info.id && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>
            Discount Code:{' '}
          </MyText>
          <MyText fontSize={12} type="medium">
            {discount_info.id}
          </MyText>
        </View>
      )}

      {discount_info.coins_deduction > 0 && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>
            Coins Deduction:{' '}
          </MyText>
          <MyText fontSize={12} type="medium">
            {discount_info.coins_deduction}
          </MyText>
        </View>
      )}
    </View>
  );
};
