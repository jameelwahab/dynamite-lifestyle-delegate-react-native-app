import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import MyInputs from '../../../components/MyInputs'
import MyText from '../../../components/MyText'
import MyCheckBox from '../../../components/MyCheckBox'
import { colors } from '../../../utilities/colors'
import { MyButton } from '../../../components/MyButton'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import showToast from '../../../functions/showToast'
import { ADD_AUTOMATED_GROUP, EDIT_AUTOMATED_GROUP } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyLoader from '../../../components/MyLoader'

const AutomatedGroupAddEdit = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const { group, parentObj, ammendList } = route?.params;
  console.log(group, "group")
  const [loader, setLoader] = useState(false)
  const [inputData, updateInputData] = useState({
    name: group?.title || "",
    startDay: !!group?.automated_group_start_day ? String(group?.automated_group_start_day) : "0",
    endDay: !!group?.automated_group_end_day ? String(group?.automated_group_end_day) : "0",
    status: group?.status == false ? false : true,
  })

  const setInputData = (updation) => updateInputData((old) => ({ ...old, ...updation }));

  const addGrpToServer = async (body) => {
    let res = await ADD_AUTOMATED_GROUP({ navigation, token, data: body });
    setLoader(false)
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      ammendList?.(res?.group)
      navigation.goBack()
    }
  }

  const updateGrpToServer = async (body) => {
    let res = await EDIT_AUTOMATED_GROUP({ navigation, token, data: body, slug: group?.group_slug });
    setLoader(false)
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" })
      ammendList?.(res?.group)
      navigation.goBack()
    }
  }


  const onSubmit = () => {
    if (inputData?.name.trim() == "") {
      showToast({ title: "Alert", body: "Please enter Automated Group Name", type: "info" })
    } else if (inputData?.startDay.trim() == "") {
      showToast({ title: "Alert", body: "Please enter Automated Start Day", type: "info" })
    } else if (inputData?.endDay.trim() == "") {
      showToast({ title: "Alert", body: "Please enter Automated End Day", type: "info" })
    } else {
      let obj = {
        automated_group_end_day: Number(inputData?.endDay),
        automated_group_start_day: Number(inputData?.startDay),
        created_for: parentObj?.type,
        program_slug: parentObj?._id,
        status: inputData?.status,
        title: inputData?.name,
      }
      setLoader(true)
      if (!!group) {
        updateGrpToServer(obj)
      } else {
        addGrpToServer(obj)
      }
    }
  }



  return (
    <RootView title={group ? "Edit Automated Group" : 'Add Automated Group'}>

      <MyKeyboardAvoidingView>
        <MyInputs
          label='Group Name *'
          value={inputData?.name}
          onChangeText={(text) => setInputData({ name: text })}
        />

        <View style={__styles.radioRootView}>
          <MyText isLabel>Group Status *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Active'
                onPress={() => setInputData({ status: true })}
                value={inputData?.status}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Inactive'
                onPress={() => setInputData({ status: false })}
                value={!inputData?.status}
              />
            </View>
          </View>
        </View>

        <MyInputs
          label='Group Start Day *'
          keyboardType="number-pad"
          value={inputData?.startDay}
          onChangeText={(text) => setInputData({ startDay: text })}
        />

        <MyInputs
          label='Group End Day *'
          keyboardType="number-pad"
          value={inputData?.endDay}
          onChangeText={(text) => setInputData({ endDay: text })}
        />

        <MyButton title='Submit' onPress={onSubmit} />
      </MyKeyboardAvoidingView>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default AutomatedGroupAddEdit


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