import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import RootView from '../../components/RootView';
import MyInputs from '../../components/MyInputs';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, setConsultant} from '../../redux/reducers/userSlice';
import {MyButton} from '../../components/MyButton';
import MyKeyboardAvoidingView from '../../components/MyKeyboardAvoidingView';
import showToast from '../../functions/showToast';
import MyLoader from '../../components/MyLoader';
import {CHANGE_AFFILIATE_NAME} from '../../DAL';
import InfoModal from '../../components/InfoModal';
import TitleView from '../../components/TitleView';
import {icons} from '../../utilities/icons';
import {colors} from '../../utilities/colors';
import {STRINGS} from '../../utilities/strings';
import {Flex} from '../../UIComponents/FlexViews';

const ChangeAffiliateId = ({navigation}) => {
  const ref_info = useRef();
  const {user, token} = useSelector(selectUser);
  const dispatch = useDispatch();
  const [affiliateId, setAffiliateId] = useState(
    !!user.affiliate_url_name ? user.affiliate_url_name : '',
  );
  const [loader, setLoader] = useState(false);

  const onSavePress = () => {
    if (affiliateId.trim() == '') {
      showToast({
        title: STRINGS.CHANGE_AFFILIATE_ID.alert,
        body: STRINGS.CHANGE_AFFILIATE_ID.pleaseEnterAffiliateId,
      });
    } else {
      saveAffiliateId();
    }
  };

  const saveAffiliateId = async () => {
    setLoader(true);
    let res = await CHANGE_AFFILIATE_NAME({
      token,
      navigation,
      consultantId: user?._id,
      newAffiliateName: affiliateId.trim(),
    });

    if (res.code == 200) {
      showToast({title: res?.message, type: 'success'});
      let newUserObj = {
        ...user,
        affiliate_url_name: res?.affiliate_url_name,
      };
      dispatch(setConsultant(newUserObj));
      setLoader(false);
      navigation.goBack();
    } else {
      setLoader(false);
    }
  };

  const titleView = () => {
    return (
      <View style={__style.titleViewContainer}>
        <Flex flex={1}>
          <TitleView title={STRINGS.CHANGE_AFFILIATE_ID.title} />
        </Flex>
        <TouchableOpacity
          onPress={() =>
            ref_info?.current?.openModal(STRINGS.CHANGE_AFFILIATE_ID.note)
          }
          style={__style.iconBtn}>
          {icons.info(colors.primary, 12)}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <RootView
      hideBackBottomButton
      hideChatIcon
      hideNotificaitonIcon
      hideProfile
      titleView={titleView}>
      <MyKeyboardAvoidingView>
        <MyInputs
          label={STRINGS.CHANGE_AFFILIATE_ID.affiliateId}
          value={affiliateId}
          onChangeText={text => setAffiliateId(text)}
        />

        <View>
          <MyButton
            title={STRINGS.CHANGE_AFFILIATE_ID.save}
            onPress={onSavePress}
          />
        </View>
      </MyKeyboardAvoidingView>
      <MyLoader enable={loader} />
      <InfoModal ref={ref_info} />
    </RootView>
  );
};

export default ChangeAffiliateId;

const __style = StyleSheet.create({
  titleViewContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  iconBtn: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
