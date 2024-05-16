import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import UserImage from '../../../components/UserImage'
import { icons } from '../../../utilities/icons'
import copyText from '../../../functions/copyText'
import { websiteBaseUrl } from '../../../utilities/constants'
import openUrl from '../../../functions/openUrl'

const Leaderboard = ({ monthlyCounts, weeklyCounts, pages, isCosmos, user, affiliateMember }) => {
  console.log(user, "user")
  const userCountsView = (item, index) => {
    return (
      <View style={__styles.countRootView}>
        <UserImage
          image={item?.image?.thumbnail_1}
          name={item?.first_name}
          size={40}
        />
        <View style={__styles.nameView}>
          <MyText type='medium'>{item?.first_name + " " + item?.last_name}</MyText>
        </View>
        <View style={__styles.countView}>
          <MyText color={colors.primary2} type='bold' fontSize={16}>{!!item?.monthly_count ? item?.monthly_count : item?.weekly_count}</MyText>
        </View>
      </View>)
  }

  const pagesView = (item, index) => {
    return (
      <View style={__styles.countRootView}>
        <View style={{ flex: 1 }}>
          <MyText fontSize={16} >{item?.sale_page_title}</MyText>
        </View>
        <TouchableOpacity
          onPress={() => openUrl(websiteBaseUrl + item?.sale_page_title_slug + "/" + affiliateMember?.affiliate_url_name)}
          style={__styles.btn}>
          {icons.goto(colors.primary, 20)}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => copyText(websiteBaseUrl + item?.sale_page_title_slug + "/" + affiliateMember?.affiliate_url_name, "Preview Url copied to clipboard")}
          style={__styles.btn}>
          {icons.copyOulined(20, colors.primary)}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View>
      {isCosmos ?
        <>
          <View style={__styles.boxView}>
            <View style={__styles.headingView}>
              <MyText fontSize={18} type='medium' >{"Monthly New Leads Leaderboard"}</MyText>
              <View style={__styles.divider} />
            </View>
            <View>
              {monthlyCounts.map(userCountsView)}
            </View>
          </View>


          <View style={__styles.boxView}>
            <View style={__styles.headingView}>
              <MyText fontSize={18} type='medium' >{"Weekly New Leads Leaderboard"}</MyText>
              <View style={__styles.divider} />
            </View>
            <View>
              {weeklyCounts.map(userCountsView)}
            </View>
          </View>
        </> :
        <View style={__styles.boxView}>
          <View style={__styles.headingView}>
            <MyText fontSize={18} type='medium' >{"Links"}</MyText>
            <View style={__styles.divider} />
          </View>
          <View>
            {pages.map(pagesView)}
          </View>
        </View>
      }

    </View>
  )
}

export default Leaderboard;

const __styles = StyleSheet.create({
  boxView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
    marginHorizontal:10
    // paddingBottom:20
  },
  divider: {
    height: 0.5, width: "100%", backgroundColor: colors.white, marginTop: 20,
    marginBottom: 10
  },
  headingView: {
    // marginTop: 10
  },
  countRootView: { marginTop: 10, flexDirection: "row", alignItems: "center" },
  nameView: {
    flex: 1,
    marginHorizontal: 10
  },
  countView: {
    borderWidth: 2,
    borderColor: colors.white,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  btn: {
    padding: 5,

  }
})