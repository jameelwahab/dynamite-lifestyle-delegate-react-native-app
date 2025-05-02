import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import StatView from '../../../Members/Components/StatView'
import MyText from '../../../../components/MyText'
import UserImage from '../../../../components/UserImage'
import { colors } from '../../../../utilities/colors'
import prependCurency from '../../../../functions/prependCurency'
import { fonts } from '../../../../utilities/fonts'
import { MenuButton } from '../../../../components/MyButton'
import MemberView from '../../../../components/MemberView'
import moment from 'moment'
import { dateTimeFormat } from '../../../../utilities/constants'
import StatusView from "../../../../components/StatusView"




const RequestView = ({ item, index, openOptionModal, onDetail }) => {
  if(index==0){
    console.log(item,"item")
  }
  return (
    <View style={__styles.itemRootView}>
      <View style={__styles.profileView}>
        <Pressable
          onPress={() => onDetail(item?.payment_request_slug)}
          style={[__styles.profileView, { flex: 1, marginRight: 10 }]} >
          <MemberView member={item?.member} marginLeft={0} size={35} titleSize={14} />
        </Pressable>
        <MenuButton
          onPress={() => openOptionModal(item)}
          size={20} />
      </View>
      <View>
        <StatView title={"Request Title"} value={!!item?.request_title ? item?.request_title : "N/A"} noFontTransform />
        <StatView title={"Product"} value={!!item?.product?.name ? item?.product?.name : "N/A"} />
        <StatView title={"Payment Template"} value={!!item?.payment_template?.title ? item?.payment_template?.title : "N/A"} noFontTransform />
        <StatView title={"Request Type"} value={item?.request_type} />
        <StatView title={"Total Amount"} value={prependCurency(item?.currency) + " " + item?.total_amount} />
        <StatView title={"Initial Amount"} value={prependCurency(item?.currency) + " " + item?.initial_amount} />
        <StatView title={"Installment Amount"} value={prependCurency(item?.currency) + " " + item?.installment_amount} />
        <StatView title={"Month"} value={item?.month} />
        {!!item?.sale_page &&
          <StatView title={"Sale Page"} value={item?.sale_page?.sale_page_title} />
        }
        <StatView title={"Consider Purchasing User"} value={item?.consider_purchasing_user || "N/A"} />
        <StatView
          title={"Lead Status"}
          view={() => !!item?.payment_template?.lead_status ? <StatusView
            bgColor={item?.payment_template?.lead_status?.background_color}
            value={item?.payment_template?.lead_status?.title}
          /> :
            <MyText fontSize={12} type='medium' >N/A</MyText>} />
        <StatView title={"First Paid"} view={() => <PaidView value={item?.is_first_paid} text={item?.payment_status == "cancelled" ? `Cancelled on ${moment(item?.cancel_date).format(dateTimeFormat.date)}` : item?.is_first_paid ? `PAID on ${moment(item?.subscription_date).format(dateTimeFormat.date)} ` : item?.payment_status == "processing" ? "PROCESSING" : "PENDING"} />} />
        <StatView title={"Status"} view={() => <PaidView value={item?.status} text={item?.status ? "ACTIVE" : "INACTIVE"} />} />
      </View>
    </View>
  )
}

const PaidView = ({ value, text }) => {
  return (
    <View style={[__styles.statusView, { backgroundColor: value ? colors.green + "33" : colors.delete + "33", }]}>
      <MyText
        color={value ? colors.green : colors.delete}
        style={__styles.statusText} >{text}</MyText>
    </View>
  )
}

export default RequestView

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
  },
  statusView: {

    borderRadius: 10,
    alignSelf: "flex-start"
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 3
  }
})
