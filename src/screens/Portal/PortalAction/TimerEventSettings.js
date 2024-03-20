import { View, Text, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyInputs from '../../../components/MyInputs'
import UploadFileInput from '../../../components/UploadFileInput'
import Editor from '../../../components/Editor'
import { MyButton } from '../../../components/MyButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { UPLDATE_PORTAL_LOCK_EVENT, UPLDATE_PORTAL_TIMER_CONGIF, UPLOAD_FILE_TO_S3 } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import moment from 'moment'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { icons } from '../../../utilities/icons'
import { dateTimeFormat } from '../../../utilities/constants'
import CalendarModal from '../../../components/CalendarModal'
import DateTimePicker from 'react-native-modal-datetime-picker'

const TimerEventSettings = ({ route, navigation }) => {
  let { config, slug } = route.params;
  const calendarRef = useRef()
  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [data, updateData] = useState({
    isEnable: !!config?.is_enable == false ? false : true,
    showfor: !!config?.show_for ? config?.show_for : "all",
    date: !!config?.event_date ? moment(config?.event_date) : moment(),
    time: !!config?.event_time ? moment(config?.event_time, "HH:mm").format(dateTimeFormat.time) : "12:00 AM",
    btnText: !!config?.button_text ? config?.button_text : "",
    link: !!config?.button_link ? config?.button_link : "",
    eventIcon: !!config?.event_logo ? config?.event_logo : "",
    desc: !!config?.title ? config?.title : ""
  })

  const setData = (updation) => updateData((oldData) => { return { ...oldData, ...updation } });

  const onSubmit = async () => {
    setLoader(true);
    if (!!data?.eventIcon?.uri) {
      let fd = new FormData();
      fd.append("image", data?.eventIcon);
      fd.append("width", data?.eventIcon?.width);
      let res = await UPLOAD_FILE_TO_S3({
        token, navigation, body: fd
      });
      if (res.code == 200) {
        addDataToServer(res?.image_path)
      } else {
        setLoader(false);
      }
    } else {
      addDataToServer()
    }
  }

  const addDataToServer = async (newImagePath) => {
    let res = await UPLDATE_PORTAL_TIMER_CONGIF({
      token, navigation, eventSlug: slug, body: {
        is_enable: data.isEnable,
        show_for: data.showfor,
        button_text: data?.btnText.trim(),
        button_link: data?.link,
        event_date: data.date,
        event_time: moment(data.time, dateTimeFormat.time).format("HH:mm"),
        title: data?.desc.trim(),
        event_logo: !!newImagePath ? newImagePath : data.eventIcon
      }
    })
    if (res.code == 200) {
      navigation.navigate(routes.portalListScreen)
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  return (
    <RootView title='Event Timer Configuration'>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableResetScrollToCoords={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >

          <View style={__styles.radioRootView}>
            <MyText isLabel>Is Enable</MyText>
            <View style={__styles.radioView}>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='Yes'
                  onPress={() => setData({ isEnable: true })}
                  value={data?.isEnable}
                />
              </View>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='No'
                  onPress={() => setData({ isEnable: false })}
                  value={!data?.isEnable}
                />
              </View>
            </View>
          </View>

          <View style={__styles.radioRootView}>
            <MyText isLabel>Show For</MyText>
            <View style={__styles.radioView}>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='All'
                  onPress={() => setData({ showfor: "all" })}
                  value={data?.showfor == "all"}
                />
              </View>
              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='Free'
                  onPress={() => setData({ showfor: "free" })}
                  value={data?.showfor == "free"}
                />
              </View>

              <View style={__styles.radioItem}>
                <MyCheckBox
                  title='Paid'
                  onPress={() => setData({ showfor: "paid" })}
                  value={data?.showfor == "paid"}
                />
              </View>
            </View>
          </View>



          <MyInputs
            label='Button Text'
            value={data?.btnText}
            onChangeText={(text) => setData({ btnText: text })}
          />

          <MyInputs
            label='Button Link'
            value={data?.link}
            onChangeText={(text) => setData({ link: text })}
          />

          <MyTouchableInput
            label='Date'
            value={moment(data?.date).format(dateTimeFormat.date)}
            icon={() => icons.calendar(colors.primary)}
            onPress={() => calendarRef?.current?.openModal(data?.date)}
          />

          <MyTouchableInput
            label='Time'
            value={moment(data?.time, "hh:mm A").format(dateTimeFormat.time)}
            icon={() => icons.clock(colors.primary)}
            onPress={() => setTimeModalVisible(true)}
          />

          <UploadFileInput
            label='Event Timer Icon'
            subLabel='(Recommended Size 1000 X 250)'
            onImagePicked={(img) => setData({ eventIcon: img })}
            onRemoveBtnPress={() => setData({ eventIcon: "" })}
            selectedImage={data?.eventIcon}
          />

          <Editor
            label='Description'
            height={150}
            initialValue={data?.desc}
            onChange={(text) => setData({ desc: text })}
          />

          <MyButton title='Update' onPress={onSubmit} />

        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />

      <CalendarModal
        ref={calendarRef}
        onDateSelected={(date) => setData({ date: date })}
      />

      <DateTimePicker
        isVisible={timeModalVisible}
        mode="time"
        display="spinner"
        date={moment(data.time, dateTimeFormat.time).toDate()}
        textColor={colors.darkSecondary}
        buttonTextColorIOS={colors.primary2}
        minuteInterval={15}
        onConfirm={(time) => {
          setData({ time: moment(time).format(dateTimeFormat.time) })
          setTimeModalVisible(false)
        }}
        onCancel={() => setTimeModalVisible(false)}
      />


    </RootView>
  )
}

export default TimerEventSettings


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