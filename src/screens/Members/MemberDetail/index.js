import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableHighlight, Pressable, Image } from 'react-native'
import React, { useRef, useState } from 'react'
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
import LeadModal from '../Components/LeadModal'
import { selectUser } from '../../../redux/reducers/userSlice'
import LeadHistoryModal from '../Components/LeadHistoryModal'
import { IS_CHAT_EXIST } from '../../../DAL'
import routes from '../../../navigation/routes'
import moment from 'moment'
import numFormatter from '../../../DAL/numFormatter'
import NotesModal from '../Components/NotesModal'
import OptionModal from '../../../components/OptionModal'
import { optionList } from '../Components/list'
import { MenuButton } from '../../../components/MyButton'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'

const MemberDetail = ({ navigation, route }) => {
  const { type } = route?.params;
  const isAllMembers = type == "all-member";
  const isMembers = type == "member";
  const isNurture = type == "nurture";
  const leadModalRef = useRef();
  const hitoryModalRef = useRef();
  const notesModalRef = useRef();
  const timezone = useSelector(selectTimeZone)
  const { token, user } = useSelector(selectUser)
  const [member, setMember] = useState(route?.params?.member);
  const [showMorePages, setShowMorePages] = useState(false);
  const [showMorePrograms, setShowMorePrograms] = useState(false);
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false);
  const { navbar } = useSelector(selectNavbar);
  const [isChatAllowed] = useState(!!navbar.find(x => x.value == 'chat'));

  const onOptSelected = (opt) => {
    console.log(opt, "onOptSelected");
    setIsOptionModalVisible(false)
    if (opt?.key == "notes") {
      navigation.navigate(routes.memberNotesListing, {
        for: "members",
        memberId: member?._id,
        updateNotes: updateTheNotes
      })
    } else if (opt?.key == "subscription") {
      navigation.navigate(routes.memberSubscribersListing, {
        memberId: member?._id
      })
    } else if (opt?.key == "question-answer") {
      navigation.navigate(routes.memberQuestionListing, {
        memberId: member?._id,
        member: member
      })
    } else if (opt?.key == "profile") {
      navigation.navigate(routes.memberProfile, {
        memberId: member?._id
      })
    }
  }

  const updateTheNotes = (notes, memberId) => {
    route?.params?.updateNotes?.(notes, memberId);
    setMember({ ...member, personal_note: notes });
  }


  // ? funcvtions

  const updateLeadStatus = (leadStatus, icome, date) => {
    let lead = {

      background_color: leadStatus?.background_color,
      text_color: leadStatus?.text_color,
      title: leadStatus?.title,
      _id: leadStatus?._id

    }
    setMember({
      ...member,
      lead_status: lead,
      lead_status_history: [{
        income_value: icome,
        changed_date_time: date,
        lead_status: lead
      },
      ...member?.lead_status_history]
    })
  }

  const onChatScreen = async (memberId) => {
    let res = await IS_CHAT_EXIST({ token, navigation, memberId })
    if (res.code == 200) {
      if (res.is_chat_exist) {
        let member = res.chat.member.find(x => x._id != user?._id)
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: "",
          profileImage: !!member?.profile_image ? member?.profile_image : "",
          chatId: res?.chat?._id,
          canGoBack: true,
          resetCountToZero: () => { },
          refresh: () => { },
        })
      } else {
        let member = res.user_info;
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: !!member?.last_login_activity ? member?.last_login_activity : "",
          profileImage: !!member?.member ? member?.member : "",
          chatId: "",
          canGoBack: true,
          resetCountToZero: () => { },
          refresh: () => { },
        })
      }
    }
  }



  const onWhatsappChatScreen = (member, item) => {
    navigation.navigate(routes.whtasappChatMessageList, {
      memberId: member?._id,
      firstName: member?.first_name,
      lastName: member?.last_name,
      profileImage: member?.profile_image,
      showTemplate: member?.whatsapp_chat_status != 'accepted',
      chatId: item._id,
      resetCountToZero,
      refresh,
      makeChatAccepted
    })
  }

  // ? Views


  const topView = () => {
    return (
      <View style={__styles.memberRootView}>

        <View style={__styles.memberProfileView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={__styles.backButtton}>
            {icons.back(colors.primary, 25)}
          </TouchableOpacity>

          <Pressable
            onPress={() => onOptSelected({ key: "profile" })}
            style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <View>
              <UserImage
                image={member?.profile_image}
                name={member?.first_name}
                size={30} />
              <View style={[{ backgroundColor: member?.is_online ? colors.online : colors.primary2, }, __styles.memberStatusView]} />
            </View>

            <View style={__styles.memberProfileNameView}>
              <MyText fontSize={14} type='bold'>{member?.first_name + " " + member?.last_name}</MyText>
              {isAllMembers && <MyText fontSize={12} >{member?.email}</MyText>}
            </View>
          </Pressable>

          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => onChatScreen(member?._id)}>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>
          
          <MenuButton
            size={22}
            onPress={() => setIsOptionModalVisible(true)}
          />

        </View>
      </View>
    )
  }

  const wheelOfLifeStatus = () => {
    if (!!member?.is_wheel_of_life) {
      return (
        <View style={__styles.noteView}>
          <Image source={icons.wheelOfLife} style={{ height: "100%", width: "100%" }} />
        </View>
      )
    }
  }

  const leadStatusView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableHighlight
          style={{ flex: 1 }}
          onPress={() => leadModalRef?.current?.openModal()}>
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
        {!!member?.lead_status > 0 &&
          <TouchableOpacity
            onPress={() => hitoryModalRef?.current?.openModal()}
            style={__styles.historyBtn}>
            {icons.history(colors.primary, 15)}
          </TouchableOpacity>}
      </View>
    )
  }

  const noteView = () => {
    return (
      <Pressable
        disabled={member?.personal_note.length == 0}
        onPress={() => notesModalRef?.current?.openModal([...member?.personal_note].reverse())}
        style={__styles.noteView}>
        <MyText color={colors.black} fontSize={14} >{member?.personal_note.length}</MyText>
      </Pressable>
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
      <View style={[__styles.statusView, { backgroundColor: !!member?.goal_statement_status ? colors.online : colors.heart }]}>
        <MyText color={colors.white} fontSize={14} >{!!member?.goal_statement_status ? "Unlocked" : "Locked"}</MyText>
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
        <StatView title={"Coins"} value={numFormatter(member?.coins_count)} uppercase />
        {isAllMembers && <StatView title={"Reffered User"} value={!!member?.affliliate ?
          member?.affliliate?.affiliate_user_info?.first_name + " " + member?.affliliate?.affiliate_user_info?.last_name + " (" + member?.affliliate?.affiliate_url_name + ") " : "Master Link"} />}
        {!isNurture && <StatView title={"Nurture"} value={!!member?.nurture ? member?.nurture?.first_name + " " + member?.nurture?.last_name : "N/A"} />}
        {!isMembers && <StatView title={"Delegate"} value={!!member?.consultant ? member?.consultant?.first_name + " " + member?.consultant?.last_name : "N/A"} />}
        <StatView title={"Community Level"} value={member?.community_level} uppercase={member?.community_level == 'pta'} />
        <StatView title={"Wheel of life"} view={wheelOfLifeStatus} />
        <StatView title={"Last Login Activity"} uppercase value={convertTimezone(member?.last_login_activity, timezone).format(dateTimeFormat.dateTime)} />
        <StatView title={"Phone Number"} value={member?.contact_number} />
        <StatView title={"Lead Status"} view={leadStatusView} />
        {isMembers && <StatView title={"Wheel of Life Completed Date"} value={!!member?.wheel_of_life_completed_date ? moment(member?.wheel_of_life_completed_date).format(dateTimeFormat.date) : "N/A"} />}
        <StatView title={"Client Note"} view={noteView} />
        <StatView title={"Pages"} view={pagesView} />
        {isAllMembers &&
          <>
            <StatView title={"Programmes"} view={ProgrammsView} />
            <StatView title={"Wheel of Life Enable"} value={member?.is_wheel_of_life_enable ? "YES" : "No"} />
            <StatView title={"Daily Intention Coins"} value={numFormatter(member?.dynamite_diary_coins_count, 1)} uppercase />
            <StatView title={"Gratitude Coins"} value={numFormatter(member?.dynamite_gratitude_coins_count, 1)} uppercase />
            <StatView title={"Assessment Coins"} value={numFormatter(member?.attitude_assessment_coins_count, 1)} uppercase />
            <StatView title={"Meditation Coins"} value={numFormatter(member?.meditation_coins_count, 1)} uppercase />
            <StatView title={"Goal Statement"} value={!!member?.goal_statement_completed_status ? `completed (${moment(member.goal_statement_completed_date).format(dateTimeFormat.date)})` : "Incomplete"} />
          </>}
        <StatView title={"Membership Expire"} value={!!member?.membership_purchase_expiry ?
          isAllMembers ? member?.membership_purchase_expiry :
            moment(new Date(member?.membership_purchase_expiry)).tz(timezone.admin).format(dateTimeFormat.date)
          : "N/A"} />
        <StatView title={isAllMembers ? "Created At" : "Registration Date"} value={moment(member?.createdAt).format(dateTimeFormat.date)} />
        <StatView title={"Status"} view={statusView} />
        {isAllMembers && <StatView title={"Goal"} view={goalView} />}

      </View>
    )
  }



  return (
    <RootView hideSubHeader >
      {topView()}
      <ScrollView
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 30, paddingHorizontal: 5 }}
        indicatorStyle='white'>
        {memberStatView()}
      </ScrollView>

      <LeadModal
        ref={leadModalRef}
        navigation={navigation}
        token={token}
        updateLeadStatus={updateLeadStatus}
        memberId={member?._id}
        oldLead={member?.lead_status}
      />

      <LeadHistoryModal
        ref={hitoryModalRef}
        memberId={member?._id}
        navigation={navigation}
        token={token}
      />

      <OptionModal
        closeModal={() => setIsOptionModalVisible(false)}
        isVisible={isOptionModalVisible}
        onSelected={onOptSelected}
        optionList={optionList}
      />
      <NotesModal
        memberId={member?._id}
        navigation={navigation}
        ref={notesModalRef}
        updateNotes={updateTheNotes}
      />
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
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    alignSelf: "flex-start"
  },
  historyBtn: {
    width: 30,
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