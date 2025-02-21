import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableHighlight, Pressable, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { colors } from '../../../utilities/colors'
import UserImage from '../../../components/UserImage'
import { icons } from '../../../utilities/icons'
import StatView from '../Components/StatView'
import { convertTimezone } from '../../../functions/convertTime'
import { communityLevelWithAllObj, dateTimeFormat } from '../../../utilities/constants'
import { useSelector } from 'react-redux'
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice'
import LeadModal from '../Components/LeadModal'
import { selectUser } from '../../../redux/reducers/userSlice'
import LeadHistoryModal from '../Components/LeadHistoryModal'
import { IS_CHAT_EXIST, UPDATE_CALL_FUNCTIONALITY } from '../../../DAL'
import routes from '../../../navigation/routes'
import moment from 'moment'
import numFormatter from '../../../functions/numFormatter'
import NotesModal from '../Components/NotesModal'
import OptionModal from '../../../components/OptionModal'
import { optionList } from '../Components/list'
import { MenuButton } from '../../../components/MyButton'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import MyCheckBox from '../../../components/MyCheckBox'
import CallHistoryNoteModal from '../Components/CallHistoryNoteModal'
import InfoModal from '../../../components/InfoModal'
import ConfirmationModal2 from '../../../components/ConfirmationModal2'
import OptionModal2 from '../../../components/OptionModal2'
import showToast from '../../../functions/showToast'
import breakReference from '../../../functions/breakReference'
import country from '../../../assets/data/countryList.json'

