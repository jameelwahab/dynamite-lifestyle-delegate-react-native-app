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


const TransactionView = ({ item, index,timezone }) => {


  return (
    <View style={__styles.itemRootView}>
      <View style={__styles.profileView}>
        <UserImage image={item?.member_info?.profile_image} name={item?.member_info?.first_name}
          backgroundTransparent size={35} />
        <View style={__styles.profileNameView}>
          <MyText type='medium' >{item?.member_info?.first_name + " " + item?.member_info?.last_name}</MyText>

          <View style={{ backgroundColor: item?.transaction_status == "succeeded" ? colors.green : undefined, alignSelf: "flex-start", borderRadius: 10, paddingHorizontal: 5, paddingVertical: 2, marginTop: 1 }}>
            <MyText capitalize type='medium' color={item?.transaction_status == "succeeded" ? colors.white : colors.transparent} fontSize={10} >succeeded</MyText>
          </View>
        </View>
      </View>
      <View>
        <StatView title={"Program Amount"} value={prependCurency(item?.currency) + " " + item?.amount} />
        <StatView title={"Transaction"} value={`Sale Page (${item?.sale_page?.sale_page_title} | ${item?.plan?.plan_title} | ${item?.plan?.payment_access})`} />
        <StatView title={"Commission Amount"} value={prependCurency(item?.currency) + " " + item?.referral_commission} />
        <StatView title={"Transaction Mode"} value={item?.transaction_mode} />
        <StatView title={"Agreement PDF"} value={<PdfLinkView link={item?.agrement_pdf_url} />} />
        <StatView title={"Date"} value={convertTimezone(item?.transaction_date, timezone).format(dateTimeFormat.date)} />
      </View>
    </View>
  )
}

export default TransactionView

const PdfLinkView = ({ link }) => {
  if (!!link) {
    return (
      <TouchableOpacity
        onPress={() => openUrl(S3_URL + link)}
        hitSlop={{ left: 5, top: 5, bottom: 5, right: 5 }}
        style={{ alignSelf: "flex-start", }}>
        <MyText color={colors.primary} >Preview</MyText>
      </TouchableOpacity>
    )
  } else return null
}



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