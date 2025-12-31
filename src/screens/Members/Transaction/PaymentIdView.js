import React from 'react';
import {TouchableOpacity} from 'react-native';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import {icons} from '../../../utilities/icons';
import copyText from '../../../functions/copyText';
import removeUnderscore from '../../../functions/removeUnderscore';

export const PaymentIdView = ({item}) => {
  let type = removeUnderscore(item?.payment_made_by);
  let id = '';

  if (item?.payment_made_by == 'stripe') {
    if (item?.transaction_request_type == 'onetime') {
      id = item?.payment_intent || '';
    }
    if (item?.transaction_request_type == 'recurring') {
      id = item?.subscription?.stripe_subscription_id || '';
    }
  } else if (
    item?.payment_made_by == 'in_app_purchase' ||
    item?.payment_made_by == 'in app_purchase'
  ) {
    id = item?.in_app_purchase_transaction_id || '';
  } else if (item?.payment_made_by == 'clickfunnels') {
    id = item?.clickfunnel_info?.data?.id || '';
  } else if (item?.payment_made_by == 'paypal') {
    id = item?.paypal_payment_id || '';
  } else if (item?.payment_made_by == 'fire') {
    id = item?.fire_payment_id || '';
  }

  return (
    <Flex flex={1}>
      <Row flexWrap="wrap">
        <MyText
          style={{textTransform: 'capitalize'}}
          fontSize={12}
          type="medium">
          {type}
        </MyText>
        {!!id && (
          <TouchableOpacity
            style={{marginLeft: 5}}
            onPress={() => copyText(id)}>
            <Row flexWrap="wrap">
              {icons.copyOulined(15, colors.primary)}
              <Flex ml={5}>
                <MyText
                  style={{textTransform: 'capitalize'}}
                  fontSize={12}
                  type="medium">
                  ({id})
                </MyText>
              </Flex>
            </Row>
          </TouchableOpacity>
        )}
      </Row>
    </Flex>
  );
};
