import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../components/RootView';
import {MyButton} from '../../components/MyButton';
import showToast from '../../functions/showToast';
import MyLoader from '../../components/MyLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CHANGE_PASSWORD} from '../../DAL';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyInputs from '../../components/MyInputs';
import MyText from '../../components/MyText';
import {colors} from '../../utilities/colors';
import {STRINGS} from '../../utilities/strings';
import MyCheckBox from '../../components/MyCheckBox';
import routes from '../../navigation/routes';
import {encryptPassword} from '../../functions/encryptPassword';

const ChangePassword = ({navigation}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPasswrod, setConfirmPasswrod] = useState('');
  const [loader, setLoader] = useState(false);
  const [logoutFrom, setLogoutFrom] = useState('other_devices');

  const btn_save = async () => {
    // if (oldPassword == "") {
    //   showToast({ body: "Please enter your old password" });
    // } else
    if (newPassword == '') {
      showToast({body: STRINGS.CHANGE_PASSWORD.pleaseEnterNewPassword});
    } else if (confirmPasswrod != newPassword) {
      showToast({body: STRINGS.CHANGE_PASSWORD.passwordsDoNotMatch});
    } else {
      setLoader(true);
      let enc_Password = encryptPassword(newPassword);
      let body = {
        // old_password: oldPassword,
        password: enc_Password,
        confirm_password: enc_Password,
        logout_from: logoutFrom,
      };
      let token = await AsyncStorage.getItem('@token');
      let res = await CHANGE_PASSWORD({body, token, navigation});
      setLoader(false);
      if (res.code == 200) {
        if (res?.consultant_2fa_enabled) {
          navigation.navigate(routes.verifyAccount, {
            purpose: 'change-password',
            timer: res?.expiresIn,
            apiBody: {
              ...body,
              email: res?.tempData?.email,
              sessionId: res?.sessionId,
              action: res?.action,
              context: res?.context,
            },
          });
        } else {
          showToast({
            title: STRINGS.CHANGE_PASSWORD.passwordChangedTitle,
            body: STRINGS.CHANGE_PASSWORD.passwordChangedBody,
            type: 'success',
          });
          if (logoutFrom == 'all_devices') {
            await AsyncStorage.multiRemove(['token']);
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: routes.login,
                },
              ],
            });
          } else {
            navigation.goBack();
          }
        }
      }
    }
  };

  return (
    <RootView
      hideChatIcon
      hideProfile
      hideNotificaitonIcon
      title={STRINGS.CHANGE_PASSWORD.title}>
      <View style={__styles.flex1}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={__styles.container}>
            {/* <MyInputs
              isPassword={true}
              label='Old Password*'
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
            /> */}

            <MyInputs
              isPassword={true}
              label={STRINGS.CHANGE_PASSWORD.newPassword}
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
            />

            <MyInputs
              isPassword={true}
              label={STRINGS.CHANGE_PASSWORD.confirmPassword}
              value={confirmPasswrod}
              onChangeText={text => setConfirmPasswrod(text)}
            />

            <View style={__styles.marginTop10}>
              <MyText color={colors.primary} type="medium">
                {STRINGS.CHANGE_PASSWORD.securityQuestion}
              </MyText>

              <View style={__styles.marginTop15}>
                <MyCheckBox
                  circle
                  title={STRINGS.CHANGE_PASSWORD.logoutFromOtherDevices}
                  value={logoutFrom == 'other_devices'}
                  onPress={() => setLogoutFrom('other_devices')}
                />
                <View style={__styles.marginTop5}>
                  <MyCheckBox
                    circle
                    title={STRINGS.CHANGE_PASSWORD.logoutFromAllDevices}
                    value={logoutFrom == 'all_devices'}
                    onPress={() => setLogoutFrom('all_devices')}
                  />
                </View>
              </View>
            </View>

            <View style={__styles.marginTop15}>
              <MyButton
                onPress={btn_save}
                invert
                title={STRINGS.CHANGE_PASSWORD.save}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default ChangePassword;

const __styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop15: {
    marginTop: 15,
  },
  marginTop5: {
    marginTop: 5,
  },
});
