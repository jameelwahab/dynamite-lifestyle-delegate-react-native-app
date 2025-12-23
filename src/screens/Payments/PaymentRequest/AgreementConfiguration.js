import {Pressable, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import RootView from '../../../components/RootView';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import MyText from '../../../components/MyText';
import {__agreementConfigurationStyles} from './__style';
import {colors} from '../../../utilities/colors';
import {icons} from '../../../utilities/icons';
import OptionModal from '../../../components/OptionModal';
import {MyButton} from '../../../components/MyButton';
import Editor from '../../../components/Editor';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  GET_PAYMENT_CONFIGURATION_DETAIL,
  UPDATE_AGREEMENT_CONFIGURATION,
} from '../../../DAL/Payments';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {useNavigation} from '@react-navigation/native';
import showToast from '../../../functions/showToast';
import MyLoader from '../../../components/MyLoader';

const AgreementConfiguration = ({route}) => {
  const paramsForAgreementConfig = route?.params?.paramsForAgreementConfig;
  const {token} = useSelector(selectUser);
  const navigation = useNavigation();

  const [loader, setLoader] = React.useState(false);
  const [optionModalVisible, setOptionModalVisible] = React.useState(false);
  const [agreementDescription, setAgreementDescription] = React.useState('');
  const [agreementAlertDescription, setAgreementAlertDescription] =
    React.useState('');
  const [selectedItem, setSelectedItem] = React.useState({});

  const editorView = () => {
    return (
      <Flex style={__agreementConfigurationStyles.editor_container}>
        <Flex style={__agreementConfigurationStyles.editor_lable}>
          <MyText>Agreement Description*</MyText>
        </Flex>
        <Editor
          height={150}
          onChange={text => setAgreementDescription(text)}
          initialValue={agreementDescription}
        />
        <Flex
          style={[
            __agreementConfigurationStyles.editor_lable,
            {marginTop: 10},
          ]}>
          <MyText>Agreement Alert Description*</MyText>
        </Flex>
        <Editor
          height={150}
          onChange={text => setAgreementAlertDescription(text)}
          initialValue={agreementAlertDescription}
        />
      </Flex>
    );
  };

  const formVlalidation = () => {
    if (selectedItem?.value == false) {
      updateAgreementConfiguration();
      return;
    }
    if (selectedItem?.value == true) {
      if (!agreementDescription || agreementDescription.trim() == '') {
        showToast({
          body: 'Agreement Description is Required',
          title: 'Error',
          type: 'error',
        });
        return;
      }
      if (
        !agreementAlertDescription ||
        agreementAlertDescription.trim() == ''
      ) {
        showToast({
          body: 'Agreement Alert Description is Required',
          title: 'Error',
          type: 'error',
        });
        return;
      }
    }

    updateAgreementConfiguration();
  };

  const getAgreementConfiguration = async () => {
    try {
      setLoader(true);
      let res = await GET_PAYMENT_CONFIGURATION_DETAIL({
        token,
        navigation,
        id: paramsForAgreementConfig?.paymentRequestId,
      });
      if (res?.code == 200) {
        setAgreementDescription(
          res?.payment_request?.agreement_config?.agreement_description,
        );
        setAgreementAlertDescription(
          res?.payment_request?.agreement_config?.agreement_alert_description,
        );
        setSelectedItem({
          title: res?.payment_request?.agreement_config?.is_sign_agreement
            ? 'Yes'
            : 'No',
          value: res?.payment_request?.agreement_config?.is_sign_agreement,
        });
      }
    } catch (error) {
      showToast({
        body: error?.message || 'Something went wrong',
      });
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  const updateAgreementConfiguration = async () => {
    let data = {
      show_agreement_page: selectedItem?.value,
      ...(selectedItem?.value && {
        agreement_description: agreementDescription,
        agreement_alert_description: agreementAlertDescription,
      }),
    };

    try {
      setLoader(true);
      let res = await UPDATE_AGREEMENT_CONFIGURATION({
        token,
        navigation,
        slug: paramsForAgreementConfig?.paymentRequestSlug,
        data,
      });
      if (res?.code == 200) {
        showToast({
          body: 'Agreement Configuration updated successfully',
          title: 'Success',
          type: 'success',
        });
        navigation.goBack();
        setLoader(false);
      }
    } catch (error) {
      showToast({
        body: error?.message || 'Something went wrong',
        title: 'Error',
        type: 'error',
      });
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAgreementConfiguration();
  }, []);
  return (
    <RootView title="Agreement Configuration">
      <Flex flex={1}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Row>
            <Pressable
              onPress={() => setOptionModalVisible(true)}
              style={[
                __agreementConfigurationStyles.lvlbtnView,
                {flex: 1, marginRight: 10},
              ]}>
              <View style={__agreementConfigurationStyles.levlBtnLabel}>
                <MyText color={colors.lightText2} fontSize={12}>
                  Show Agreement Page*
                </MyText>
              </View>
              <MyText type={'medium'} style={{textTransform: 'capitalize'}}>
                {selectedItem.title}
              </MyText>
              {icons.down(colors.lightText2)}
            </Pressable>
          </Row>

          {/*=====Editor View=====*/}
          {selectedItem?.value == true && editorView()}
          <MyButton
            title="Update"
            style={{marginTop: 20}}
            onPress={formVlalidation}
          />
        </KeyboardAwareScrollView>
      </Flex>
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModalVisible}
        optionList={agreementList}
        onSelected={item => {
          setSelectedItem(item);
          setOptionModalVisible(false);
        }}
        closeModal={() => setOptionModalVisible(false)}
        checkSelected={item => item.value == selectedItem?.value}
      />
    </RootView>
  );
};

export default AgreementConfiguration;
const agreementList = [
  {
    title: 'Yes',
    value: true,
  },
  {
    title: 'No',
    value: false,
  },
];

const styles = StyleSheet.create({});
