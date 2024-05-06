import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { ADD_DAILY_STREAK, GET_DAILY_STREAK, SET_DAILY_STREAK_REMINDER, UPDATE_DAILY_STREAK } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import { colors } from '../../utilities/colors'
import { Slider } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyInputs from '../../components/MyInputs'
import { MyButton } from '../../components/MyButton'
import routes from '../../navigation/routes'
import MyTouchableInput from '../../components/MyTouchableInput'
import OptionModal from '../../components/OptionModal'
import { icons } from '../../utilities/icons'
import moment, { weekdays } from 'moment'
import { dateTimeFormat } from '../../utilities/constants'
import DateTimePicker from 'react-native-modal-datetime-picker'
import showToast from '../../functions/showToast'

const PerformanceStreak = ({ navigation, route }) => {
  const { key } = route?.params
  const { token } = useSelector(selectUser);
  const { navbar } = useSelector(selectNavbar);
  const [title] = useState(navbar?.find(x => x._id == key)?.title);
  const [loader, setLoader] = useState(true);
  const [streak, updateStreak] = useState({
    attitude_performance_rate: 0,
    desire_performance_rate: 0,
    discipline_performance_rate: 0,
    focus_performance_rate: 0,
    win_note: "",
    win_note_performance_rate: 0,
  });
  const [isTimerPickerVisible, setIsTimerPickerVisible] = useState(false);
  const [optionModalVisibility, setOptionModalVisibility] = useState(false)
  const [streakId, setStreakId] = useState("");
  const [settings, setSettings] = useState(null);
  const [reminder, setReminder] = useState({
    days: [],
    time: "00:00"
  })

  const setStreak = (update) => updateStreak((old) => ({ ...old, ...update }));

  useEffect(() => {
    getStreakPerformance()
  }, [])



  //? /// functions

  const onStreakList = () => {
    navigation.navigate(routes.performanceAnalysisScreen)
  }

  const onReminderSave = () => {
    setStreakReminderToServer()
  }

  const onSubmit = () => {
    if (!!streakId) {
      updateStreakToServer()
    } else {
      addStreakToServer()
    }
  }

  //! APIs

  const getStreakPerformance = async (id) => {
    setLoader(true);
    let res = await GET_DAILY_STREAK({ navigation, token });
    setLoader(false);
    if (res.code == 200) {
      if (!!res?.strek && Object.keys(res?.strek).length > 0) {
        setStreakId(res?.strek?._id)
        updateStreak({
          attitude_performance_rate: res?.strek?.attitude_performance_rate,
          desire_performance_rate: res?.strek?.desire_performance_rate,
          discipline_performance_rate: res?.strek?.discipline_performance_rate,
          focus_performance_rate: res?.strek?.focus_performance_rate,
          win_note: res?.strek?.win_note,
          win_note_performance_rate: res?.strek?.win_note_performance_rate
        })
      }
      setSettings(res?.streak_performance_setting);
      setReminder({ ...res?.dynamite_streak_performance_reminder_time })
      // showToast({ title: res?.message, type: "success" });
    }
  }

  const addStreakToServer = async (id) => {
    setLoader(true);
    let res = await ADD_DAILY_STREAK({
      navigation, token, body: streak
    });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
    }
  }

  const updateStreakToServer = async (id) => {
    setLoader(true);
    let res = await UPDATE_DAILY_STREAK({ navigation, token, body: streak, id: streakId });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
    }
  }

  const setStreakReminderToServer = async (id) => {
    let res = await SET_DAILY_STREAK_REMINDER({ navigation, token, days: reminder.days, time: reminder.time });
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
    }
  }

  //* Views
  const reminderView = () => {
    return (
      <View style={__styles.reminderView}>
        <View style={{}}>
          <MyTouchableInput
            label='Select Day*'
            onPress={() => setOptionModalVisibility(true)}
            view={() => (
              <View style={__styles.daysView}>
                {reminder.days.map(day => (
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
              value={moment(reminder.time, "HH:mm").format(dateTimeFormat.time)}
              onPress={() => setIsTimerPickerVisible(true)}
            />
          </View>

          <View style={{ marginLeft: 10, marginTop: 7 }}>
            <MyButton title='Save'
              style={{ paddingHorizontal: 5, }}
              invert
              onPress={onReminderSave}
            />
          </View>
        </View>

      </View>
    )
  }
  const sliderView = (label, stateKey) => {
    return (
      <View style={__styles.sliderView}>
        <View style={__styles.sliderLabel}>
          <MyText>{label}</MyText>
        </View>

        <View style={__styles.progressView}>
          <Slider
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.white + "33"}
            thumbTintColor={colors.primary}
            thumbStyle={{ height: 25, width: 25 }}
            value={streak[stateKey]}
            step={1}
            allowTouchTrack
            onValueChange={(val) => setStreak({ [stateKey]: val })}
            // disabled={true}
            thumbProps={{
              children: (
                <View style={__styles.thumb}>
                  {streak[stateKey] != 0 &&
                    <MyText color={colors.black}>{streak[stateKey]}</MyText>}
                </View>
              ),
            }}
          />
        </View>
        <View style={__styles.progressNumberView}>
          <MyText>0</MyText>
          <MyText>10</MyText>
        </View>
      </View>)
  }

  const totalScore = () => {
    let total = Object.values(streak).filter(x => typeof (x) == "number").reduce((a, b) => a + b, 0)
    return (
      <View style={__styles.sliderView}>
        <View style={[__styles.progressNumberView, { marginTop: 0 }]}>
          <MyText color={colors.primary} >{settings?.total_score_text + " :"}</MyText>
          <MyText>
            {total}/<MyText color={colors.primary} >50</MyText>
          </MyText>
        </View>
      </View>)
  }

  return (
    <RootView hideBackBottomButton title={title}>
      <View style={{ flex: 1, marginTop: 5 }}>
        {!!settings &&
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            {reminderView()}
            <MyText type='bold' fontSize={18}>{settings?.rate_your_performance_streak_heading}</MyText>

            <View style={{}}>
              {sliderView(settings?.your_attitude_text, "attitude_performance_rate")}
              {sliderView(settings?.your_focus_text, "focus_performance_rate")}
              {sliderView(settings?.your_desire_text, "desire_performance_rate")}
              {sliderView(settings?.your_discipline_text, "discipline_performance_rate")}
              {sliderView(settings?.rate_this_win_text, "win_note_performance_rate")}
              {totalScore()}
            </View>

            <View style={{ marginTop: 20 }}>
              <MyText type='bold' fontSize={18}>{settings?.win_from_today_heading}</MyText>
              <View style={{ marginTop: -10 }}>
                <MyInputs
                  multiline
                  value={streak["win_note"]}
                  onChangeText={(text) => setStreak({ win_note: text })}
                  placeholder={settings?.win_from_today_placeholder}
                />
              </View>
            </View>


            <View style={__styles.btnsRow}>
              {!!settings?.past_activities_button_text_performance &&
                <MyButton
                  style={__styles.btn}
                  onPress={onStreakList}
                  invert
                  title={settings?.past_activities_button_text_performance} />
              }

              <MyButton
                style={__styles.btn}
                onPress={onSubmit}
                invert
                title={!!streakId ? "Update" : "Save"} />

            </View>
          </KeyboardAwareScrollView>}
      </View>
      <MyLoader enable={loader} />

      <DateTimePicker
        date={moment(reminder.time, "HH:mm").toDate()}
        isVisible={isTimerPickerVisible}
        onCancel={() => setIsTimerPickerVisible(false)}
        onConfirm={(date) => {
          // console.log(moment(date).format("HH:mm"))
          setReminder({ ...reminder, time: moment(date).format("HH:mm") })
          setIsTimerPickerVisible(false)
        }}
        mode="time"

      />

      <OptionModal
        optionList={daysList}
        isVisible={optionModalVisibility}
        closeModal={() => setOptionModalVisibility(false)}
        multiple
        noIcon
        checkSelected={(item) => {
          return !!reminder.days.find(x => Number(x) == Number(item.key))
        }}
        onSelected={(item) => {
          let index = reminder.days.findIndex(x => String(x) == String(item.key));
          if (index > -1) {
            reminder.days.splice(index, 1);
          } else {
            reminder.days.push(item.key);
          }
          setReminder({ ...reminder, days: [...reminder.days] })
        }}
      />
    </RootView>
  )
}

export default PerformanceStreak

const __styles = StyleSheet.create({
  sliderView: {
    borderWidth: 2,
    borderColor: colors.secondarySelect,
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginTop: 25
  },
  sliderLabel: {
    position: "absolute",
    top: -10,
    left: 5,
    backgroundColor: colors.darkSecondary,
    paddingHorizontal: 5
  },
  progressView: {
    // marginHorizontal: 20,

  },
  thumb: {
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    width: 25,
  },
  progressNumberView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -5
  },
  btnsRow: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  btn: {
    paddingHorizontal: 10,
    // height: 35,
    marginLeft: 10
  },
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
