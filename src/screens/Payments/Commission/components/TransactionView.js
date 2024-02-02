import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../../../utilities/colors'
import StatView from '../../../Members/Components/StatView'
import MyText from '../../../../components/MyText'
import UserImage from '../../../../components/UserImage'
import prependCurency from '../../../../functions/prependCurency';
import openUrl from '../../../../functions/openUrl'
import { S3_URL, dateTimeFormat } from '../../../../utilities/constants'
import { convertTimezone } from '../../../../functions/convertTime'
import numFormatter from '../../../../DAL/numFormatter'


const TransactionView = ({ item, index, timezone, isCredit }) => {


  return (
    <View style={__styles.itemRootView}>
      {isCredit &&
        <>

          {!!item?.member_info?.first_name ?
            <View style={__styles.profileView}>
              <UserImage image={item?.member_info?.profile_image} name={item?.member_info?.first_name}
                backgroundTransparent size={35} />
              <View style={__styles.profileNameView}>
                <MyText type='medium' >{item?.member_info?.first_name + " " + item?.member_info?.last_name}</MyText>
              </View>
            </View> :
            <View style={__styles.profileView}>
              <UserImage image={undefined} name={item?.shipping_object?.name}
                backgroundTransparent size={35} />
              <View style={__styles.profileNameView}>
                <MyText type='medium' >{item?.shipping_object?.name}</MyText>
              </View>
            </View>}
        </>
        }
      <View>
        {/* <StatView title={"Program Amount"} value={prependCurency(item?.currency) + " " + item?.amount} /> */}
        {/* <StatView title={"Transaction"} value={`Sale Page (${item?.sale_page?.sale_page_title} | ${item?.plan?.plan_title} | ${item?.plan?.payment_access})`} /> */}
        {/* <StatView title={"Commission Amount"} value={prependCurency(item?.currency) + " " + item?.referral_commission} /> */}
        {/* <StatView title={"Transaction Mode"} value={item?.transaction_mode} /> */}
        <StatView title={"Transaction Date"} value={isCredit ? convertTimezone(item?.transaction_date, timezone).format(dateTimeFormat.date) : item?.transaction_date} uppercase />
        {isCredit ?
          <StatView title={"Credit"} value={prependCurency(item?.currency) + " " + Number(item?.referral_commission)?.toFixed(2)} /> :
          <StatView title={"Paid"} value={prependCurency(item?.currency) + " " + Number(item?.amount).toFixed(2)} />}
      </View>
    </View>
  )
}

export default TransactionView




const __styles = StyleSheet.create({
  itemRootView: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  profileView: {
    flexDirection: "row",
    alignItems: "center"
  },
  profileNameView: {
    flex: 1,
    marginLeft: 10
  }
})