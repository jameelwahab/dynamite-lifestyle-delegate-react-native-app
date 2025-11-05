import React from 'react';
import { View } from 'react-native';
import MyText from '../../../components/MyText';
import { colors } from '../../../utilities/colors';

export const OtherInformationView = ({ row }) => {
  if (row.other_info_menu == "N/A" || !row.other_info) {
    return (
      <MyText fontSize={12} type="medium">
        N/A
      </MyText>
    );
  }

  return (
    <View>
      {!!row.other_info?.main_menu && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>Main Menu: </MyText>
          <MyText fontSize={12} type="medium">{row.other_info.main_menu}</MyText>
        </View>
      )}
      {!!row.other_info?.starter_menu && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>Starter Menu: </MyText>
          <MyText fontSize={12} type="medium">{row.other_info.starter_menu}</MyText>
        </View>
      )}
      {!!row.other_info?.tea_and_coffee_menu && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>Tea and Coffee Menu: </MyText>
          <MyText fontSize={12} type="medium">{row.other_info.tea_and_coffee_menu}</MyText>
        </View>
      )}
      {!!row.other_info?.dietary_requirements && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>Dietary Requirements: </MyText>
          <MyText fontSize={12} type="medium">{row.other_info.dietary_requirements}</MyText>
        </View>
      )}
      {!!row.other_info?.dessert_menu && (
        <View style={{ marginBottom: 3 }}>
          <MyText fontSize={12} type="bold" color={colors.primary}>Dessert Menu: </MyText>
          <MyText fontSize={12} type="medium">{row.other_info.dessert_menu}</MyText>
        </View>
      )}
    </View>
  );
};
