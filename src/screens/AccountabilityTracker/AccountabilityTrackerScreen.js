import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyTouchableInput from '../../components/MyTouchableInput'
import { MenuButton, MyButton, TransparentButton } from '../../components/MyButton'
import moment from 'moment'
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import { dateTimeFormat } from '../../utilities/constants'
import MyInputs from '../../components/MyInputs'
import {
  ADD_ACCOUNTABILITY_TRACKER, DELETE_ACCOUNTABILITY_TRACKER,
  GET_ACCOUNTABILITY_TRACKER_BY_DATE, MOVE_TO_TOMMORROW,
  SET_ACCOUNTABILITY_TRACKER_REMINDER, UPDATE_ACCOUNTABILITY_TRACKER,
  UPLOAD_FILE_TO_S3
} from '../../DAL'
import MyLoader from '../../components/MyLoader'
import uuid from 'react-native-uuid';
import MyCheckBox from '../../components/MyCheckBox'
import CalendarModal from '../../components/CalendarModal'
import UploadFileInput from '../../components/UploadFileInput'
import AudioPlayerForList from '../../components/AudioPlayerForList'
import InfoModal from '../../components/InfoModal'
import OptionModal from '../../components/OptionModal'
import TimePicker from '../../components/TimePicker'
import showToast from '../../functions/showToast'
import { selectTimeZone } from '../../redux/reducers/timezoneSlice'
import ConfirmationModal from '../../components/ConfirmationModal'
import routes from '../../navigation/routes'
import { convertTimezone } from '../../functions/convertTime'
import { IMGElementContentError } from 'react-native-render-html'

const getNewStatmentObj = () => {
  return {
    complete: false,
    is_moved_to_tomorrow: false,
    option: "",
    _id: uuid?.v4()
  }
}

