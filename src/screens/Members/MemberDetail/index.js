import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableHighlight, Pressable } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import UserImage from '../../../components/UserImage'
import { icons } from '../../../utilities/icons'
import StatView from '../Components/StatView'
import { convertTimezone } from '../../../functions/convertTime'
import { dateTimeFormat } from '../../../utilities/constants'
import { useSelector } from 'react-redux'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'

const MemberDetail = ({ navigation, route }) => {
  const timezone = useSelector(selectTimeZone)
  const [member, setMember] = useState(route?.params?.member);
  const [showMorePages, setShowMorePages] = useState(false);
  const [showMorePrograms, setShowMorePrograms] = useState(false);

  console.log(member, "member")

  const topView = () => {
    return (
      <View style={__styles.memberRootView}>

        <View style={__styles.memberProfileView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={__styles.backButtton}>
            {icons.back(colors.primary, 25)}
          </TouchableOpacity>

          <View>
            <UserImage
              image={member?.profile_image}
              name={member?.first_name}
              size={30} />
            <View style={[{ backgroundColor: member?.is_online ? colors.online : colors.primary2, }, __styles.memberStatusView]} />
          </View>

          <View style={__styles.memberProfileNameView}>
            <MyText fontSize={14} type='bold'>{member?.first_name + " " + member?.last_name}</MyText>
            <MyText fontSize={12} >{member?.email}</MyText>
          </View>

          <TouchableOpacity>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const leadStatusView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableHighlight
          style={{ flex: 1 }}
          onPress={() => { }}>
          <View style={[__styles.leadRootView, !!member?.lead_status && {
            backgroundColor: member?.lead_status?.background_color
          }]}>
            <View style={__styles.leadStatusTextView}>
              <MyText
                color={!!member?.lead_status ? member?.lead_status?.text_color : colors.white}>
                {!!member?.lead_status ?
                  member?.lead_status?.title :
                  "Lead Status"}</MyText>
            </View>
            <View style={__styles.leadStatusIconView}>
              {icons.down(colors.primary, 15)}
            </View>
          </View>
        </TouchableHighlight>
        <TouchableOpacity style={__styles.historyBtn}>
          {icons.history(colors.primary, 20)}
        </TouchableOpacity>
      </View>
    )
  }

  const noteView = () => {
    return (
      <View style={__styles.noteView}>
        <MyText color={colors.black} fontSize={14} >{member?.personal_note.length}</MyText>
      </View>
    )
  }

  const statusView = () => {
    return (
      <View style={[__styles.statusView, { backgroundColor: member?.status ? colors.online : colors.heart }]}>
        <MyText color={colors.white} fontSize={14} >{!!member?.status ? "Active" : "Inactive"}</MyText>
      </View>
    )
  }

  const goalView = () => {
    return (
      <View style={[__styles.statusView, { backgroundColor: !!member?.goal_statement_status?.status ? colors.online : colors.heart }]}>
        <MyText color={colors.white} fontSize={14} >{!!member?.goal_statement_status?.status ? "Unlocked" : "Locked"}</MyText>
      </View>
    )
  }

  const pagesView = () => {
    return (
      <View >
        {member?.event_subscriber.length > 0 ?
          <>
            {member?.event_subscriber.map((x, i) => {
              if ((showMorePages == false && i < 2) || showMorePages) {
                return (
                  <MyText style={{ marginTop: 3 }} fontSize={12} type='medium' >{
                    x?.page_info?.sale_page_title + " | " + x?.plan_info?.plan_title
                  }</MyText>
                )
              }
            })}
            {member?.event_subscriber.length > 2 &&
              <MyText
                color={colors.primary}
                type='bold'
                onPress={() => setShowMorePages(!showMorePages)} >
                {showMorePages ? "Show Less" : "Show More"}
              </MyText>}
          </> :
          <MyText fontSize={12} type='medium' >{"N/A"}</MyText>
        }
      </View>
    )
  }

  const ProgrammsView = () => {
    return (
      <View >
        {member?.program.length > 0 ?
          <>
            {member?.program.map((x, i) => {
              if ((showMorePrograms == false && i < 2) || showMorePrograms) {
                return (
                  <MyText fontSize={12} type='medium' >{
                    x?._id?.title
                  }</MyText>
                )
              }
            })}
            {member?.program.length > 2 &&
              <MyText
                color={colors.primary}
                type='bold'
                onPress={() => setShowMorePrograms(!showMorePrograms)} >
                {showMorePrograms ? "Show Less" : "Show More"}
              </MyText>}
          </> :
          <MyText fontSize={12} type='medium' >{"N/A"}</MyText>
        }
      </View>
    )
  }

  const memberStatView = () => {
    return (
      <View>
        <StatView title={"Reffered User"} value={!!member?.affliliate ?
          member?.affliliate?.affiliate_user_info?.first_name + " " + member?.affliliate?.affiliate_user_info?.last_name + " (" + member?.affliliate?.affiliate_url_name + ") " : "Master Link"} />
        <StatView title={"Nurture"} value={!!member?.nurture ? member?.nurture?.first_name + " " + member?.nurture?.last_name : "N/A"} />
        <StatView title={"Delegate"} value={!!member?.consultant ? member?.consultant?.first_name + " " + member?.consultant?.last_name : "N/A"} />
        <StatView title={"Last Login Activity"} value={convertTimezone(member?.last_login_activity, timezone).format(dateTimeFormat.dateTime)} />
        <StatView title={"Phone Number"} value={member?.contact_number} />
        <StatView title={"Lead Status"} view={leadStatusView} />
        <StatView title={"Client Note"} view={noteView} />
        <StatView title={"Pages"} view={pagesView} />
        <StatView title={"Programmes"} view={ProgrammsView} />
        <StatView title={"Wheel of Life Enable"} value={!!member?.is_wheel_of_life ? "Yes" : "No"} />
        <StatView title={"Daily Intention Coins"} value={member?.dynamite_diary_coins_count} />
        <StatView title={"Gratitude Coins"} value={member?.dynamite_gratitude_coins_count} />
        <StatView title={"Assessment Coins"} value={member?.attitude_assessment_coins_count} />
        <StatView title={"Meditation Coins"} value={member?.meditation_coins_count} />
        <StatView title={"Goal Statement"} value={!!member?.goal_statement_completed_status ? "completed" : "Incomplete"} />
        <StatView title={"Created At"} value={!!member?.membership_purchase_expiry ? "member?.membership_purchase_expiry" : "N/A"} />
        <StatView title={"Membership Expire"} value={convertTimezone(member?.createdAt, timezone).format(dateTimeFormat.date)} />
        <StatView title={"Status"} view={statusView} />
        <StatView title={"Goal"} view={goalView} />

      </View>
    )
  }



  return (
    <RootView hideSubHeader >
      {topView()}
      <ScrollView
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 30 ,paddingHorizontal: 5}}
        indicatorStyle='white'>
        {memberStatView()}
      </ScrollView>
    </RootView>
  )
}

export default MemberDetail;


const __styles = StyleSheet.create({
  memberRootView: {
    // backgroundColor: colors.secondary,
    // marginTop: 10, borderRadius: 10, padding: 10
  },
  memberProfileView: { flexDirection: "row", alignItems: "center" },
  memberStatusView: { position: "absolute", bottom: 0, right: 0, height: 10, width: 10, borderRadius: 10 / 2, },
  memberProfileNameView: { flex: 1, marginLeft: 10 },
  backButtton: { height: 50, width: 30, justifyContent: "center" },
  noteView: {
    height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: colors.primary,
    alignItems: "center", justifyContent: "center"
  },
  statusView: {
    // paddingVertical: 5,
    // paddingHorizontal: 15,
    height: 25,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "flex-start"
  },
  historyBtn: {
    width: 40,
    paddingVertical: 5,
    alignItems: "center"
  },
  leadRootView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: colors.placeholder,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  leadStatusTextView: {
    flex: 1
  },
  leadStatusIconView: {

  }

})