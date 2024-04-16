import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MyInputs from '../../../components/MyInputs'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import { icons } from '../../../utilities/icons'
import moment from 'moment'
import MyLoader from '../../../components/MyLoader'
import showToast from '../../../functions/showToast'
import { ADD_EARNING, EDIT_EARNING } from '../../../DAL'
import CalendarModal from '../../../components/CalendarModal'
import { dateTimeFormat } from '../../../utilities/constants'
import { colors } from '../../../utilities/colors'
import routes from '../../../navigation/routes'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'


const AddEditEarning = ({ navigation, route }) => {
  const { token } = useSelector(selectUser)
  const { earning } = route?.params;
  const ref_calendar = useRef();
  const [amount, setAmount] = useState(!!earning ? String(earning?.earning) : "");
  const [date, setDate] = useState(!!earning ? moment(earning?.date) : moment());
  const [desc, setDesc] = useState(!!earning ? earning?.description : "");
  const [loader, setLoader] = useState(false);

  const onSubmit = () => {
    if (amount.trim() == "") {
      showToast({ title: "Alert", body: "Please enter your earning", type: "info" });
    } else if (desc.trim() == "") {
      showToast({ title: "Alert", body: "Please enter description of your earning", type: "info" });
    } else {
      setLoader(true)
      if (!!earning) {
        updatEaringToServer()
      } else {
        addEaringToServer()
      }
    }
  }

  //! APIs
  const addEaringToServer = async () => {

    let res = await ADD_EARNING({
      navigation, token, body: {
        date: moment(date).format("YYYY-MM-DD"),
        description: desc.trim(),
        earning: amount,
      }
    });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      navigation.navigate(routes?._90daysTracker, {
        callApi: true
      })
    }
  }

  const updatEaringToServer = async () => {
    let res = await EDIT_EARNING({
      navigation, token, earningId: earning?._id, body: {
        date: moment(date).format("YYYY-MM-DD"),
        description: desc.trim(),
        earning: amount,
      }
    });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      navigation.navigate(routes?._90daysTracker, {
        callApi: true
      })
    }
  }



  return (
    <RootView title={!!earning ? 'Edit Earning' : 'Add Earning'} >
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        showsVerticalScrollIndicator={false}      >

        <MyInputs
          label="Today's Earning*"
          keyboardType="number-pad"
          leftIcon={()=>icons.cuurency_gbp(colors.primary,18)}
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />


        <MyTouchableInput
          label="Date"
          value={moment(date).format(dateTimeFormat.date)}
          onPress={() => ref_calendar?.current?.openModal(date)}
          icon={() => icons.calendar(colors.primary)}
        />

        <MyInputs
          multiline
          label="Add Description*"
          value={desc}
          onChangeText={(text) => setDesc(text)}
        />

        <MyButton title='Save' onPress={onSubmit} />


      </KeyboardAwareScrollView>

      <CalendarModal
        onDateSelected={(date) => setDate(date)}
        ref={ref_calendar}
      />
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default AddEditEarning