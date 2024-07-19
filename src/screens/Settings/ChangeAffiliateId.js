import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import RootView from '../../components/RootView'
import MyInputs from '../../components/MyInputs'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser, setConsultant } from '../../redux/reducers/userSlice'
import { MyButton } from '../../components/MyButton'
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView'
import showToast from '../../functions/showToast'
import MyLoader from '../../components/MyLoader'
import { CHANGE_AFFILIATE_NAME } from '../../DAL'
import InfoModal from '../../components/InfoModal'
import TitleView from '../../components/TitleView'
import { icons } from '../../utilities/icons'
import { colors } from '../../utilities/colors'

const ChangeAffiliateId = ({ navigation }) => {
  const ref_info = useRef();
  const { user, token } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [affiliateId, setAffiliateId] = useState(!!user.affiliate_url_name ? user.affiliate_url_name : "");
  const [loader, setLoader] = useState(false);


  const onSavePress = () => {
    if (affiliateId.trim() == "") {
      showToast({ title: "Alert", body: "Please enter your affiliate Id" })
    } else {
      saveAffiliateId()
    }
  }

  const saveAffiliateId = async () => {
    setLoader(true);
    let res = await CHANGE_AFFILIATE_NAME({ token, navigation, consultantId: user?._id, newAffiliateName: affiliateId.trim() });

    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      let newUserObj = {
        ...user,
        affiliate_url_name: res?.affiliate_url_name
      }
      dispatch(setConsultant(newUserObj))
      setLoader(false);
      navigation.goBack()
    } else {
      setLoader(false);
    }
  }

  const titleView = () => {
    return (
      <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
        <View style={{ flex: 1 }}>
          <TitleView title={"Change Affiliate Id"} />
        </View>
        <TouchableOpacity
          onPress={() => ref_info?.current?.openModal(note)}
          style={__style.iconBtn}>
          {icons.info(colors.primary, 12)}
        </TouchableOpacity>

      </View>
    )
  }

  return (
    <RootView
      hideBackBottomButton
      titleView={titleView}
    >
      <MyKeyboardAvoidingView>
        <MyInputs
          label='Affiliate Id*'
          value={affiliateId}
          onChangeText={(text) => setAffiliateId(text)}
        />

        <View >
          <MyButton title='Save'
            onPress={onSavePress}
          />
        </View>
      </MyKeyboardAvoidingView>
      <MyLoader enable={loader} />
      <InfoModal ref={ref_info} />
    </RootView>
  )
}

export default ChangeAffiliateId


const note = `If you change your affiliate ID, the links you have already shared on your social media platforms will not be affected directly. However, any new members who use those old links will not be associated with you, as the ID has changed.\n\nTherefore, every time you change your affiliate ID, you will need to share the updated links again. It is important to update your affiliate ID at your own risk, knowing that the previously shared links will no longer track new leads to your account.`

const __style = StyleSheet.create({
  iconBtn: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center"
  }
})