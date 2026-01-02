import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import routes from '../../navigation/routes';
import {MyButton} from '../../components/MyButton';
import AuthHeader from '../../components/AuthHeader';
import MyLoader from '../../components/MyLoader';
import showToast from '../../functions/showToast';
import {RESET_PASSWORD} from '../../DAL';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyInputs from '../../components/MyInputs';
import {encryptPassword} from '../../functions/encryptPassword';
import {Flex} from '../../UIComponents/FlexViews';
import {STRINGS} from '../../utilities/strings';

const ResetPassword = ({navigation, route}) => {
  const [loader, setLoader] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onLoginScreen = async () => {
    if (newPassword == '') {
      showToast({body: STRINGS.RESET_PASSWORD.ENTER_NEW_PASSWORD});
    } else if (newPassword !== confirmPassword) {
      showToast({body: STRINGS.RESET_PASSWORD.PASSWORDS_DO_NOT_MATCH});
    } else {
      setLoader(true);
      let fd = new FormData();
      let enc_Password = encryptPassword(newPassword);
      fd.append('email', route.params?.email);
      fd.append('password', enc_Password);
      fd.append('confirm_password', enc_Password);

      let res = await RESET_PASSWORD({body: fd});
      setLoader(false);
      if (res.code == 200) {
        navigation.navigate(routes.login);
        showToast({title: res?.message, type: 'success'});
      }
    }
  };
  return (
    <RootView hideHeader>
      <AuthHeader />
      <Flex flex={1}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <MyText fontSize={28} type="medium">
              {STRINGS.RESET_PASSWORD.TITLE}
            </MyText>

            <View style={styles.inputContainer}>
              <MyInputs
                label={STRINGS.RESET_PASSWORD.NEW_PASSWORD}
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
                isPassword={true}
              />
            </View>
            <View>
              <MyInputs
                label={STRINGS.RESET_PASSWORD.CONFIRM_PASSWORD}
                isPassword={true}
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
              />
            </View>

            <MyButton
              title={STRINGS.RESET_PASSWORD.UPDATE}
              onPress={onLoginScreen}
            />
          </View>
        </KeyboardAwareScrollView>
      </Flex>
      <MyLoader enable={loader} />
    </RootView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: '45%',
  },
  inputContainer: {
    marginTop: 30,
  },
});

export default ResetPassword;
