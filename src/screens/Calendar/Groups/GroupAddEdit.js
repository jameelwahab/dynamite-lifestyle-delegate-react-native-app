import { View, Text, KeyboardAvoidingView, ScrollView, Platform, StyleSheet } from 'react-native'
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
import { GET_MEMBERS_AND_PROGRAMMES_LIST_FOR_CALENDAR_GROUP, GET_MEMBER_LIST_FOR_PAYMENT_REQUEST } from '../../../DAL'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'

const GroupAddEdit = ({ navigation, route }) => {
  const { group } = route?.params
  const isEdit = !!group;
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchText, setSearchText] = useState("")
  const [memberList, setMemberList] = useState([]);
  const [programmeList, setProgrammeList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    type: "",
  })
  const [groupData, updateGroupData] = useState({
    title: "",
    status: true,
    groupBy: "program",
    program: [],
    members: [],
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


  //Todo /// optoion functions

  const onSelected = () => {
    let { type } = optionModal;
    if (type == "event") {
      
    } else if (type == "program") {

    } else if (type == "member") {

    }
  }

  const filterTheList = (list, text) => {
    if (optionModal?.type == "member") {
      return list
    } else if (optionModal?.type == "event" || optionModal?.type == "program") {
      let stext = text.trim().toLowerCase();
      return list.slice().filter(x => x.title.toLowerCase().includes(stext))
    } else return list
  }


  return (
    <RootView hideBackBottomButton title={isEdit ? "Edit Group" : "Add Group"}>
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



        <View style={__styles.radioRootView}>
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
        </View>

        {groupData.groupBy == "program" ?

          <MyTouchableInput
            label='Programmes'
            onPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
          /> :
          <MyTouchableInput
            label='Event'
            onPress={() => setOptionModal({ isVisible: true, type: groupData.groupBy })}
          />}

        <MyTouchableInput
          label='Members'
          onPress={() => setOptionModal({ isVisible: true, type: "member" })}
        />


        <View style={{ marginTop: 10 }}>
          <MyButton title='Submit' />
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
    </RootView>
  )
}

export default GroupAddEdit

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
})