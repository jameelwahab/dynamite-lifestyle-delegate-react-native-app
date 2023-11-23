import { View, Text } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import Editor from '../../../components/Editor'
import { MyButton } from '../../../components/MyButton'
import showToast from '../../../functions/showToast'
import { SEND_TICKET_REMINDER } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'

const SendReminderScreen = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const [reminderText, setReminderText] = useState("");
  const [loader, setLoader] = useState(false);


  const btn_send = async () => {
    if (reminderText.trim() == "") {
      showToast({ body: "Please enter your reminder", type: "info" })
    } else {
      setLoader(true)
      let res = await SEND_TICKET_REMINDER({
        token, navigation,
        body: {
          support_ticket: route?.params?.ticketId,
          message: reminderText
        }
      });
      setLoader(false);
      if (res.code == 200) {
        navigation.goBack()
      }
    }
  }

  return (
    <RootView title='Send Reminder' >
      <Editor
        initialValue={reminderText}
        onChange={(text) => setReminderText(text)}
      />
      <View style={{ marginTop: 10, marginLeft: "70%" }}>
        <MyButton
          title='Send'
          invert
          onPress={btn_send}
        />
      </View>

      <MyLoader enable={loader} />
    </RootView>
  )
}

export default SendReminderScreen