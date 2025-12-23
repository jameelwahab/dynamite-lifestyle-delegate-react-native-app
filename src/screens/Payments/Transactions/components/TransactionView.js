import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from '../../../../utilities/colors';
import {STRINGS} from '../../../../utilities/strings';
import StatView from '../../../Members/Components/StatView';
import MyText from '../../../../components/MyText';
import UserImage from '../../../../components/UserImage';
import prependCurency from '../../../../functions/prependCurency';
import openUrl from '../../../../functions/openUrl';
import {dateTimeFormat} from '../../../../utilities/constants';
import {convertTimezone} from '../../../../functions/convertTime';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../../redux/reducers/userSlice';
import {Flex, Row} from '../../../../UIComponents/FlexViews';
import {__transactionListStyles} from '../__styles';

const TransactionView = ({item, timezone}) => {
  const {S3_URL} = useSelector(selectUser);

  return (
    <View style={__transactionListStyles.itemRootView}>
      <Row alignItems="center">
        <UserImage
          image={item?.member_info?.profile_image}
          name={item?.member_info?.first_name}
          backgroundTransparent
          size={35}
        />
        <Flex ml={10}>
          <MyText type="medium">
            {item?.member_info?.first_name + ' ' + item?.member_info?.last_name}
          </MyText>

          <View
            style={[
              __transactionListStyles.statusBadge,
              item?.transaction_status == 'succeeded' &&
                __transactionListStyles.succeededBadge,
            ]}>
            <MyText
              capitalize
              type="bold"
              color={
                item?.transaction_status == 'succeeded'
                  ? colors.green
                  : colors.transparent
              }
              fontSize={12}>
              {STRINGS.TRANSACTION_VIEW.succeeded}
            </MyText>
          </View>
        </Flex>
      </Row>
      <View>
        <StatView
          title={STRINGS.TRANSACTION_VIEW.programAmount}
          value={prependCurency(item?.currency) + ' ' + item?.amount}
        />
        <StatView
          title={STRINGS.TRANSACTION_VIEW.transaction}
          value={`${STRINGS.TRANSACTION_VIEW.salePage} (${item?.sale_page?.sale_page_title} | ${item?.plan?.plan_title} | ${item?.plan?.payment_access})`}
        />
        <StatView
          title={STRINGS.TRANSACTION_VIEW.commissionAmount}
          value={
            prependCurency(item?.currency) + ' ' + item?.referral_commission
          }
        />
        <StatView
          title={STRINGS.TRANSACTION_VIEW.transactionMode}
          value={item?.transaction_mode}
        />
        <StatView
          title={STRINGS.TRANSACTION_VIEW.agreementPDF}
          value={<PdfLinkView link={item?.agrement_pdf_url} />}
        />
        <StatView
          title={STRINGS.TRANSACTION_VIEW.marketingAffiliateCommission}
          value={
            prependCurency(item?.currency) +
            ' ' +
            item?.marketing_affiliate_comission
          }
        />
        <StatView
          title={STRINGS.TRANSACTION_VIEW.date}
          value={convertTimezone(item?.transaction_date, timezone).format(
            dateTimeFormat.date,
          )}
        />
      </View>
    </View>
  );
};

export default TransactionView;

const PdfLinkView = ({link}) => {
  if (!!link) {
    return (
      <TouchableOpacity
        onPress={() => openUrl(S3_URL + link)}
        hitSlop={__transactionListStyles.hitSlop}
        style={__transactionListStyles.pdfLinkContainer}>
        <MyText color={colors.primary}>
          {STRINGS.TRANSACTION_VIEW.preview}
        </MyText>
      </TouchableOpacity>
    );
  } else return null;
};
