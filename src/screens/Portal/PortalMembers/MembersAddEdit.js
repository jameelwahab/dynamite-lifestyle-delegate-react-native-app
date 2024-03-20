import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import { selectUser } from '../../../redux/reducers/userSlice'
import { useSelector } from 'react-redux'
import moment from 'moment'
import CalendarModal from '../../../components/CalendarModal'
import { dateTimeFormat } from '../../../utilities/constants'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import { MEMBER_LISTING_ADDING, PORTAL_EVENT_ADD_MEMBER, PORTAL_EVENT_EDIT_MEMBER } from '../../../DAL'
import MyChip from '../../../components/MyChip'
import OptionModal from '../../../components/OptionModal'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import MemberView from '../../../components/MemberView'



const MembersAddEdit = ({ navigation, route }) => {
  let { item, slug, eventId, backScreenFunc } = route.params;
  let { token } = useSelector(selectUser);
  let startDateCalendarRef = useRef();
  let endDateCalendarRef = useRef();
  const [optionModal, setOptionModal] = useState({
    visiblilty: false,
  });
  const [memberModalVisibility, setMemberModalVisibility] = useState(false)
  const [loader, setLoader] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [data, updateData] = useState({
    memberType: "",
    startDate: !!item?.event_start_date ? moment(item?.event_start_date).format() : moment(),
    endDate: !!item?.event_expiry_date ? moment(item?.event_expiry_date).format() : moment(),
    members: []
  })
  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  const onOptionSelected = (opt) => {
    setOptionModal({ isVisible: false, selectedItem: null })
  }
  const onMemberSelected = (member) => {
    setData({ members: [...data.members, member] })
    setMemberModalVisibility(false)
  }
  const removeMember = (index) => {
    data.members.splice(index, 1);
    setData({ members: [...data.members] })
  }

  useEffect(() => {
    getMembersFromServer()
  }, [])

  const onSubmit = () => {
    setLoader(true)
    let fd = new FormData();
    fd.append("start_date", moment(data.startDate).format("YYYY-MM-DD"))
    fd.append("expiry_date", moment(data.endDate).format("YYYY-MM-DD"))
    fd.append("dynamite_event", eventId)
    if (!!item == false) {
      let membersarry = data.members.map(member => ({ member_id: member?._id }))
      fd.append("is_member_create", false)
      fd.append("member", JSON.stringify(membersarry))
    } else {
      fd.append("member", item?._id)
    }


    if (!!item) {
      updateMemberInEventPortal(fd)
    } else {
      addMemberInEventPortal(fd);
    }
  }

  const addMemberInEventPortal = async (formdata) => {
    let res = await PORTAL_EVENT_ADD_MEMBER({
      token, navigation, formdata
    })
    if (res.code == 200) {
      navigation.navigate(routes.portalMembersList, {
        slug, eventId
      })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const updateMemberInEventPortal = async (formdata) => {
    let res = await PORTAL_EVENT_EDIT_MEMBER({
      token, navigation, formdata
    })
    if (res.code == 200) {
      backScreenFunc?.({
        ...res?.member,
        event_start_date: moment(data.startDate).format("YYYY-MM-DD"),
        event_expiry_date: moment(data.endDate).format("YYYY-MM-DD")
      })
      navigation.goBack()
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const getMembersFromServer = async (searchText = "") => {
    let res = await MEMBER_LISTING_ADDING({
      token, navigation, eventId, searchText
    })
    if (res.code == 200) {
      setMemberList(res?.member)
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const selectedMembersView = () => {
    return (
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center", flexWrap: "wrap", paddingVertical: 2 }}>
        {data?.members.map((item, index) => (
          <MyChip
            key={item?._id}
            title={item?.first_name + " " + item?.last_name}
            onPress={() => removeMember(index)}
          />
        ))}
      </View>
    )
  }

  return (
    <RootView title={!!item ? "Update Event Info" : 'Add Members to Event'} >
      <View style={{ flex: 1 }}>
        {!!item &&
          <View style={{ marginBottom: 10 }}>
            <MemberView
              member={item}
            />
          </View>
        }
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* <MyTouchableInput
          label='Member *'
        /> */}
          {!!item == false &&
            <MyTouchableInput
              label='Member *'
              value={optionList[0].title}
              onPress={() => setOptionModal({ visiblilty: true })}

            />}

          <MyTouchableInput
            label='Start Date'
            icon={() => icons.calendar(colors.primary)}
            value={moment(data?.startDate).format(dateTimeFormat.date)}
            onPress={() => startDateCalendarRef?.current?.openModal(data.startDate)}
          />

          <MyTouchableInput
            label='End Date'
            icon={() => icons.calendar(colors.primary)}
            value={moment(data?.endDate).format(dateTimeFormat.date)}
            onPress={() => endDateCalendarRef?.current?.openModal(data.endDate)}
          />
          {!!item == false &&

            <MyTouchableInput
              label='Members'
              iconOnPress={() => setMemberModalVisibility(true)}
              view={selectedMembersView}
              clearbutton={data.members.length > 0}
              onClearButtonPress={() => setData({ members: [] })}
            />
          }
          <View style={{ marginTop: 10 }}>
            <MyButton
              title='Submit'
              onPress={onSubmit}
            />
          </View>
        </ScrollView>

      </View>

      <MyLoader enable={loader} />

      <CalendarModal
        ref={startDateCalendarRef}
        onDateSelected={(date) => {
          setData({ startDate: date });
        }}
      />

      <CalendarModal
        ref={endDateCalendarRef}
        onDateSelected={(date) => {
          setData({ endDate: date });
        }}
      />

      <OptionModal
        isVisible={optionModal.visiblilty}
        onSelected={onOptionSelected}
        closeModal={() => setOptionModal({ visiblilty: false })}
        optionList={optionList}
      />

      <OptionModalWithSearch
        isVisible={memberModalVisibility}
        closeModal={() => setMemberModalVisibility(false)}
        optionList={memberList}
        title='Members'
        onSearchTextChange={(text) => getMembersFromServer(text)}
        renderText={({ item }) =>
          <MyText style={{ textTransform: "capitalize" }} >
            {`${item?.first_name} ${item?.last_name} (${item?.email})`}
          </MyText>}
        onSelected={onMemberSelected}

      />
    </RootView>
  )
}

export default MembersAddEdit

const optionList = [
  {
    title: "Add Existing Member",
    key: "exiting"
  }
]