const AccountabilityTrackerScreen = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const ref_calendar = useRef();
  const ref_infoModal = useRef();
  const ref_timePicker = useRef();
  const ref_inputs = useRef([]);
  const ref_scrollView = useRef();
  const timezone = useSelector(selectTimeZone);
  const [date, setDate] = useState(moment())
  const [loader, setLoader] = useState(false)
  const [settings, setSettings] = useState(null);
  const [affirmationText, setAffirmationText] = useState("");
  const [editId, setEditId] = useState("");
  const [statements, setStatements] = useState([getNewStatmentObj(), getNewStatmentObj(), getNewStatmentObj()])
  const [intentions, setIntentions] = useState([]);
  const [list, setList] = useState([]);
  const [options, setOptions] = useState({ isVisible: false, item: null });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null })

  const [reminderOptions, setReminderOptions] = useState({
    isVisible: false, key: ""
  })
  const [morningReminder, setMorningReminder] = useState({
    days: [],
    time: "00:00"
  })
  const [eveningReminder, setEveningReminder] = useState({
    days: [],
    time: "00:00"
  })

  console.log(intentions, "intentions")

  useEffect(() => {
    setLoader(true)
    setSettings(null)
    getAccountabilityTracker();

  }, [date])


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

  const validate = () => {


    for (let i = 0; i < statements.length; i++) {
      if (statements[i].option.trim() == "") {
        ref_inputs?.current[i]?.blur();
      }
    }
    for (let i = 0; i < statements.length; i++) {
      if (statements[i].option.trim() == "") {
        // showToast({ title: "", });
        ref_inputs?.current[i]?.focus();
        return
      }
    }

    for (let i = 0; i < intentions.length; i++) {
      console.log(intentions,"intentions")
      if (intentions[i]?.is_required == true && intentions[i]?.status == false) {
        showToast({ title: intentions[i].statement });
        return
      }
    }
    addOrUpdate()

  }


  const addOrUpdate = () => {
    if (!!editId) {
      updateTrackerToServer()
    } else {
      addTrackerToServer()
    }
  }

  //todo /////// Navigtaion

  const onPastActivities = () => {
    navigation.navigate(routes.accountabilityPastActivitesScreen, { removeFromList })
  }

  const removeFromList = (id) => {
    setList((list) => list.slice().filter(x => x._id != id))
  }


  //! APIs

  const getAccountabilityTracker = async () => {
    setLoader(true);
    let res = await GET_ACCOUNTABILITY_TRACKER_BY_DATE({ navigation, token, date: moment(date).format("DD-MM-YYYY") });
    setLoader(false);
    if (res.code == 200) {
      if (!!res?.daily_dynamite && Object.keys(res?.daily_dynamite).length > 0) {
        setEditId(res?.daily_dynamite?._id)
        setStatements(res?.daily_dynamite?.statement_array)
        setIntentions(res?.daily_dynamite?.tracker_intention)
        setAffirmationText(res?.daily_dynamite?.note ? res?.daily_dynamite?.note : "")
      } else {
        setEditId("")
        setIntentions(res?.delegate_report_setting?.tracker_intentions);
        setStatements([getNewStatmentObj(), getNewStatmentObj(), getNewStatmentObj()])
        setAffirmationText("")
      }
      setSettings(res?.delegate_report_setting);
      setMorningReminder({
        time: !!res?.daily_dynamite_morning_reminder_time.time ? moment(res?.daily_dynamite_morning_reminder_time.time).format("HH:mm") : "00:00",
        days: res?.daily_dynamite_morning_reminder_time.days ? res?.daily_dynamite_morning_reminder_time.days : []
      })
      setEveningReminder({
        time: !!res?.daily_dynamite_evening_reminder_time.time ? moment(res?.daily_dynamite_evening_reminder_time.time).format("HH:mm") : "00:00",
        days: res?.daily_dynamite_evening_reminder_time.days ? res?.daily_dynamite_evening_reminder_time.days : []
      });
      if (res?.past_activities) {
        setList(res?.past_activities)
      }
    }
  }


  const setStreakReminderToServer = async (isMorning) => {
    let body = {};
    if (isMorning) {
      body = { daily_dynamite_morning_reminder_time: morningReminder }
    } else {
      body = { daily_dynamite_evening_reminder_time: eveningReminder }
    }
    let res = await SET_ACCOUNTABILITY_TRACKER_REMINDER({ navigation, token, body });
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
    }
  }


  const addTrackerToServer = async () => {
    setLoader(true);


    let body = {
      date: moment(date).format("DD-MM-YYYY"),
      goal_statement_info: { image: "", status: false },
      gratitude_info: { image: "", status: false },
      paradigm_info: { image: "", status: false },
      statement_array: statements,
      tracker_intention: intentions,
      note: affirmationText.trim(),
    }
    let res = await ADD_ACCOUNTABILITY_TRACKER({ navigation, token, body });
    setLoader(false);
    if (res.code == 200) {
      setEditId(res?.dynamite_diary?._id)
      showToast({ title: res?.message, type: "success" });
    }
  }


  const updateTrackerToServer = async () => {
    setLoader(true);
    let completed = 0;
    let unCompleted = 0;
    for (let i = 0; i < statements.length; i++) {
      if (statements[i].complete) {
        completed++;
      } else {
        unCompleted++
      }
    }
    let body = {
      completed_intention: completed,
      incomplete_intention: unCompleted,
      date: moment(date).format("DD-MM-YYYY"),
      statement_array: statements,
      tracker_intention: intentions,
      note: affirmationText.trim(),
    }
    let res = await UPDATE_ACCOUNTABILITY_TRACKER({
      navigation, token, body, id: editId
    });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
    }
  }

  const deleteTrackerToServer = async (id) => {
    setLoader(true);

    let res = await DELETE_ACCOUNTABILITY_TRACKER({
      navigation, token, id
    });
    setLoader(false);
    if (res.code == 200) {
      setList((list) => list.slice().filter(x => x._id != id))
    }
  }


  const uploadImageToS3 = async (img, index) => {
    console.log(img, "img")
    setLoader(true);
    let APIArray = [];
    img.forEach((pic, index1) => {
      let fd = new FormData();
      fd.append("image", pic);
      fd.append("width", pic.width);
      APIArray.push(UPLOAD_FILE_TO_S3({
        navigation, token, body: fd
      }))
    })

    let resp = await Promise.all(APIArray);
    setLoader(false);
    if (resp.every(x => x.code == 200)) {
      intentionHandler(index, { images: [...intentions[index].images, ...resp.map(x => x?.image_path)] })
    }
  }

  const moveToTommorrow = async (intention, index) => {
    if (!intention?.is_moved_to_tomorrow) {
      setLoader(true);
      let res = await MOVE_TO_TOMMORROW({
        navigation, token, body: {
          date: moment(date).add({ day: 1 }).format("YYYY-MM-DD"),
          intention_object: intention
        }
      });
      if (res.code == 200) {
        statementhandler({ is_moved_to_tomorrow: true }, index)
        addOrUpdate()
      }
    }
  }



  //* REMNDER 

  const onReminderSelected = (item) => {
    if (reminderOptions?.key == "morningReminder") {
      let index = morningReminder.days.findIndex(x => String(x) == String(item.key));
      if (index > -1) {
        morningReminder.days.splice(index, 1);
      } else {
        morningReminder.days.push(item.value);
      }
      setMorningReminder({ ...morningReminder, days: [...morningReminder.days] })
    } else if (reminderOptions?.key == "eveningReminder") {
      let index = eveningReminder.days.findIndex(x => String(x) == String(item.key));
      if (index > -1) {
        eveningReminder.days.splice(index, 1);
      } else {
        eveningReminder.days.push(item.value);
      }
      setEveningReminder({ ...eveningReminder, days: [...eveningReminder.days] })
    }
  }


  //* Function

  const onSelected = (opt) => {
    let { item } = options;
    setOptions({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "edit") {
        Keyboard.dismiss()
        setDate(moment(item.date, "DD-MM-YYYY"))
        ref_scrollView?.current?.scrollToPosition(0, 0, true)
      } else if (opt.key == "delete") {
        setConfirmation({ isVisible: true, item: item })
      }
    }, 400);
  }


  const onAgree = () => {
    let { item } = confirmation;
    setConfirmation({ isVisible: false, item: null })
    setTimeout(() => {
      deleteTrackerToServer(item?._id)
    }, 350);
  }


  //* handlers

  const statementhandler = (changes, index) => {
    let obj = { ...statements[index], ...changes };
    statements.splice(index, 1, obj);
    setStatements([...statements])
  }

  const removeStatement = (index) => {
    statements.splice(index, 1)
    setStatements([...statements])
  }

  const addStatment = () => {
    statements.push(getNewStatmentObj())
    setStatements([...statements])
  }

  const intentionHandler = (index, changes) => {
    let obj = { ...intentions[index], ...changes };
    intentions.splice(index, 1, obj)
    setIntentions([...intentions])
  }


  const removeIntentionImage = (intentionIndex, imgIndex) => {
    let images = [...intentions[intentionIndex].images];
    images.splice(imgIndex, 1);
    intentionHandler(intentionIndex, { images: [...images] })
  }

  //* Views
  const morningReminderView = () => {
    return (
      <View style={__styles.reminderView}>
        <View style={{ marginVertical: 5 }}>
          <MyText type='bold' fontSize={16}  >{!!settings?.morning_heading ? settings?.morning_heading : ""}</MyText>
        </View>
        <View style={{}}>
          <MyTouchableInput
            label='Select Day*'
            onPress={() => setReminderOptions({ isVisible: true, key: "morningReminder" })}
            view={() => (
              <View style={__styles.daysView}>
                {!!morningReminder.days && morningReminder.days.map(day => (
                  <MyText key={`day${day}`} >{daysName[day] + ", "}</MyText>
                ))}
              </View>
            )}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, }}>
            <MyTouchableInput
              label='Reminder Time*'
              icon={icons.clock}
              value={moment(morningReminder.time, "HH:mm").format(dateTimeFormat.time)}
              // onPress={() => setReminderTimerPicker({ isVisible: true, key: "morningReminder" })}
              onPress={() => ref_timePicker?.current?.openModal(morningReminder?.time, "morningReminder")}
            />
          </View>

          <View style={{ marginLeft: 10, marginTop: 7 }}>
            <MyButton title='Save'
              style={{ paddingHorizontal: 5, }}
              invert
              onPress={() => setStreakReminderToServer(true)}
            />
          </View>
        </View>

      </View>
    )
  }

  const eveningReminderView = () => {
    return (
      <View style={__styles.reminderView}>
        <View style={__styles.labelView}>
          <MyText type='bold' fontSize={16}  >{!!settings?.evening_heading ? settings?.evening_heading : ""}</MyText>
        </View>
        <View style={{}}>
          <MyTouchableInput
            label='Select Day*'
            onPress={() => setReminderOptions({ isVisible: true, key: "eveningReminder" })}
            view={() => (
              <View style={__styles.daysView}>
                {!!eveningReminder.days && eveningReminder.days.map(day => (
                  <MyText key={`day${day}`} >{daysName[day] + ", "}</MyText>
                ))}
              </View>
            )}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, }}>
            <MyTouchableInput
              label='Reminder Time*'
              icon={icons.clock}
              value={moment(eveningReminder.time, "HH:mm").format(dateTimeFormat.time)}
              // onPress={() => setReminderTimerPicker({ isVisible: true, key: "eveningReminder" })}
              onPress={() => ref_timePicker?.current?.openModal(eveningReminder?.time, "eveningReminder")}
            />
          </View>

          <View style={{ marginLeft: 10, marginTop: 7 }}>
            <MyButton title='Save'
              style={{ paddingHorizontal: 5, }}
              invert
              onPress={() => setStreakReminderToServer(false)}
            />
          </View>
        </View>

      </View>
    )
  }


  const dateView = () => {
    return (
      <View >
        <View style={__styles.labelView}>
          <MyText type='bold' fontSize={16}  >Date</MyText>
        </View>
        <View style={{ marginTop: -15 }}>
          <MyTouchableInput
            onPress={() => ref_calendar?.current?.openModal(date)}
            value={moment(date).format(dateTimeFormat.date)}
            icon={() => icons.calendar(colors.primary)}
          />
        </View>
      </View>
    )
  }

  const affirrmationView = () => {
    return (
      <View >
        <View style={__styles.labelView}>
          <MyText type='bold' fontSize={16}  >{!!settings?.affirm_title ? settings?.affirm_title : ""}</MyText>
        </View>

        <View style={{ marginTop: 5 }}>
          <MyInputs

            noLable
            multiline={true}
            placeholder={!!settings?.affirm_placeHolder ? settings?.affirm_placeHolder : ""}
            value={affirmationText}
            onChangeText={(text) => setAffirmationText(text)}
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
                  value={item?.option}
                  onChangeText={(text) => {
                    statementhandler({ option: text }, index);
                  }}
                  placeholder={`${index + 1}.`}
                />
              </View>

              <View style={{ marginTop: -5 }}>
                {statements.length > 1 ?
                  <TouchableOpacity
                    style={__styles.addRemoveButton}
                    onPress={() => removeStatement(index)} >
                    {icons.minusCircle(colors.delete)}
                  </TouchableOpacity> : <View />}

                <TouchableOpacity
                  style={[__styles.addRemoveButton, { marginTop: 5 }]}
                  onPress={addStatment} >
                  {icons.plusCircle()}
                </TouchableOpacity>
              </View>

            </View>
            {item?.option != "" &&
              <View style={{ flexDirection: "row", }}>
                <View style={{ flex: 1 }}>
                  <MyCheckBox
                    onPress={() => moveToTommorrow(item, index)}
                    value={item?.is_moved_to_tomorrow}
                    title={"Move to Tomorrow"}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  <MyCheckBox
                    value={item?.complete}
                    title={"Mark Intention Complete"}
                    onPress={() => {
                      statementhandler({ complete: !item?.complete }, index,)
                      addOrUpdate()
                    }}
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
                label={item?.statement}
                showCheckbox={true}
                checkBoxValue={item?.status}
                onCheckBoxPress={() => intentionHandler(index, { status: !item?.status })}
                showAlert={!item?.status}
                alertFun={() => showToast({ title: "Please tick the check box before Uploading Image" })}
                onImagePicked={(img) => uploadImageToS3(img, index)}
                onRemoveBtnPress={(imgIndex) => removeIntentionImage(index, imgIndex)}
                selectedImage={item?.images}
                multiple={true}
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

                <View>
                  {item?.is_text_box_shown &&
                    <MyInputs
                      placeholder='Write comment here'
                      multiline
                      value={item?.text_box_content}

                      onChangeText={(txt) => intentionHandler(index, { text_box_content: txt })}
                    />}
                </View>

              </View>
            </View>
          </View>))}


      </View>
    )
  }


  const saveView = () => {
    return (
      <View style={{ marginVertical: 10 }}>
        <MyButton title='Save' onPress={validate} />
      </View>
    )
  }

  const recentActivities = () => {
    return (
      <View>
        <MyText align='right' fontSize={10} >Most Recent</MyText>

        <View>

          {list.map((item, index) => (
            <View key={"activities" + index} style={__styles.activityView} >
              <View style={__styles.activityRow}>
                <MyText>{moment(item?.date, "DD-MM-YYYY").format(dateTimeFormat.date)}</MyText>
                <View style={__styles.activityNestedRow}>
                  <MyText>{moment(item?.date_time, "YYYY-MM-DD HH:mm").format(dateTimeFormat.time)}</MyText>
                  <MenuButton
                    onPress={() => setOptions({ isVisible: true, item, item })}
                  />
                </View>

              </View>
              <View style={{ marginTop: 10 }}>
                <MyText>{item?.statement_array[0]?.option}</MyText>
              </View>
            </View>
          ))}


        </View>


        <View style={{ marginVertical: 10, alignItems: "flex-end" }}>
          <MyButton invert
            title='Past Activities'
            style={{ paddingHorizontal: 10, height: 40 }}
            onPress={onPastActivities}
          />
        </View>
      </View>
    )
  }

  return (
    <RootView
      title={!!settings?.main_heading ? settings?.main_heading : ""}
      hideBackBottomButton >
      {!!settings &&
        <View style={{ flex: 1 }}>
          <KeyboardAwareScrollView
            ref={ref_scrollView}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 50 }}
            enableAutomaticScroll={true}
            showsVerticalScrollIndicator={false}>
            {morningReminderView()}
            {eveningReminderView()}
            <View style={__styles.reminderView}>
              {affirrmationView()}
              {dateView()}
              {statementView()}
            </View>

            {intentionView()}
            {saveView()}
            {recentActivities()}
          </KeyboardAwareScrollView>
        </View>}
      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(slectedDate) => setDate(moment(slectedDate))}

        maximun={moment()}
      />

      <InfoModal
        ref={ref_infoModal}
      />
      <MyLoader enable={loader} />


      <TimePicker
        ref={ref_timePicker}
        onAgree={(date, type) => {
          if (type == "morningReminder") {
            setMorningReminder({ ...morningReminder, time: date })
          } else {
            setEveningReminder({ ...eveningReminder, time: date })
          }
        }}
      />


      <OptionModal
        optionList={daysList}
        isVisible={reminderOptions?.isVisible}
        closeModal={() => setReminderOptions({ isVisible: false, key: "" })}
        onSelected={onReminderSelected}
        multiple
        noIcon
        checkSelected={(item) => {
          if (reminderOptions?.key == "morningReminder") {
            return morningReminder.days.findIndex(x => Number(x) == Number(item.value)) > -1
          } else if (reminderOptions?.key == "eveningReminder") {
            return eveningReminder.days.findIndex(x => Number(x) == Number(item.value)) > -1
          }
        }}

      />


      <OptionModal
        isVisible={options.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptions({ isVisible: false, item: null })}
      />


      <ConfirmationModal
        title={"Are you sure you want to delete?"}
        isVisible={confirmation.isVisible}
        onAgree={onAgree}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}
      />


    </RootView>
  )
}

export default AccountabilityTrackerScreen

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
    title: "Sunday",
    value: 0,
  },
  {
    key: '1',
    title: "Monday",
    value: 1,
  },
  {
    key: '2',
    title: "Tuesday",
    value: 2,
  },

  {
    key: '3',
    title: "Wednesday",
    value: 3,
  },
  {
    key: '4',
    title: "Thursday",
    value: 4,
  },
  {
    key: '5',
    title: "Friday",
    value: 5,
  },
  {
    key: '6',
    title: "Saturday",
    value: 6,
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
