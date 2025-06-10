import { View, Text, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyInputs from '../../../components/MyInputs'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import { ADD_CALENDAR_GROUP, GET_MEMBERS_AND_PROGRAMMES_LIST_FOR_CALENDAR_GROUP, GET_MEMBER_LIST_FOR_PAYMENT_REQUEST, GET_PROGRAMMES_EVENTS_SALEPAGES_LIST_FOR_CALENDAR_GROUP, UPDATE_CALENDAR_GROUP } from '../../../DAL'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import MyChip from '../../../components/MyChip'
import showToast from '../../../functions/showToast'
import MyLoader from '../../../components/MyLoader'
import { selectSettings } from '../../../redux/reducers/settingSlice'
import OptionModal from '../../../components/OptionModal'
import { communityLevelObj } from '../../../utilities/constants'
import breakReference from '../../../functions/breakReference'
import isArray from '../../../functions/isArray'
import capitalize from '../../../functions/capitalize'
import { icons } from '../../../utilities/icons'
import { main } from '../../../utilities/styles'
import InfoModal from '../../../components/InfoModal'

const GroupAddEdit = ({ navigation, route }) => {
  const ref_info = useRef();
  const { group, ammendList } = route?.params;
  const isEdit = !!group;
  const { token, access } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [programmeList, setProgrammeList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [salePageList, setSalePageList] = useState([]);
  const [paymentPlanList, setPaymentPlanList] = useState([]);
  const [missionList, setMissionList] = useState([]);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    type: "",
  })
  const [communityLevelModal, setCommunityLevelModal] = useState({ isVisible: false, type: "" });
  const [memberModal, setMemberModal] = useState(false);
  const [isGrpModalVisible, setGrpModalVisible] = useState(false);
  const [includeMemberModal, setIncludeMemberModal] = useState(false)
  const [groupData, updateGroupData] = useState({
    title: !!group?.title ? group?.title : "",
    status: isEdit && !!group?.status == false ? false : true,
    groupBy: !!group?.group_by ? group?.group_by : "program",
    program: !!group?.program ? group?.program.map(x => x?._id) : [],
    event: !!group?.event ? group?.event.map(x => x?._id) : [],
    sale_page: !!group?.sale_pages ? group?.sale_pages.map(x => x?._id) : [],
    mission: !!group?.missions ? group?.missions.map(x => x) : [],
    plans: !!group?.plans ? group?.plans.map(x => x?._id) : [],
    member: !!group?.member ? group?.member.map(x => x?._id) : [],
    exclude_members: !!group?.exclude_members ? group?.exclude_members.map(x => x?._id) : [],
    memberType: !!group?.group_for_member ? group?.group_for_member : memberTypeList[0]?.value,
    communityLevel: !!group?.badge_levels ? group?.badge_levels : [],
    grpBadgeLevels: !!group?.group_badge_levels ? group?.group_badge_levels : [],
    include: !!group?.include_users ? group?.include_users : "active",
  })
  const setGroupData = (update) => updateGroupData({ ...groupData, ...update });

  const closeModal = () => setOptionModal({
    isVisible: false,
    type: "",
  })

  const findSalePage = (pageId) => {
    if (pageId) {
      let salePage = groupData.sale_page.find(x => x?._id == pageId);
      if (salePage) {
        return ` | ${salePage?.sale_page_title} | ${salePage?.type_of_page == "clickfunnel_page" ? "Click Funnel" : "Moon"}`;
      } else {
        return ""
      }
    } else {
      return ""
    }
  }

  useEffect(() => {
    getProgrammsListFromServer()

  }, [groupData?.groupBy])


  useEffect(() => {
    if (groupData?.groupBy == "sale_page" && groupData?.sale_page.length > 0) {
      getProgrammsListFromServer("", "plan")
    }
  }, [groupData?.sale_page])


  useEffect(() => {
    getMemberListFromServer()
  }, [groupData?.memberType])

  //! APIs

  const getProgrammsListFromServer = async (searchText = "", type = groupData?.groupBy) => {
    let res = await GET_PROGRAMMES_EVENTS_SALEPAGES_LIST_FOR_CALENDAR_GROUP({
      navigation, token,
      search: searchText,
      type: type,
      sale_page: type == "plan" ? groupData?.sale_page.map(x => x._id) : undefined
    });
    if (res.code == 200) {
      if (type == "program") {
        setProgrammeList(res?.data);
      } else if (type == "event") {
        setEventsList(res?.data);
      } else if (type == "sale_page") {
        setSalePageList(res?.data);
      } else if (type == "plan") {
        setPaymentPlanList(res?.data);
      } else if (type == "mission") {
        setMissionList(res?.data)
      }
    }
  }


  const getMemberListFromServer = async (searchText = "") => {
    let res = await GET_MEMBER_LIST_FOR_PAYMENT_REQUEST({ navigation, token, searchText: searchText.trim(), memberType: groupData?.memberType });
    if (res.code == 200) {
      setMemberList(res?.members)
    }
  }


  const addGroupToServer = async (body) => {
    let res = await ADD_CALENDAR_GROUP({ navigation, token, body });
    setLoader(false)
    if (res.code == 200) {
      showToast({ title: res.message, type: "success" })
      ammendList(res?.group)
      navigation.goBack()
    }
  }

  const updateGroupToServer = async (body) => {
    let res = await UPDATE_CALENDAR_GROUP({ navigation, token, body, slug: group?.group_slug });
    setLoader(false)
    if (res.code == 200) {
      showToast({ title: res.message, type: "success" })
      ammendList(res?.group)
      navigation.goBack()
    }
  }


  ///todo ....... Submit

  const onSubmit = () => {
    if (groupData.title.trim() == "") {
      showToast({ title: "Alert", body: "Please enter group name", type: "info" })
    } else {
      setLoader(true)
      let obj = {
        group_by: groupData.groupBy,
        title: groupData.title.trim(),
        status: groupData.status,
        member: groupData.member.map(member => ({ member_id: member?._id })),
        exclude_members: groupData.exclude_members.map(member => member?._id),
        badge_levels: groupData?.communityLevel,
        group_for_member: groupData?.memberType,
      };
      if (obj.group_by == "program") {
        obj["program"] = groupData.program.map(item => {
          if (!!item.program_slug) {
            return ({ program_slug: item.program_slug })
          } else {
            let slug = programmeList.find(x => x._id == item._id)?.program_slug;
            return ({ program_slug: slug })
          }
        })
        obj["include_users"] = groupData?.include
      } else if (obj.group_by == "event") {
        obj["event"] = groupData.event.map(item => ({ event_slug: item?.event_slug }))
        obj["include_users"] = groupData?.include
      } else if (obj.group_by == "sale_page") {
        obj["sale_page"] = groupData.sale_page.map(item => ({ _id: item?._id }))
        obj["plans"] = groupData.plans.map(item => ({ _id: item?._id }))
      } else if (obj.group_by == "mission") {
        obj["missions"] = groupData.mission.map(item => ({
          _id: item?._id,
          title: item?.title,
        }))
      } else if (obj.group_by == "badge_level") {
        obj["group_badge_levels"] = groupData.grpBadgeLevels.map(item => ({
          _id: item?._id,
          title: item?.title,
          is_access: item?.is_access
        }))
        obj["include_users"] = groupData?.include
      }
      // console.log(obj,"obj")
      // return

      if (isEdit) {
        updateGroupToServer(obj)
      } else {
        addGroupToServer(obj)
      }
    }
  }

  //Todo /// optoion functions

  const selectInfo = (type) => {
    let info = type === "program"
      ? `
          <h4>Active Members</h4>
          <p>Includes users who have access to a programme and it has not yet expired.</p>
          <h4/><h4/>
          <h4>All Members</h4>
          <p>Includes users in a programme, regardless of whether it has expired or not.</p>
        `
      : type === "event"
        ? `
          <h4>Active Members</h4>
          <p>Includes users who have access to an event and it has not yet expired.</p>
          <h4/><h4/>
          <h4>All Members</h4>
          <p>Includes users in an event, regardless of whether it has expired or not.</p>
        `
        : `
          <h4>Active Members</h4>
          <p>Includes users with an active membership in a badge level.</p>
          <h4/><h4/>
          <h4>All Members</h4>
          <p>Include users in a badge level with both active and expired memberships.</p>`

    ref_info?.current?.openModal(info, undefined, true)
  }

  const onSelected = (item) => {
    let { type } = optionModal;
    closeModal();
    let sEvents = groupData[type];
    if (!sEvents.some(x => x._id == item?._id)) {
      sEvents.push(item);
      setGroupData({ [type]: [...sEvents] });
    }

  }

  const filterTheList = (list, text) => {
    let nList = list.slice().filter(y => {
      if (!groupData[optionModal?.type].find(x => x?._id == y?._id)) return true
      else return false
    });
    if (optionModal?.type == "member" || text.trim() == "") {

    } else if (optionModal?.type == "event" || optionModal?.type == "program") {
      let stext = text.trim().toLowerCase();

      nList = list.slice().filter(x => x.title.toLowerCase().includes(stext))
    } else {
      nList = list
    }
    return nList
  }

  const removeItem = (index, type) => {
    groupData[type].splice(index, 1);
    setGroupData({ [type]: [...groupData[type]] })
  }


  const selectedView = (list, type, variable = "title") => {
    return (
      <View style={__styles.chipsLisView}>
        {list.map((item, index) => {
          let subTitle = ""
          if (type == "sale_page") {
            subTitle = item?.type_of_page == "clickfunnel_page" ? " | Click Funnel" : " | Moon"
          } else if (type == "mission" && item?.type) {
            subTitle = " | " + capitalize(item?.type).trim()
          }
          return (
            <MyChip
              title={item[variable] + subTitle}
              onPress={() => removeItem(index, type)}
            />)
        })}
      </View>
    )
  }

  const selectedPlanView = (list, type, variable = "title") => {
    return (
      <View style={__styles.chipsLisView}>
        {list.map((item, index) => {
          return (
            <MyChip
              title={item[variable] + findSalePage(item?.sale_page)}
              onPress={() => removeItem(index, type)}
            />)
        })}
      </View>
    )
  }



  const selectedMemberView = (list, type, variable) => {
    return (
      <View pointerEvents="auto" style={__styles.chipsLisView}>
        {list.map((item, index) =>
          <MyChip
            key={index}
            title={!!variable ? item[variable] : `${item?.first_name} ${item?.last_name} (${item?.email})`}
            onPress={() => removeItem(index, type)}
          />
        )}
      </View>
    )
  }





  return (
    <RootView title={isEdit ? "Edit Group" : "Add Group"}>
      <MyKeyboardAvoidingView>
        <MyInputs
          label='Group Name*'
          onChangeText={(text) => setGroupData({ title: text })}
          value={groupData?.title}
        />

        <View style={__styles.radioRootView}>
          <MyText isLabel>Group Status *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Active'
                onPress={() => setGroupData({ status: true })}
                value={groupData?.status}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Inactive'
                onPress={() => setGroupData({ status: false })}
                value={!groupData?.status}
              />
            </View>
          </View>
        </View>

        <MyTouchableInput
          label='Group By *'
          value={grpByTypeList[groupData?.groupBy]?.title || grpByTypeList.mission_quest?.title || ""}
          onPress={() => setGrpModalVisible(true)}
        // iconOnPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
        // view={() => selectedView(groupData?.program, "program")}
        />


        {(groupData.groupBy == "program" || groupData.groupBy == "event" || groupData.groupBy == "badge_level") &&
          <MyTouchableInput
            subTextView={() => (
              <TouchableOpacity
                onPress={() => selectInfo(groupData.groupBy)}
                hitSlop={main.hitSlop}
                style={{ marginBottom: 5 }} >
                {icons.info_filled(colors.primary, 17)}
              </TouchableOpacity>
            )}
            label={`Include users of these ${grpByTypeList[groupData?.groupBy]?.title} *`}
            value={includeMembersObj[groupData?.include]?.title || ""}
            onPress={() => setIncludeMemberModal(true)}
          />}

        {/* <View style={__styles.radioRootView}>
          <MyText isLabel>Group By *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Programmme'
                onPress={() => setGroupData({ groupBy: "program" })}
                value={groupData?.groupBy == "program"}

              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Event'
                onPress={() => setGroupData({ groupBy: "event" })}
                value={groupData?.groupBy == "event"}
              />
            </View>            
          </View>
          

          
        </View> */}

        {access?.allow_mission_control_group_members_option &&
          <MyTouchableInput
            onPress={() => setMemberModal(true)}
            label='Include Members *'
            value={memberType[groupData?.memberType]}

          />}

        {access?.allow_community_level_in_group && groupData.groupBy != "badge_level" &&
          <MyTouchableInput
            iconOnPress={() => setCommunityLevelModal({ isVisible: true, type: "overall" })}
            label='Badge Level'
            view={() => selectedMemberView(groupData?.communityLevel, "communityLevel", "title")}
          // value={!!groupData?.communityLevel ? communityLevelObj[groupData?.communityLevel] : ""}
          />}

        {groupData.groupBy == "program" ?
          <MyTouchableInput
            label='Programmes'
            iconOnPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
            view={() => selectedView(groupData?.program, "program")}
          /> : groupData.groupBy == "event" ?
            <MyTouchableInput
              label='Event'
              view={() => selectedView(groupData?.event, "event")}
              iconOnPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
            /> : groupData.groupBy == "sale_page" ?
              <MyTouchableInput
                label='Sale Pages'
                view={() => selectedView(groupData?.sale_page, "sale_page", "sale_page_title")}
                iconOnPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
              /> : groupData.groupBy == "mission" ?
                <MyTouchableInput
                  label='Mission | Quest'
                  view={() => selectedView(groupData?.mission, "mission", "title")}
                  iconOnPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
                /> : groupData.groupBy == "badge_level" ?
                  <MyTouchableInput
                    label='Badge Levels'
                    view={() => selectedMemberView(groupData?.grpBadgeLevels, "grpBadgeLevels", "title")}
                    iconOnPress={() => setCommunityLevelModal({ isVisible: true, type: "grp_type" })}
                  /> : null}

        {groupData.groupBy == "sale_page" && groupData?.sale_page.length > 0 &&
          <MyTouchableInput
            label='Payment Plans'
            view={() => selectedPlanView(groupData?.plans, "plans", "plan_title")}
            iconOnPress={() => setOptionModal({ type: "plans", isVisible: true, })}
          />}

        <MyTouchableInput
          view={() => selectedMemberView(groupData?.member, "member")}
          label='Members'
          iconOnPress={() => setOptionModal({ isVisible: true, type: "member" })}
        />

        <MyTouchableInput
          view={() => selectedMemberView(groupData?.exclude_members, "exclude_members")}
          label='Exclude Members'
          iconOnPress={() => setOptionModal({ isVisible: true, type: "exclude_members" })}
        />


        <View style={{ marginTop: 10 }}>
          <MyButton title='Submit' onPress={onSubmit} />
        </View>
      </MyKeyboardAvoidingView>

      <OptionModalWithSearch
        isVisible={optionModal.isVisible}
        closeModal={closeModal}
        onSelected={onSelected}
        noIcon
        // filterTheList={filterTheList}
        onSearchTextChange={(text) => {
          if (optionModal?.type == "member" || optionModal?.type == "exclude_members") {
            getMemberListFromServer(text.trim())
          } else {
            getProgrammsListFromServer(text.trim(), optionModal?.type == "plans" ? "plan" : optionModal?.type)
          }
        }}
        optionList={
          optionModal?.type == "program" ? programmeList :
            optionModal?.type == "event" ? eventsList :
              optionModal?.type == "sale_page" ? salePageList :
                optionModal?.type == "plans" ? paymentPlanList :
                  optionModal?.type == "member" || optionModal?.type == "exclude_members" ? memberList :
                    optionModal?.type == "mission" ? missionList :
                      []
        }
        title={
          optionModal?.type == "program" ? "Programme" :
            optionModal?.type == "event" ? "Event" :
              optionModal?.type == "sale_page" ? "Sale Page" :
                optionModal?.type == "plans" ? "Plan" :
                  optionModal?.type == "member" || optionModal?.type == "exclude_members" ? "Member" :
                    optionModal?.type == "mission" ? "Missions and Quests" :
                      ""
        }
        renderText={({ item }) => (
          <MyText>
            {(optionModal?.type == "program" || optionModal?.type == "event") ? `${item?.title} ` :
              optionModal?.type == "sale_page" ? `${item?.sale_page_title} | ${item?.type_of_page == "clickfunnel_page" ? "Click Funnel" : "Moon"} ` :
                optionModal?.type == "plans" ? `${item?.plan_title}${findSalePage(item?.sale_page)} ` :
                  optionModal?.type == "member" || optionModal?.type == "exclude_members" ? `${item?.first_name} ${item?.last_name} (${item?.email})` :
                    optionModal?.type == "mission" ? item?.title + " |" + capitalize(item?.type) : ""}
          </MyText>
        )}
      />

      {/* Include member modal */}


      <OptionModal
        noIcon
        isVisible={memberModal}
        closeModal={() => setMemberModal(false)}
        optionList={memberTypeList}
        onSelected={(item) => {
          setMemberModal(false);
          setGroupData({ ...groupData, memberType: item?.value })
        }}
        checkSelected={(item) => item?.value == groupData?.memberType}
      />

      {/* Group By level modal */}

      <OptionModal
        noIcon
        isVisible={isGrpModalVisible}
        closeModal={() => setGrpModalVisible(false)}
        optionList={Object.values(grpByTypeList)}
        onSelected={(item) => {
          setGrpModalVisible(false)
          setGroupData({ ...groupData, groupBy: item?.value })
        }}
        checkSelected={(item) => item?.value == groupData?.groupBy}
      />

      {/* Community level modal */}
      <OptionModal
        multiple
        onSelected={(item) => {
          let arr = [];
          if (communityLevelModal?.type == "overall") {
            arr = breakReference(groupData?.communityLevel);
          } else if (communityLevelModal?.type == "grp_type") {
            arr = breakReference(groupData?.grpBadgeLevels);
          }


          let index = arr?.findIndex(x => x?._id == item?._id);
          if (index > -1) {
            arr.splice(index, 1);
          } else {
            arr.push(item)
          }


          if (communityLevelModal?.type == "overall") {
            setGroupData({ ...groupData, communityLevel: arr })
          } else {
            setGroupData({ ...groupData, grpBadgeLevels: arr })
          }
        }}
        checkSelected={(item) => {
          if (communityLevelModal?.type == "overall") {
            return groupData?.communityLevel.some(x => x?._id == item?._id)
          } else if (communityLevelModal?.type == "grp_type") {
            return groupData?.grpBadgeLevels.some(x => x?._id == item?._id)
          }

        }}
        noIcon
        isVisible={communityLevelModal?.isVisible}
        closeModal={() => setCommunityLevelModal({ isVisible: false, type: "" })}
        optionList={isArray(access?.badge_levels) ? access?.badge_levels.slice().filter(x => x?.is_access) : []}
      />

      <OptionModal
        noIcon
        isVisible={includeMemberModal}
        closeModal={() => setIncludeMemberModal(false)}
        optionList={Object.values(includeMembersObj)}
        onSelected={(item) => {
          setIncludeMemberModal(false)
          setGroupData({ ...groupData, include: item?.value })
        }}
        checkSelected={(item) => item?.value == groupData?.include}
      />

      <InfoModal ref={ref_info} />


      <MyLoader enable={loader} />
    </RootView>
  )
}

export default GroupAddEdit

const memberType = {
  nurtured_and_delegated: "Nurture & Delegated",
  all: "All"
}
const memberTypeList = [
  {
    title: "Nurture & Delegated",
    value: "nurtured_and_delegated"
  },
  {
    title: "All",
    value: "all"
  },
]

const includeMembersArr = [
  {
    title: "Active Members",
    value: "active"
  },
  {
    title: "All Members",
    value: "all"
  },
]

const includeMembersObj = {
  "active": {
    title: "Active Members",
    value: "active"
  },
  "all": {
    title: "All Members",
    value: "all"
  },
}

const grpByTypeList = {
  "program": {
    title: "Programmme",
    value: "program"
  },
  "event": {
    title: "Event",
    value: "event"
  },
  "sale_page": {
    title: "Sale Page",
    value: "sale_page"
  },
  "mission_quest": {
    title: "Missions | Quests",
    value: "mission"
  },
  "badge_level": {
    title: "Badge Level",
    value: "badge_level"
  }
}




const __styles = StyleSheet.create({
  radioRootView: {
    marginBottom: 15
  },
  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },
  chipsLisView: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 5
  }
})
