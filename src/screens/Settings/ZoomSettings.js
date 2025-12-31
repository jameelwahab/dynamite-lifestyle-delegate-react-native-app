import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../components/RootView';
import {MyButton} from '../../components/MyButton';
import MyLoader from '../../components/MyLoader';
import {CHANGE_ZOOM_CRED} from '../../DAL';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, setConsultant} from '../../redux/reducers/userSlice';
import showToast from '../../functions/showToast';
import {STRINGS} from '../../utilities/strings';
import MyInputs from '../../components/MyInputs';

const ZoomSettings = ({navigation}) => {
  const {token, user} = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [publicKey, setPublicKey] = useState(user?.zoom_api_key);
  const [secretKey, setSecretKey] = useState(user?.zoom_api_secret);
  const [accountId, setAccountId] = useState(user?.zoom_account_id);
  const btn_submit = async () => {
    setLoader(true);
    let cred = {
      zoom_account_id: accountId.trim(),
      zoom_api_key: publicKey.trim(),
      zoom_api_secret: secretKey.trim(),
    };
    let res = await CHANGE_ZOOM_CRED({
      body: cred,
      navigation,
      token,
    });
    setLoader(false);
    if (res.code == 200) {
      dispatch(setConsultant(res?.consultant_user));
      showToast({
        title: STRINGS.ZOOM_SETTINGS.updatedSuccessfully,
        type: 'success',
      });
      navigation.goBack();
    }
  };

  return (
    <RootView
      hideNotificaitonIcon
      hideChatIcon
      hideProfile
      title={STRINGS.ZOOM_SETTINGS.title}>
      <View style={__styles.container}>
        <MyInputs
          label={STRINGS.ZOOM_SETTINGS.publicKey}
          value={publicKey}
          onChangeText={text => setPublicKey(text)}
        />

        <MyInputs
          label={STRINGS.ZOOM_SETTINGS.secretKey}
          value={secretKey}
          onChangeText={text => setSecretKey(text)}
        />

        <MyInputs
          label={STRINGS.ZOOM_SETTINGS.accountId}
          value={accountId}
          onChangeText={text => setAccountId(text)}
        />

        <View style={__styles.buttonContainer}>
          <MyButton
            invert
            title={STRINGS.ZOOM_SETTINGS.submit}
            onPress={btn_submit}
          />
        </View>

        <MyLoader enable={loader} />
      </View>
    </RootView>
  );
};

export default ZoomSettings;

const __styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    marginHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
