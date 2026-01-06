import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import MyInputs from '../../components/MyInputs';
import {MyButton} from '../../components/MyButton';
import routes from '../../navigation/routes';
import AuthHeader from '../../components/AuthHeader';
import MyLoader from '../../components/MyLoader';
import {isEmailValid} from '../../functions/regex';
import showToast from '../../functions/showToast';
import {SEND_OTP} from '../../DAL';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {STRINGS} from '../../utilities/strings';

const ForgotPassword = ({navigation}) => {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');

  onOPTScreen = async () => {
    if (email.trim() == '') {
      showToast({body: STRINGS.FORGOT_PASSWORD.enterEmail});
    } else if (!isEmailValid(email)) {
      showToast({body: STRINGS.FORGOT_PASSWORD.enterValidEmail});
    } else {
      setLoader(true);
      let fd = new FormData();
      fd.append('email', email);
      let res = await SEND_OTP({body: fd});
      setLoader(false);
      if (res.code == 200) {
        navigation.navigate(routes.optScreen, {
          email: email,
        });
      }
    }
  };

  return (
    <RootView hideHeader>
      <AuthHeader />
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <MyText fontSize={28} type="medium">
              {STRINGS.FORGOT_PASSWORD.title}
            </MyText>
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <MyInputs
                  label={STRINGS.FORGOT_PASSWORD.emailLabel}
                  value={email}
                  keyboardType="email-address"
                  onChangeText={text => setEmail(text)}
                />
              </View>

              <MyButton
                title={STRINGS.FORGOT_PASSWORD.submitButton}
                onPress={onOPTScreen}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <MyLoader enable={loader} />
    </RootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginHorizontal: 10,
    marginTop: '45%',
  },
  formContainer: {
    marginTop: 0,
  },
  inputWrapper: {
    marginVertical: 20,
  },
});

export default ForgotPassword;