const MemberDetail = ({ navigation, route }) => {
  const { type } = route?.params;
  const { access } = useSelector(selectUser);
  const isAllMembers = type == "all-member";
  const isMembers = type == "member";
  const isNurture = type == "nurture";
  const ref_optionModal = useRef()
  const leadModalRef = useRef();
  const hitoryModalRef = useRef();
  const notesModalRef = useRef();
  const ref_info = useRef();
  const ref_callHistoryModal = useRef();
  const ref_confirmModal = useRef();
  const timezone = useSelector(selectTimeZone)
  const { token, user } = useSelector(selectUser)
  const [member, setMember] = useState(route?.params?.member);
  const [showMorePages, setShowMorePages] = useState(false);
  const [showMorePrograms, setShowMorePrograms] = useState(false);


  const updateCallAPI = async () => {

    let res = await UPDATE_CALL_FUNCTIONALITY({
      token, navigation, body: {
        is_call_allowed: !member?.is_call_allowed,
        member_id: member?._id,
      }
    });
    if (res?.code == 200) {
      showToast({ type: "success", title: res?.message });
      let data = breakReference(member);
      data["is_call_allowed"] = !data["is_call_allowed"]
      setMember(data)
      route?.params?.updateData?.(data)
    } else {

    }
  }


  const onOptSelected = (opt) => {
    if (opt?.key == "notes") {
      navigation.navigate(routes.memberNotesListing, {
        for: "members",
        memberId: member?._id,
        updateNotes: updateTheNotes
      })
    } else if (opt?.key == "subscription") {
      navigation.navigate(routes.memberSubscribersListing, {
        memberId: member?._id,
      })
    } else if(opt?.key == "manage-mission" ){
	  navigation.navigate(routes.memberManage,{
	    memberId: member?._id,
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
    } else if (opt?.key == "update_call") {
      ref_confirmModal?.current?.openModal({
        title: `Are you sure you want to ${member?.is_call_allowed ? "disable" : "enable"} call functionality for this user?`,
        agreeFunc: () => updateCallAPI()
      })
    }

  }

  const filterTheList = (list) => {
    return list.slice().filter(x => {
      if (x.key == "profile") {
        return access?.view_profile
      } else return true
    })
  }


  const updateTheNotes = (notes, memberId) => {
    route?.params?.updateNotes?.(notes, memberId);
    setMember({ ...member, personal_note: notes });
  }

  const updateCallNotes = (notes, memberId) => {
    route?.params?.updateCallNote?.(notes, memberId);
    setMember({ ...member, call_history: notes });
  }


  // ? funcvtions

  const updateLeadStatus = (leadStatus, icome, date) => {
    let lead = {
      background_color: leadStatus?.background_color,
      text_color: leadStatus?.text_color,
      title: leadStatus?.title,
      _id: leadStatus?._id

    }
    let obj = {
      ...member,
      lead_status: lead,
      lead_status_history: [{
        income_value: icome,
        changed_date_time: date,
        lead_status: lead
      },
      ...member?.lead_status_history]
    }
    setMember({ ...obj })
    route?.params?.updateData?.({ ...obj });
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
            onPress={() => {
              if (access?.view_profile) {
                onOptSelected({ key: "profile" })
              }
            }}
            style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
            <View>
              <UserImage
		borderWidth={1}
		borderColor={colors.delete}
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
	  <MyText style={{marginRight:10}}>
	    {country.find((el)=> el.code === member?.country).flag}
	  </MyText>
          <TouchableOpacity style={{ marginRight: 10 }} onPress={() => onChatScreen(member?._id)}>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>

          <MenuButton
            size={22}
            onPress={() => ref_optionModal?.current?.openModal()}
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
                  <MyText key={`event_subscriber${i}`}
                    style={{ marginTop: 3 }} fontSize={12} type='medium' >{
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
                  <MyText key={`program${i}`} fontSize={12} type='medium' >{
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

  const contactNumberView = (phone, isChecked, isAllowed) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: "center" }}>
        <View style={{ marginRight: 10 }}>
          <MyText type='medium' fontSize={12}>{phone}</MyText>
        </View>
        {isAllowed ?
          <MyCheckBox
            pb={0}
            value={isChecked}
            onPress={() => {
              if (isChecked) {
                let str = member?.call_history?.notes;
                let str2 = moment(member?.call_history?.date).format(dateTimeFormat.date)

                ref_info?.current?.openModal(str, str2, true)
              } else {
                ref_callHistoryModal?.current?.openModal()
              }
            }}
          /> :
          icons.crosss(colors.delete)
        }

      </View>)
  }

  const appDownloadedView = (value) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: "center", }}>
        <View style={{ marginRight: 5 }}>
          {value ? icons.appDownloadedEmoji(25) : icons.appNotDownloadedEmoji(25)}
        </View>
        <MyText fontSize={12} type='medium'>{value ? "Yes" : "No"}</MyText>
      </View>)
  }


  const memberStatView = () => {
    return (
      <View>
        <StatView title={"Coins"} value={numFormatter(member?.coins_count)} uppercase />
        <StatView title={"App Downloaded"} view={() => appDownloadedView(member?.downloaded_app)} uppercase />
        {isAllMembers && <StatView title={"Reffered User"} value={!!member?.affliliate?.affiliate_user_info ?
          member?.affliliate?.affiliate_user_info?.first_name + " " + member?.affliliate?.affiliate_user_info?.last_name + " (" + member?.affliliate?.affiliate_url_name + ") " : "Master Link"} />}
        {!isNurture && access?.Show_nurture_in_filter && <StatView title={"Nurture"} value={!!member?.nurture ? member?.nurture?.first_name + " " + member?.nurture?.last_name : "N/A"} />}
        {!isMembers && <StatView title={"Delegate"} value={!!member?.consultant ? member?.consultant?.first_name + " " + member?.consultant?.last_name : "N/A"} />}
        <StatView
	    title={"Badge Level"}
	    icon_img={member?.membership_level_badge_info?.membership_level_badge_icon?.thumbnail_1}
	    value={member?.membership_level_badge_info?.membership_level_badge_title} noFontTransform />
        <StatView title={"Wheel of life"} view={wheelOfLifeStatus} />
        <StatView title={"Last Login Activity"} uppercase value={convertTimezone(member?.last_login_activity, timezone).format(dateTimeFormat.dateTime)} />
        <StatView title={"Phone Number"} view={() => contactNumberView(member?.contact_number, !!member?.call_history?.is_checked, member?.is_call_allowed)} />
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
        showsVerticalScrollIndicator={false}
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

      <OptionModal2
        ref={ref_optionModal}
        onSelected={onOptSelected}
        optionList={filterTheList(optionList)}
      />
      <NotesModal
        memberId={member?._id}
        navigation={navigation}
        ref={notesModalRef}
        updateNotes={updateTheNotes}
      />

      <CallHistoryNoteModal
        ref={ref_callHistoryModal}
        memberId={member?._id}
        updateCallNotes={updateCallNotes}
      />


      <ConfirmationModal2 ref={ref_confirmModal} />

      <InfoModal ref={ref_info} />
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
