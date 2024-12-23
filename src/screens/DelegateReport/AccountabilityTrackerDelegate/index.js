import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MenuButton, MyButton, TransparentButton } from '../../../components/MyButton'
import moment from 'moment'
import { colors } from '../../../utilities/colors'
import { icons } from '../../../utilities/icons'
import { dateTimeFormat } from '../../../utilities/constants'
import MyInputs from '../../../components/MyInputs'
import {
  GET_ACCOUNTABILITY_TRACKER_BY_DATE_AND_DELEGATE,
  GET_FILTER_DATA,
} from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import uuid from 'react-native-uuid';
import MyCheckBox from '../../../components/MyCheckBox'
import UploadFileInput from '../../../components/UploadFileInput'
import AudioPlayerForList from '../../../components/AudioPlayerForList'
import InfoModal from '../../../components/InfoModal'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import EmptyView from '../../../components/EmptyView'



const getNewStatmentObj = () => {
  return {
    complete: false,
    is_moved_to_tomorrow: false,
    option: "",
    _id: uuid?.v4()
  }
}

const AccountabilityTrackerDelegate = ({ navigation, route }) => {
  const { item, user } = route?.params;
  const { token } = useSelector(selectUser);
  const ref_infoModal = useRef();
  const ref_inputs = useRef([]);
  const ref_scrollView = useRef();

  const [delegate, setDelegate] = useState(user)
  const [date, setDate] = useState(moment(item?.date, "DD-MM-YYYY"))
  const [loader, setLoader] = useState(false)
  const [settings, setSettings] = useState(null);
  const [editId, setEditId] = useState("");
  const [statements, setStatements] = useState([getNewStatmentObj(), getNewStatmentObj(), getNewStatmentObj()])
  const [intentions, setIntentions] = useState([]);
  const [delegateModal, setDelegateModal] = useState(false)
  const [delegatelist, setDelegatelist] = useState([]);
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    setLoader(true)
    setNoData(false)
    setSettings(null)
    getAccountabilityTracker();
    getDelegateListfromServer("");
  }, [delegate?._id])


  useEffect(() => {
    if (!!route?.params?.date) {
      setSettings(null)
      setDate(route.params.date)
      ref_scrollView?.current?.scrollToPosition(0, 0, true)
    } else {
      setLoader(true)
      setSettings(null)
      getAccountabilityTracker();

    }
  }, [route])


  //* Loop incremnt

  const onLoopComplete = (url) => {
    let index = intentions.findIndex(x => x.content == url);
    if (index > -1) {
      intentions[index].listen_count++;
      setIntentions([...intentions])
    }
  }

  //*








  //! APIs

  const getAccountabilityTracker = async () => {
    setLoader(true);
    let res = await GET_ACCOUNTABILITY_TRACKER_BY_DATE_AND_DELEGATE({ navigation, token, delegateId: delegate?._id, date: moment(date).format("DD-MM-YYYY") });
    setLoader(false);
    if (res.code == 200) {
      if (!!res?.daily_dynamite && Object.keys(res?.daily_dynamite).length > 0) {
        setEditId(res?.daily_dynamite?._id)
        setStatements(res?.daily_dynamite?.statement_array)
        setIntentions(res?.daily_dynamite?.tracker_intention)
        setNoData(false)
      } else {
        setNoData(true)
        setEditId("")
        setIntentions([]);
        setStatements([])
      }
      setSettings(res?.delegate_report_setting);
    }
  }



  const getDelegateListfromServer = async (text) => {
    let res = await GET_FILTER_DATA({ navigation, token, searchText: text.trim() });
    setLoader(false);
    if (res.code == 200) {
      setDelegatelist(res?.delegates_list)
    }
  }











  //* Views



  const dateView = () => {
    return (
      <View >
        <View style={__styles.labelView}>
          <MyText type='bold' fontSize={16}  >Date</MyText>
        </View>
        <View style={{ marginTop: -15 }}>
          <MyTouchableInput
            value={moment(date).format(dateTimeFormat.date)}
            icon={() => icons.calendar(colors.primary)}
          />
        </View>
      </View>
    )
  }


  const statementView = () => {
    return (
      <View >
        <View style={__styles.labelView}>
          <MyText type='bold' fontSize={16}  >{!!settings?.intentions_heading ? settings?.intentions_heading : ""}</MyText>
        </View>
        {statements.map((item, index) => (
          <View key={`statement${index}`} style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", }}>
              <View style={{ flex: 1 }}>
                <MyInputs
                  myref={(element) => (ref_inputs.current[index] = element)}
                  noLable
                  editable={false}
                  value={item?.option}
                  placeholder={`${index + 1}.`}
                />
              </View>



            </View>
            {item?.option != "" &&
              <View style={{ flexDirection: "row", }}>
                <View style={{ flex: 1 }} />
                <View style={{ flex: 1.5, }}>
                  <MyCheckBox
                    value={item?.complete}
                    title={"Mark Intention Complete"}
                  />
                </View>
              </View>}
          </View>))}
      </View>
    )
  }

  const intentionView = () => {
    return (
      <View>
        <View style={__styles.labelView}>
          <MyText type='bold' color={colors.primary} fontSize={16}  >
            {!!settings?.completed_heading ? settings?.completed_heading : ""}
          </MyText>
        </View>



        {intentions.map((item, index) => (
          <View key={`intenstions${index}`} style={[__styles.reminderView, { marginTop: 5, paddingBottom: 10 }]}>
            <View style={{ marginTop: 5 }}>
              <UploadFileInput
                label='Mark the checkbox to complete Your Goal Statement'
                showCheckbox={true}
                hideRemoveButton={true}
                checkBoxValue={item?.status}
                disable={true}
                selectedImage={item?.image}
              />

              <View>
                {item?.content_type == "audio" ?
                  <AudioPlayerForList
                    url={item?.content}
                    id={item.content}
                    loop={true}
                    onLoopComplete={(url) => onLoopComplete(url)}
                  /> :
                  <View style={{ alignSelf: "flex-end" }}>
                    <TransparentButton
                      onPress={() => ref_infoModal?.current?.openModal(item?.content, "", true)}
                      title='View Content'
                    />
                  </View>}

              </View>
            </View>
          </View>))}


      </View>
    )
  }

  const delegateSelectedView = () => {
    return (
      <View>
        <MyTouchableInput
          onPress={() => setDelegateModal(true)}
          label='Choose Delegate'
          value={`${delegate?.first_name} ${delegate?.last_name} (${delegate?.email})`}
        />
      </View>)
  }





  return (
    <RootView title={"Monthly Delegate Report"}>
      {!!settings &&
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            ref={ref_scrollView}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 50 }}
            enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}>
            <View style={__styles.reminderView}>
              {delegateSelectedView()}
              {statements.length > 0 && statementView()}
              {dateView()}
            </View>

            {intentionView()}

            {noData && <EmptyView label={"No Daily Dynamite found"} />}
          </KeyboardAwareScrollView>
        </View>}

      <InfoModal
        ref={ref_infoModal}
      />
      <MyLoader enable={loader} />



      <OptionModalWithSearch
        isVisible={delegateModal}
        closeModal={() => setDelegateModal(false)}
        onSelected={(item) => {
          setDelegate(item)
          setDelegateModal(false);
        }}
        optionList={delegatelist}
        onSearchTextChange={(text) => getDelegateListfromServer(text)}
        title='Delegate'
        renderText={({ item }) => <MyText fontSize={16} >
          {`${item?.first_name} ${item?.last_name} (${item?.email})`}
        </MyText>}
      />



    </RootView>
  )
}

export default AccountabilityTrackerDelegate

const __styles = StyleSheet.create({
  reminderView: {
    marginBottom: 10,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingTop: 5
  },
  daysView: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  labelView: { marginVertical: 5 },
  addRemoveButton: {
    paddingLeft: 5,

  },
  activityView: {
    paddingLeft: 10, paddingVertical: 10, paddingRight: 5,
    backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10
  },
  activityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  activityNestedRow: { flexDirection: "row", alignItems: "center" }
})


const optionsList = [

  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },

]


const daysList = [
  {
    key: '0',
    title: "Sunday"
  },
  {
    key: '1',
    title: "Monday"
  },
  {
    key: '2',
    title: "Tuesday"
  },

  {
    key: '3',
    title: "Wednesday"
  },
  {
    key: '4',
    title: "Thursday"
  },
  {
    key: '5',
    title: "Friday"
  },
  {
    key: '6',
    title: "Saturday"
  },
]

const daysName = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday"
}
