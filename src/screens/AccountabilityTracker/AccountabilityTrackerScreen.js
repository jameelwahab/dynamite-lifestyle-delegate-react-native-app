import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyTouchableInput from '../../components/MyTouchableInput'
import { MyButton, TransparentButton } from '../../components/MyButton'
import moment from 'moment'
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import { dateTimeFormat } from '../../utilities/constants'
import MyInputs from '../../components/MyInputs'
import { GET_ACCOUNTABILITY_TRACKER_BY_DATE } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import uuid from 'react-native-uuid';
import MyCheckBox from '../../components/MyCheckBox'
import CalendarModal from '../../components/CalendarModal'
import UploadFileInput from '../../components/UploadFileInput'
import AudioPlayerForList from '../../components/AudioPlayerForList'
import InfoModal from '../../components/InfoModal'
import OptionModal from '../../components/OptionModal'
import DateTimePicker from 'react-native-modal-datetime-picker'
import TimePicker from '../../components/TimePicker'

const getNewStatmentObj = () => {
  return {
    complete: false,
    is_moved_to_tomorrow: false,
    option: "",
    _id: uuid?.v4()
  }
}

const AccountabilityTrackerScreen = ({ navigation, route }) => {
  const { key } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const ref_calendar = useRef();
  const ref_infoModal = useRef();
  const ref_timePicker = useRef();

  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [date, setDate] = useState(moment())
  const [loader, setLoader] = useState(false)
  const [settings, setSettings] = useState(null);
  const [statements, setStatements] = useState([getNewStatmentObj(), getNewStatmentObj(), getNewStatmentObj()])
  const [intentions, setIntentions] = useState([]);
  const [reminderOptions, setReminderOptions] = useState({
    isVisible: false, key: ""
  })
  const [reminderTimerPicker, setReminderTimerPicker] = useState({
    isVisible: false, key: ""
  })
  const [reminder, setReminder] = useState({
    days: [],
    time: "00:00"
  })

  const [morningReminder, setMorningReminder] = useState({
    days: [],
    time: "00:00"
  })
  const [eveningReminder, setEveningReminder] = useState({
    days: [],
    time: "00:00"
  })



  useEffect(() => {
    setLoader(true)
    getStreakPerformance()
  }, [date])



  const getStreakPerformance = async () => {
    setLoader(true);
    let res = await GET_ACCOUNTABILITY_TRACKER_BY_DATE({ navigation, token, date: moment(date).format("DD-MM-YYYY") });
    setLoader(false);
    if (res.code == 200) {

      // setStreakId(res?.strek?._id)
      //   updateStreak({
      //     attitude_performance_rate: res?.strek?.attitude_performance_rate,
      //     desire_performance_rate: res?.strek?.desire_performance_rate,
      //     discipline_performance_rate: res?.strek?.discipline_performance_rate,
      //     focus_performance_rate: res?.strek?.focus_performance_rate,
      //     win_note: res?.strek?.win_note,
      //     win_note_performance_rate: res?.strek?.win_note_performance_rate
      //   })
      // }

      setSettings(res?.delegate_report_setting);
      setIntentions(res?.delegate_report_setting?.tracker_intentions);
      // setReminder({
      //   time: !!res?.dynamite_streak_performance_reminder_time.time ? moment(res?.dynamite_streak_performance_reminder_time.time).format("HH:mm") : "00:00",
      //   days: res?.dynamite_streak_performance_reminder_time.days ? res?.dynamite_streak_performance_reminder_time.days : []
      // })
      // showToast({ title: res?.message, type: "success" });

    }
  }


  const onReminderSelected = (item) => {
    if (reminderOptions?.key == "morningReminder") {
      let index = morningReminder.days.findIndex(x => String(x) == String(item.key));
      if (index > -1) {
        morningReminder.days.splice(index, 1);
      } else {
        morningReminder.days.push(item.key);
      }
      setMorningReminder({ ...morningReminder, days: [...morningReminder.days] })
    } else if (reminderOptions?.key == "eveningReminder") {
      let index = eveningReminder.days.findIndex(x => String(x) == String(item.key));
      if (index > -1) {
        eveningReminder.days.splice(index, 1);
      } else {
        eveningReminder.days.push(item.key);
      }
      setEveningReminder({ ...eveningReminder, days: [...eveningReminder.days] })
    }
  }


  //* Function

  const statementhandler = (text, index) => {
    statements[index].option = text;
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

  //* Views
  const morningReminderView = () => {
    return (
      <View style={__styles.reminderView}>
        <View style={{ marginVertical: 5 }}>
          <MyText type='bold' fontSize={16}  >Morning Reminderr</MyText>
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
              onPress={() => ref_timePicker?.current?.openModal(eveningReminder?.time, "morningReminder")}
            />
          </View>

          <View style={{ marginLeft: 10, marginTop: 7 }}>
            <MyButton title='Save'
              style={{ paddingHorizontal: 5, }}
              invert
            // onPress={onReminderSave}
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
          <MyText type='bold' fontSize={16}  >Evening Reminderr</MyText>
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
            // onPress={onReminderSave}
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
          <MyText type='bold' fontSize={16}  >Today Affirmation</MyText>
        </View>

        <View style={{ marginTop: 5 }}>
          <MyInputs
            noLable
            multiline={true}
          />
        </View>
      </View>
    )
  }


  const statementView = () => {
    return (
      <View >
        <View style={__styles.labelView}>
          <MyText type='bold' fontSize={16}  >List the top 3 intentions you commit to completing today that are Goal-Achievingg
          </MyText>
        </View>
        {statements.map((item, index) => (
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", }}>
              <View style={{ flex: 1 }}>
                <MyInputs
                  noLable
                  value={item?.option}
                  onChangeText={(text) => statementhandler(text, index)}
                  placeholder={`${index + 1}.`}
                />
              </View>

              <View style={{ marginTop: -5 }}>
                <TouchableOpacity
                  style={__styles.addRemoveButton}
                  onPress={() => removeStatement(index)} >
                  {icons.minusCircle(colors.delete)}
                </TouchableOpacity>

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
                    value={item?.is_moved_to_tomorrow}
                    title={"Move to Tomorrow"}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
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
          <MyText type='bold' color={colors.primary} fontSize={16}  >Have You Completed?</MyText>
        </View>



        {intentions.map((item, index) => (
          <View style={[__styles.reminderView, { marginTop: 5, paddingBottom: 10 }]}>
            <View style={{ marginTop: 5 }}>
              <UploadFileInput
                label='Mark the checkbox to complete Your Goal Statement'
                showCheckbox={true}
                checkBoxValue={item?.status}
                onCheckBoxPress={() => intentionHandler(index, { status: !item?.status })}
                disable={!item?.status}
                onImagePicked={(img) => intentionHandler(index, { image: img })}
                selectedImage={item?.image}
              />

              <View>
                {item?.content_type == "audio" ?
                  <AudioPlayerForList
                    url={item?.content}
                    id={item.content}
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


  const saveView = () => {
    return (
      <View style={{ marginVertical: 10 }}>
        <MyButton />
      </View>
    )
  }

  return (
    <RootView title={title} hideBackBottomButton >
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
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
        </KeyboardAwareScrollView>
      </View>
      <CalendarModal
        ref={ref_calendar}
        onDateSelected={(slectedDate) => setDate(moment(slectedDate))}
      />

      <InfoModal
        ref={ref_infoModal}
      />
      <MyLoader enable={loader} />

      {/* <DateTimePicker
        date={reminderTimerPicker?.key == "morningReminder" ?
          moment(morningReminder?.time, "HH:mm").toDate() :
          moment(eveningReminder.time, "HH:mm").toDate()}
        isVisible={reminderTimerPicker?.isVisible}
        onCancel={() => setReminderOptions({ isVisible: false, key: "" })}
        onConfirm={(date) => {
          if (reminderTimerPicker?.key == "morningReminder") {
            setMorningReminder({ ...morningReminder, time: moment(date).format("HH:mm") })
          } else {
            setEveningReminder({ ...eveningReminder, time: moment(date).format("HH:mm") })
          }
          setReminderTimerPicker({ isVisible: false, key: "" })
        }}
        mode="time"

      /> */}


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
            return !!morningReminder.days.find(x => Number(x) == Number(item.key))
          } else if (reminderOptions?.key == "eveningReminder") {
            return !!eveningReminder.days.find(x => Number(x) == Number(item.key))
          }
        }}

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

  }
})



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
