import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import {__styles} from './style';
import {MenuButton} from '../../../components/MyButton';
import StatView from '../Components/StatView';
import openUrl from '../../../functions/openUrl';
import EmptyView from '../../../components/EmptyView';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';

const SubscriptionVIew = ({list}) => {
  const {S3_URL} = useSelector(selectUser);

  const pdfLinkView = link => {
    if (!!link) {
      return (
        <TouchableOpacity
          onPress={() => openUrl(S3_URL + link)}
          hitSlop={{left: 5, top: 5, bottom: 5, right: 5}}
          style={{alignSelf: 'flex-start'}}>
          <MyText color={colors.primary}>View Agreement</MyText>
        </TouchableOpacity>
      );
    } else
      return (
        <View>
          <MyText>N/A</MyText>
        </View>
      );
  };

  const agreementView = isAgreement => {
    return (
      <View
        style={{
          alignSelf: 'flex-start',
          paddingHorizontal: 7,
          paddingVertical: 2,
          borderRadius: 8,
          backgroundColor: isAgreement
            ? colors.green + '55'
            : colors.delete + '55',
        }}>
        <MyText type="bold" color={isAgreement ? colors.green : colors.delete}>
          {' '}
          {isAgreement ? 'Yes' : 'No'}
        </MyText>
      </View>
    );
  };

  const renderItem = (item, index) => {
    return (
      <View
        key={item?._id}
        style={{
          backgroundColor: colors.secondary,
          borderRadius: 10,
          marginTop: 10,
          padding: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MyText color={colors.primary}> {`${index + 1}.`}</MyText>
        </View>
        {StatView({
          title: 'Page',
          value: !!item?.page?.sale_page_title
            ? item?.page?.sale_page_title
            : 'N/A',
        })}
        {StatView({
          title: 'Plan',
          value: !!item?.plan?.plan_title ? item?.plan?.plan_title : 'N/A',
        })}
        {StatView({
          title: 'Aggreement',
          view: () => agreementView(item?.is_sign_agreement),
        })}
        {StatView({
          title: 'Agreement File',
          view: () => pdfLinkView(item?.aggrement_pdf_url),
        })}
      </View>
    );
  };
  return (
    <View style={{paddingHorizontal: 5}}>
      {list.length > 0 ? list.map(renderItem) : <EmptyView />}
    </View>
  );
};

export default SubscriptionVIew;
