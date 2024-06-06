import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import MyInputs from '../../../components/MyInputs'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { colors } from '../../../utilities/colors'
import MyCheckBox from '../../../components/MyCheckBox'
import UploadFileInput from '../../../components/UploadFileInput'
import { MyButton } from '../../../components/MyButton'
import TimeZoneModal from '../../../components/TimeZoneModal'
import PhoneInput from '../../../components/PhoneInput'
import showToast from '../../../functions/showToast'
import { isEmailValid } from '../../../functions/regex'
import { ADD_SALE_TEAM_MEMBER, UPDATE_SALE_TEAM_MEMBER } from '../../../DAL'
import MyLoader from '../../../components/MyLoader'
import routes from '../../../navigation/routes'

const TeamAddEdit = ({ navigation, route }) => {
  const { member: memberOldData } = route?.params
  const { token } = useSelector(selectUser);
  const [member, updateMember] = useState({
    firstName: !!memberOldData?.first_name ? memberOldData?.first_name : "",
    lastName: !!memberOldData?.last_name ? memberOldData?.last_name : "",
    email: !!memberOldData?.email ? memberOldData?.email : "",
    password: "",
    contact: !!memberOldData?.contact_number ? memberOldData?.contact_number : "",
    country: !!memberOldData?.state ? memberOldData?.state : "",
    address: !!memberOldData?.address ? memberOldData?.address : "",
    timezone: !!memberOldData?.time_zone ? memberOldData?.time_zone : "Europe/Dublin",
    status: !!memberOldData && !!memberOldData?.status == false ? false : true,
    bio: !!memberOldData?.biography ? memberOldData?.biography : "",
    image: !!memberOldData?.image?.thumbnail_1 ? memberOldData?.image?.thumbnail_1 : null,
    city: !!memberOldData?.city ? memberOldData?.city : ""
  })
  const [loader, setLoader] = useState(false);
  const [isTimezoneModalShown, setIsTimezoneModalShown] = useState(false);
  const setMember = (updation) => updateMember({ ...member, ...updation });

  useEffect(() => {

  }, [])

  //! //////// API

  const addTeamMemberToServer = async (fd) => {
    setLoader(true);
    let res = await ADD_SALE_TEAM_MEMBER({ token, navigation, formData: fd });
    if (res.code == 200) {
      navigation.navigate(routes.salesTeamListing, { member: res?.sale_tem_member })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const updateMemberToServer = async (fd) => {
    setLoader(true);
    let res = await UPDATE_SALE_TEAM_MEMBER({ token, navigation, memberId: memberOldData?._id, formData: fd });
    if (res.code == 200) {
      navigation.navigate(routes.salesTeamListing, { member: res?.sale_tem_member })
      setLoader(false);
    } else {
      setLoader(false);
    }
  }


  const onSubmitClick = () => {
    if (member.firstName.trim() == "") {
      showToast({ title: "Alert", body: "Please enter your first name", type: "info" })
    } else if (member.lastName.trim() == "") {
      showToast({ title: "Alert", body: "Please enter your last name", type: "info" })
    } else if (member.email.trim() == "") {
      showToast({ title: "Alert", body: "Please enter your email", type: "info" })
    } else if (isEmailValid(member.email.trim()) == false) {
      showToast({ title: "Alert", body: "Please enter valid email", type: "info" })
    } else if (!memberOldData && member.password.trim() == "") {
      showToast({ title: "Alert", body: "Please enter your password", type: "info" })
    } else if (member.timezone.trim() == "") {
      showToast({ title: "Alert", body: "Please select your timezone", type: "info" })
    } else if (!memberOldData && !!member?.image?.uri == false) {
      showToast({ title: "Alert", body: "Please select your image", type: "info" })
    } else {
      let fd = new FormData();
      fd.append("first_name", member?.firstName.trim())
      fd.append("last_name", member?.lastName.trim())
      if (!!member?.image?.uri) {
        fd.append("image", member?.image)
      }
      fd.append("biography", member?.bio)
      fd.append("email", member?.email)
      if (!memberOldData) {
        fd.append("password", member?.password)
      }
      fd.append("contact_number", member?.contact)
      fd.append("status", member?.status)
      fd.append("address", member?.address)
      fd.append("city", member?.city)
      fd.append("state", member?.country)
      fd.append("time_zone", member?.timezone)
      if (!!memberOldData) {
        updateMemberToServer(fd);
      } else {
        addTeamMemberToServer(fd);
      }
    }

  }




  return (
    <RootView title={memberOldData ? "Edit Sales Team" : "Add Sales Team"}>
      <MyKeyboardAvoidingView>
        <MyInputs
          label='First Name*'
          value={member?.firstName}
          onChangeText={(text) => setMember({ firstName: text })}
        />

        <MyInputs
          label='Last Name*'
          value={member?.lastName}
          onChangeText={(text) => setMember({ lastName: text })}
        />

        <MyInputs
          label='Email*'
          value={member?.email}
          keyboardType='email-address'
          onChangeText={(text) => setMember({ email: text })}
        />

        {!memberOldData &&
          <MyInputs
            label='Password*'
            value={member?.password}
            onChangeText={(text) => setMember({ password: text })}
            isPassword
          />}


        <PhoneInput
          label='Contact'
          value={member?.contact}
          onChange={(text) => setMember({ contact: text })}
        />

        <MyInputs
          label='City'
          value={member?.city}
          onChangeText={(text) => setMember({ city: text })}
        />

        <MyInputs
          label='State/Country'
          value={member?.country}
          onChangeText={(text) => setMember({ country: text })}
        />

        <MyInputs
          label='Address'
          value={member?.address}
          onChangeText={(text) => setMember({ address: text })}
        />

        <MyTouchableInput
          label='Time Zone*'
          onPress={() => setIsTimezoneModalShown(true)}
          value={member?.timezone}
        />

        <View style={__styles.radioRootView}>
          <MyText isLabel>Status*</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Active'
                onPress={() => setMember({ status: true })}
                value={member?.status}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Inactive'
                onPress={() => setMember({ status: false })}
                value={!member?.status}
              />
            </View>
          </View>
        </View>

        <UploadFileInput
          label='Upload Image*'
          subLabel='Image Size(1000 X 670) ("JPG", "JPEG", "PNG","WEBP")'
          onImagePicked={(img) => setMember({ image: img })}
          selectedImage={member?.image}
          onRemoveBtnPress={() => setMember({ image: null })}
        />

        <MyInputs
          label='Biography'
          multiline
          value={member?.bio}
          onChangeText={(text) => setMember({ bio: text })}
        />


        <MyButton
          title='Submit'
          onPress={onSubmitClick}
        />


      </MyKeyboardAvoidingView>

      <MyLoader enable={loader} />
      <TimeZoneModal
        isVisible={isTimezoneModalShown}
        closeModal={() => setIsTimezoneModalShown(false)}
        selectTimeZone={(timezone) => setMember({ timezone: timezone })}
      />
    </RootView>
  )
}

export default TeamAddEdit

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