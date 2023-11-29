import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import MyText from '../MyText'
import utilities from '../../utilities'
import { fonts } from '../../utilities/fonts'
import { icons } from '../../utilities/icons'
import { colors } from '../../utilities/colors'
import { useNavigation } from '@react-navigation/native'
import routes from '../../navigation/routes'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOGOUT } from '../../DAL'
import copyText from '../../functions/copyText'


const ProfileDropDown = ({ isVisible = false, closeModal = () => { }, user }) => {
  const navigation = useNavigation();


  const logoutBtn = async () => {
    try {
      let token = await AsyncStorage.getItem("@token");
      let res = await LOGOUT({ token, navigation });
      await AsyncStorage.multiRemove(["@token", "@user"])
    } catch (error) {
      console.log(error, "error removing asyncStorage")
    }

    closeModal()

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: routes.login }]
      })
    }, 500);
  }


  const optionsView = (icon, text, func) => {
    return (
      <TouchableOpacity
        onPress={func}
        style={{
          flexDirection: 'row',
          padding: 15,
          alignItems: 'center',
        }}>
        {typeof icon == "function" ?
          icon() :
          <Image
            source={icon}
            style={{ height: 17, width: 17, tintColor: colors.golden }}
          />}
        <MyText style={{ marginLeft: 14 }}>
          {text}
        </MyText>
      </TouchableOpacity>
    )
  }

  const navigateTo = (screen) => {
    closeModal()
    navigation.navigate(screen)
  }


  const copyTheText = (text1, text2) => {
    copyText(text1, text2);
    closeModal()
  }


  return (
    <Modal
      isVisible={isVisible}
      animationIn={'zoomInDown'}
      animationOut={'zoomOutDown'}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      backdropOpacity={0}
      animationInTiming={300}
      animationOutTiming={300}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      style={__styles.modal}>
      <View
        style={__styles.modalView}>
        <View style={__styles.profileView}>
          <View style={__styles.profileInnnerView}>
            <View style={{ flex: 1 }}>
              <MyText type='medium'>
                {user?.first_name + " " + user?.last_name}
              </MyText>
              <MyText fontSize={13} style={{ marginTop: 3 }}>
                {user?.email}
              </MyText>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>

          {optionsView(icons.user, "Edit Profile", () => navigateTo(routes.editProfile))}
          {optionsView(icons.copy, "Copy Refferal Id", () => copyTheText(user?.affiliate_url_name, "Refferal Id Copied"))}
          {optionsView(icons.copy, "Copy App Refferal Id", () => copyTheText(user?.affiliate_link, "App Refferal Id Copied"))}
          {optionsView(icons.gear, "Settings", () => navigateTo(routes.otherSettings))}

          <TouchableOpacity
            onPress={logoutBtn}
            style={__styles.btnView}>
            <MyText>
              Logout
            </MyText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

}



export default ProfileDropDown

const __styles = StyleSheet.create({
  modal: {
    alignSelf: 'flex-end',
    height: utilities.screenHeight(),
  },
  modalView: {
    width: '64%',
    borderRadius: 8,
    backgroundColor: colors.secondary,
    position: 'absolute',
    right: 0,
    top: utilities.isAndroid() ? 40 : 90,
    borderWidth: 0.5,
    borderColor: colors.border,
    shadowColor: colors.border,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
  profileView: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    padding: 16,
  },
  profileInnnerView: {
    flexDirection: "row",
    alignItems: "center"
  },
  btnView: {
    height: 40,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: colors.border,
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: 13,
    marginTop: 10,
  },

})