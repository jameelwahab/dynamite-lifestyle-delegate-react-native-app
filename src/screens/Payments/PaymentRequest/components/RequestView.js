import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import StatView from '../../../Members/Components/StatView'
import MyText from '../../../../components/MyText'
import UserImage from '../../../../components/UserImage'
import { colors } from '../../../../utilities/colors'
import prependCurency from '../../../../functions/prependCurency'
import { fonts } from '../../../../utilities/fonts'
import { MenuButton } from '../../../../components/MyButton'




const RequestView = ({ item, index ,openOptionModal}) => {
  return (
    <View style={__styles.itemRootView}>
      <View style={__styles.profileView}>
        <UserImage image={item?.member?.profile_image} name={item?.member?.first_name}
          backgroundTransparent size={35} />
        <View style={__styles.profileNameView}>
          <MyText type='medium' >{item?.member?.first_name + " " + item?.member?.last_name}</MyText>
        </View>
        <MenuButton
        onPress={()=>openOptionModal(item)}
          size={20} />
      </View>
      <View>
        <StatView title={"Request Title"} value={!!item?.request_title?item?.request_title:"N/A"} noFontTransform />
        <StatView title={"Product"} value={!!item?.product?.name?item?.product?.name:"N/A"} />
        <StatView title={"Payment Template"} value={!!item?.payment_template?.title?item?.payment_template?.title:"N/A"} noFontTransform />
        <StatView title={"Request Type"} value={item?.request_type} />
        <StatView title={"Total Amount"} value={prependCurency(item?.currency) + " " + item?.total_amount} />
        <StatView title={"Initial Amount"} value={prependCurency(item?.currency) + " " + item?.initial_amount} />
        <StatView title={"Installment Amount"} value={prependCurency(item?.currency) + " " + item?.installment_amount} />
        <StatView title={"Month"} value={item?.month} />
        <StatView title={"First Paid"} view={() => <PaidView value={item?.is_first_paid} text={item?.is_first_paid ? "PAID" : "PENDING"} />} />
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