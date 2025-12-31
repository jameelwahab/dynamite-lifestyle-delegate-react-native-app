import Modal from 'react-native-modal';
import {forwardRef, useState, useImperativeHandle, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {STRINGS} from '../../../utilities/strings';
import {colors} from '../../../utilities/colors';
import {icons} from '../../../utilities/icons';
import {NOITFY_USERS} from '../../../DAL';
import showToast from '../../../functions/showToast';
import MyText from '../../../components/MyText';
import {MyButton} from '../../../components/MyButton';
import MyInputs from '../../../components/MyInputs';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import Toast from 'react-native-toast-message';

const NotifyUser = forwardRef(({navigation, token}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [notify, setNotify] = useState({state: '', desc: '', id: ''});
  const ref_input = useRef(null);
  const {height, width} = useWindowDimensions();
  const [mentionList, setMentionList] = useState([]);
  const [loading, setLoading] = useState(false);

  const openModal = id => {
    setNotify({...notify, id});
    setIsVisible(true);
  };

  const closeModal = () => {
    setNotify({state: '', desc: '', id: ''});
    setIsVisible(false);
    setLoading(false);
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal,
      };
    },
    [],
  );

  const handlePress = async () => {
    if (notify.state == '' || notify.desc == '') {
      showToast({
        title: STRINGS.NOTIFY_USER.info,
        body: STRINGS.NOTIFY_USER.emptyFieldsMessage,
      });
    } else {
      setLoading(true);
      const result = await NOITFY_USERS({
        token,
        navigation,
        id: notify.id,
        notify_state: notify.state,
        notify_desc: notify.desc,
      });

      if (result.code == 200) {
        setLoading(false);
        closeModal();
      } else {
        setLoading(false);
      }
    }
  };

  const replaceAndHighlight = str => {
    let parts = [];
    let lastIndex = 0;
    mentionList.forEach(user => {
      let startIndex = user?.offset;
      let endIndex = user?.offset + user?.length;
      if (lastIndex < startIndex) {
        parts.push(str.slice(lastIndex, startIndex));
      }
      parts.push(
        <Text style={__style.mentionUserText}>
          {str.substring(startIndex, endIndex)}
        </Text>,
      );
      lastIndex = endIndex;
    });

    if (lastIndex < str?.length) {
      parts.push(str.slice(lastIndex));
    }

    return parts;
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={300}
      hideModalContentWhileAnimating={true}
      style={__styles.modalMargin}
      avoidKeyboard={true}>
      <View style={__styles.modalRootView}>
        <Row>
          <Flex flex={1}>
            <MyText fontSize={20} type="bold">
              {STRINGS.NOTIFY_USER.notifyUsers}
            </MyText>
          </Flex>
          <Pressable style={__styles.closeButton} onPress={closeModal}>
            {icons.crosss(colors.white, 17)}
          </Pressable>
        </Row>

        <View style={__styles.divider} />

        <View style={__styles.emptyView}>
          <MyInputs
            label={STRINGS.NOTIFY_USER.notificationStatement}
            value={notify?.state}
            onChangeText={text => setNotify({...notify, state: text})}
          />

          <MyInputs
            label={STRINGS.NOTIFY_USER.notificationDescription}
            value={notify?.desc}
            onChangeText={text => setNotify({...notify, desc: text})}
            multiline={true}
          />
        </View>

        <View style={__styles.emptyView}>
          <MyButton
            loading={loading}
            onPress={handlePress}
            invert={true}
            title={
              loading ? STRINGS.NOTIFY_USER.posting : STRINGS.NOTIFY_USER.post
            }
          />
        </View>
      </View>
      {isVisible && <Toast />}
    </Modal>
  );
});

const __styles = StyleSheet.create({
  modalRootView: {
    backgroundColor: colors.secondaryVariant,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginHorizontal: 10,

    // paddingVertical: 10,
    // paddingHorizontal: 20
  },
  heading_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: 10,
    // paddingHorizontal: 15,
    borderColor: colors.border,
    borderBottomWidth: 1,
    // marginBottom: 10,
  },
  modalInput: {
    // minHeight: 70,
    // maxHeight: 150,
    // borderRadius: 10,
    // marginTop: 10,
    // padding: 10,
    // paddingTop: 10,
    // color: colors.lightText
  },
  modalMargin: {
    margin: 0,
  },
  closeButton: {
    backgroundColor: colors.secondary,
    height: 25,
    width: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  emptyView: {},
  mentionUserText: {
    color: colors.primary,
  },
});

export default NotifyUser;
