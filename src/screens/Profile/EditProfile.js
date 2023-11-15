import { View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import React, { useEffect, useState, useRef } from 'react'
import RootView from '../../components/RootView'
import { colors } from '../../utilities/colors'
import { icons } from '../../utilities/icons'
import MyInputs from '../../components/MyInputs'
import { MyButton } from '../../components/MyButton'
import utilities from '../../utilities'
import CountryModal from '../../components/CountryModal'
import MyTouchableInput from '../../components/MyTouchableInput'
import MyImage from '../../components/MyImage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setConsultant, } from '../../redux/reducers/userSlice'
import ImageUploadModal from '../../components/ImageUploadModal'
import { S3_URL } from '../../utilities/constants'
import timeZones from '../../assets/data/timeZones.json'
import TimeZoneModal from '../../components/TimeZoneModal'
import { EDIT_PROFILE } from '../../DAL'
import MyLoader from '../../components/MyLoader'
import showToast from '../../functions/showToast'

const EditProfile = ({ navigation }) => {
  const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false)
  const [isTimeZonePickerVisible, setTimeZonePickerVisible] = useState(false)
  const [loader, setLoader] = useState(false)
  const pickerRef = useRef();
  const dispatch = useDispatch()
  const { user, token } = useSelector(selectUser);
  const [userData, updateUser] = useState({
    imageToUpload: "",
    alreadyUploadedImage: user?.image?.thumbnail_1,
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    contact: user?.contact_number,
    address: user?.address,
    city: user?.city,
    country: user?.state,
    timeZone: user?.time_zone,
    bio: user?.biography
  })

  const setUser = (updation) => updateUser({ ...userData, ...updation });


  const btn_update = async () => {
    setLoader(true)
    let fd = new FormData()
    fd.append('first_name', userData.first_name.trim())
    fd.append('last_name', userData.last_name.trim())
    fd.append('email', userData.email.trim())
    fd.append('city', userData?.city.trim())
    fd.append('time_zone', userData?.timeZone)
    fd.append('state', userData?.country)
    fd.append('address', userData?.address.trim())
    fd.append('biography', userData?.bio.trim())
    fd.append('contact_number', userData?.contact.trim())
    if (userData?.imageToUpload) {
      fd.append('image', userData?.imageToUpload)
    }

    let res = await EDIT_PROFILE({ navigation, token, body: fd, params: user?._id });
    if (res.code == 200) {
      dispatch(setConsultant(res?.consultant))
      showToast({ type: 'success', title: res.message, });
      navigation.goBack()
    }
    setLoader(false)
  }


  return (

    <RootView style={__styles.rootView}>
      <KeyboardAwareScrollView
        extraScrollHeight={100}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={__styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={__styles.scrollInnerContainer}>
          <TouchableOpacity
            onPress={() => setIsImageModalVisible(true)}
            style={__styles.iconView}>
            <MyImage
              source={
                !!userData?.imageToUpload ?
                  userData?.imageToUpload :
                  !!userData?.alreadyUploadedImage ?
                    { uri: S3_URL + userData?.alreadyUploadedImage } :
                    icons.dummyUser}
              style={__styles.icon}
              imageStyle={{ borderRadius: 40 }}
            />
            <View style={__styles.subIconView}>{icons.camera()}</View>
          </TouchableOpacity>


          <View style={__styles.innerView}>

            <MyInputs
              label='First Name*'
              value={userData?.first_name}
              onChangeText={(text) => setUser({ first_name: text })}

            />

            <MyInputs
              label='Last Name*'
              value={userData?.last_name}
              onChangeText={(text) => setUser({ last_name: text })}
            />

            <MyInputs
              label='Email*'
              keyboardType='email-address'
              value={userData?.email}
              onChangeText={(text) => setUser({ email: text })}
            />

            <MyInputs
              label='Contact Number*'
              keyboardType='phone-pad'
              value={userData?.contact}
              onChangeText={(text) => setUser({ contact: text })}
            />

            <MyInputs
              label='Address*'
              value={userData?.address}
              onChangeText={(text) => setUser({ address: text })}
            />


            <MyInputs
              label='City*'
              value={userData?.city}
              onChangeText={(text) => setUser({ city: text })}
            />

            <MyTouchableInput
              onPress={() => setIsCountryModalVisible(true)}
              label='State/Country*'
              value={userData?.country}
            // onChangeText={(text) => setUser({ first_name: text })}
            />

            <MyTouchableInput
              label='Time Zone*'
              value={userData?.timeZone}
              onPress={() => setTimeZonePickerVisible(true)}
            // onChangeText={(text) => setUser({ first_name: text })}
            />


            <MyInputs
              label='Biography*'
              placeholder='Maximun limit 500 chracters'
              multiline={true}
              maxLength={500}
              value={userData?.bio}
              onChangeText={(text) => setUser({ bio: text })}
            />


            <MyButton
              invert title='Update' onPress={btn_update} />



          </View>
        </View>

      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
      <CountryModal
        isVisible={isCountryModalVisible}
        closeModal={() => setIsCountryModalVisible(false)}
        selectCountry={(country) => setUser({ country: country.name })}
      />

      <TimeZoneModal
        isVisible={isTimeZonePickerVisible}
        closeModal={() => setTimeZonePickerVisible(false)}
        selectTimeZone={(timeZone) => setUser({ timeZone: timeZone })}
      />

      <ImageUploadModal
        isVisible={isImageModalVisible}
        onImagePicked={(image) => setUser({ imageToUpload: image })}
        closeModal={() => setIsImageModalVisible(false)}
      />
    </RootView>
  )
}

export default EditProfile;

const __styles = StyleSheet.create({
  rootView: { marginHorizontal: 20, paddingVertical: 30, flex: 1 },
  scrollContainer: { paddingVertical: 30 },
  scrollInnerContainer: { alignItems: "center", backgroundColor: colors.secondaryVariant, borderRadius: 10, padding: 20 },
  iconView: { height: 80, width: 80, marginTop: 20, borderRadius: 40, },
  icon: { height: "100%", width: "100%", },
  subIconView: { position: "absolute", bottom: 0, right: 0, },
  innerView: { marginTop: "10%", width: "100%", }

})