import { View, Text, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyInputs from '../../../components/MyInputs'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import { ADD_CALENDAR_GROUP, GET_MEMBERS_AND_PROGRAMMES_LIST_FOR_CALENDAR_GROUP, GET_MEMBER_LIST_FOR_PAYMENT_REQUEST, UPDATE_CALENDAR_GROUP } from '../../../DAL'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import MyChip from '../../../components/MyChip'
import showToast from '../../../functions/showToast'
import MyLoader from '../../../components/MyLoader'
import { icons } from '../../../utilities/icons'
import Collapsible from 'react-native-collapsible'

const GroupAddEdit = ({ navigation, route }) => {
  // const { group, ammendList } = route?.params;
  const group = undefined;
  const ammendList = () => { }
  console.log(group, "group")
  const isEdit = !!group;
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [searchText, setSearchText] = useState("")
  const [memberList, setMemberList] = useState([]);
  const [programmeList, setProgrammeList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [buttonAlignment, setButtonAlignment] = useState("center");
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    type: "",
  })
  const [groupData, updateGroupData] = useState({
    title: !!group?.title ? group?.title : "",
    status: isEdit && !!group?.status == false ? false : true,
    groupBy: !!group?.group_by ? group?.group_by : "program",
    program: !!group?.program ? group?.program.map(x => x?._id) : [],
    event: !!group?.event ? group?.event.map(x => x?._id) : [],
    member: !!group?.member ? group?.member.map(x => x?._id) : [],
    recurringType: "daily",
    
  })
  const setGroupData = (update) => updateGroupData({ ...groupData, ...update });

  const closeModal = () => setOptionModal({
    isVisible: false,
    type: "",
  })

  useEffect(() => {
    getProgrammsListFromServer()
    getMemberListFromServer()
  }, [])

  //! APIs

  const getProgrammsListFromServer = async () => {
    let res = await GET_MEMBERS_AND_PROGRAMMES_LIST_FOR_CALENDAR_GROUP({ navigation, token });
    if (res.code == 200) {
      setProgrammeList(res?.programs);
      setEventsList(res?.portals);
    }
  }


  const getMemberListFromServer = async (searchText = "") => {
    let res = await GET_MEMBER_LIST_FOR_PAYMENT_REQUEST({ navigation, token, searchText: searchText.trim() });
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
        member: groupData.member.map(member => ({ member_id: member._id }))
      };
      if (obj.group_by == "program") {
        obj["program"] = groupData.program.map(item => ({ program_slug: item.program_slug }))
      } else {
        obj["event"] = groupData.event.map(item => ({ event_slug: item.event_slug }))
      }

      if (isEdit) {
        updateGroupToServer(obj)
      } else {
        addGroupToServer(obj)
      }
    }
  }

  //Todo /// optoion functions

  const onSelected = (item) => {
    let { type } = optionModal;
    closeModal();
    let sEvents = groupData[type];
    sEvents.push(item);
    setGroupData({ [type]: [...sEvents] });

  }

  const filterTheList = (list, text) => {
    let nList = list.slice().filter(y => {
      if (!groupData[optionModal?.type].find(x => x?._id == y?._id)) return true
      else return false
    });
    if (optionModal?.type == "member" || text.trim() == "") {
      return nList
    } else if (optionModal?.type == "event" || optionModal?.type == "program") {
      let stext = text.trim().toLowerCase();
      nList = list.slice().filter(x => x.title.toLowerCase().includes(stext))
    } else {
      nList = list
    }
  }

  const removeItem = (index, type) => {
    groupData[type].splice(index, 1);
    setGroupData({ [type]: [...groupData[type]] })
  }


  const selectedView = (list, type) => {
    return (
      <View style={__styles.chipsLisView}>
        {list.map((item, index) =>
          <MyChip
            title={item?.title}
            onPress={() => removeItem(index, type)}
          />
        )}
      </View>
    )
  }

  const selectedMemberView = (list, type) => {
    return (
      <View pointerEvents="box-none" style={__styles.chipsLisView}>
        {list.map((item, index) =>
          <MyChip
            title={`${item?.first_name} ${item?.last_name} (${item?.email})`}
            onPress={() => removeItem(index, type)}
          />
        )}
      </View>
    )
  }


  return (
    <RootView title={isEdit ? "Edit Event" : "Add Event"}>
      <MyKeyboardAvoidingView>
        <MyInputs
          label='Title*'
          onChangeText={(text) => setGroupData({ title: text })}
          value={groupData?.title}
        />

        <MyTouchableInput
          label='Color*'
          view={() => (
            <View style={{ flex: 1, marginLeft: 10, backgroundColor: 'red', borderWidth: 1, borderColor: colors.white, height: 30, borderRadius: 5 }} />
          )}
        />

        {/* //?  Recurring Type */}
        <View>
          <MyText isLabel>Recurring Type</MyText>
          <View style={__styles.alignBtnsRow}>
            <Pressable
              onPress={() => setGroupData({ recurringType: "daily" })}
              style={[__styles.alignBtnView, groupData?.recurringType == "daily" && __styles.alignSelectedBtnView]}
            >
              <MyText
                type='medium'
                color={groupData?.recurringType == "daily" ? colors.black : colors.white} >Daily</MyText>
            </Pressable>
            <View style={__styles.verticalDivider} />
            <Pressable
              onPress={() => setGroupData({ recurringType: "weekly" })}
              style={[__styles.alignBtnView, groupData.recurringType == "weekly" && __styles.alignSelectedBtnView]}>
              <MyText
                type='medium'
                color={groupData?.recurringType == "weekly" ? colors.black : colors.white}
              >Weekly</MyText>
            </Pressable>
            <View style={__styles.verticalDivider} />
            <Pressable
              onPress={() => setGroupData({ recurringType: "monthly" })}
              style={[__styles.alignBtnView, groupData.recurringType == "monthly" && __styles.alignSelectedBtnView]}>
              <MyText
                type='medium'
                color={groupData?.recurringType == "monthly" ? colors.black : colors.white}
              >Monthly</MyText>
            </Pressable>
          </View>
        </View>

        <Collapsible collapsed={groupData?.recurringType != "weekly"} >
          <View style={__styles.radioRootView}>
            <MyText isLabel>Weekdays *</MyText>
            <View style={[__styles.radioView, { flexWrap: "wrap" }]}>

              {weekdays.map((day, dayIndex) =>
                <View key={day.shortName} style={{ flex: 1 }}>
                  <MyCheckBox
                    // onPress={() => handlerWeekdays(day, index)}
                    title={day.shortName}
                    row={false}
                  // value={item?.days.includes(day.fullName)}
                  />
                </View>
              )}

            </View>
          </View>
        </Collapsible>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='Start Date*'
              icon={()=>icons.calendar(colors.primary)}
            />
          </View>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='Start Time*'
              icon={icons.clock}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='End Date*'
              icon={()=>icons.calendar(colors.primary)}
            />
          </View>
          <View style={{ flex: 1, marginRight: 10 }}>
            <MyTouchableInput
              label='End Time*'
              icon={icons.clock}
            />
          </View>
        </View>

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

        {groupData.groupBy == "program" ?

          <MyTouchableInput
            label='Programmes'
            iconOnPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
            view={() => selectedView(groupData?.program, "program")}
          /> :
          <MyTouchableInput
            label='Event'
            view={() => selectedView(groupData?.event, "event")}
            iconOnPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
          />}

        <MyTouchableInput
          view={() => selectedMemberView(groupData?.member, "member")}
          label='Members'
          iconOnPress={() => setOptionModal({ isVisible: true, type: "member" })}
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
        filterTheList={filterTheList}
        onSearchTextChange={(text) => {
          if (optionModal?.type == "member") {
            getMemberListFromServer(text.trim())
          }
        }}
        optionList={
          optionModal?.type == "program" ? programmeList :
            optionModal?.type == "event" ? eventsList :
              optionModal?.type == "member" ? memberList :
                []
        }
        title={
          optionModal?.type == "program" ? "Programme" :
            optionModal?.type == "event" ? "Event" :
              optionModal?.type == "member" ? "Member" : ""
        }
        renderText={({ item }) => (
          <MyText>
            {(optionModal?.type == "program" || optionModal?.type == "event") ?
              `${item?.title}` :
              optionModal?.type == "member" ? `${item?.first_name} ${item?.last_name} (${item?.email})` : ""}
          </MyText>
        )}
      />

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default GroupAddEdit


const weekdays = [{
  fullName: "Monday",
  shortName: "Mon",
},
{
  fullName: "Tuesday",
  shortName: "Tue",
},
{
  fullName: "Wednesday",
  shortName: "Wed",
},
{
  fullName: "Thursday",
  shortName: "Thu",
},
{
  fullName: "Friday",
  shortName: "Fri",
},
{
  fullName: "Saturday",
  shortName: "Sat",
},
{
  fullName: "Sunday",
  shortName: "Sun",
}]

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
  },
  alignSelectedBtnView: {
    backgroundColor: colors.primary,
  },
  alignBtnsRow: {
    flexDirection: 'row',
    alignItems: "center",
    height: 45,
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    marginBottom: 15
  },
  verticalDivider: {
    height: 20,
    width: 1,
    backgroundColor: colors.lightText
  },
  alignBtnView: {
    flex: 1,
    height: "85%",
    borderRadius: 5,
    backgroundColor: colors.transparent,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5
  },

})