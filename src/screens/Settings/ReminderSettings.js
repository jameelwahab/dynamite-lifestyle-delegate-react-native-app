import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser, setConsultant} from '../../redux/reducers/userSlice';
import {colors} from '../../utilities/colors';
import {STRINGS} from '../../utilities/strings';
import Editor from '../../components/Editor';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import MyTouchableInput from '../../components/MyTouchableInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {icons} from '../../utilities/icons';
import moment from 'moment';
import breakReference from '../../functions/breakReference';
import {MyButton} from '../../components/MyButton';
import ImagUploadView from '../../components/ImagUploadView';
import ImageUploadModal from '../../components/ImageUploadModal';
import {UPDATE_REMINDER_MESSAGES, UPLOAD_FILE_TO_S3} from '../../DAL';
import showToast from '../../functions/showToast';
import invokeApi from '../../functions/invokeAPI';
import MyLoader from '../../components/MyLoader';
import MyInputs from '../../components/MyInputs';
import {Flex} from '../../UIComponents/FlexViews';
import InfoModal from '../../components/InfoModal';

const ReminderSettings = ({navigation}) => {
  const ref_infoModal = React.useRef();
  const dispatch = useDispatch();
  const {user, token} = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState(
    user?.welcome_reminder_setting.length == 0
      ? [
          {
            ...reminderObj,
          },
        ]
      : JSON.parse(JSON.stringify(user?.welcome_reminder_setting)),
  );
  const [datePicker, setDatePicker] = useState({
    isVisible: false,
    index: -1,
    time: '',
  });
  const [image, setImage] = useState({isVisible: false, index: -1, file: ''});
  const list_length = list.length;

  const hideDatePicker = () => {
    setDatePicker({index: -1, isVisible: false, time: ''});
  };
  const openDatePicker = (index, time) => {
    Keyboard.dismiss();
    setDatePicker({index: index, isVisible: true, time});
  };

  const handleConfirm = date => {
    itemHander({
      type: 'notify_time',
      value: moment(date).format('HH:mm'),
      index: datePicker.index,
    });
    hideDatePicker();
  };

  const itemHander = ({type, value, index}) => {
    list[index] = {...list[index], [type]: value};
    setList([...list]);
  };

  const removeOrAddReminder = (type, index) => {
    if (type == 'remove') {
      list.splice(index, 1);
    } else if (type == 'add') {
      list.push(breakReference(reminderObj));
    }
    setList([...list]);
  };

  const selectImage = index => {};

  const onPicked = async selectedImage => {
    let formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('height', selectedImage?.height);
    formData.append('width', selectedImage?.width);
    let res = await UPLOAD_FILE_TO_S3({
      body: formData,
      navigation,
      token,
    });
    if (res.code == 200) {
      itemHander({type: 'image', value: res?.image_path, index: image.index});
    } else {
      showToast({
        title: STRINGS.REMINDER_SETTINGS.imageUploadFailed,
        type: 'error',
      });
    }
  };

  const btn_update = async () => {
    try {
      for (let i = 0; i < list_length; i++) {
        let x = list[i];
        if (x?.reminder_days == '') {
          showToast({
            body: `Please enter After Days of Reminder # ${i + 1}`,
            type: 'info',
          });
          return;
        } else if (x?.message_type == 'image' && !!x?.image == false) {
          showToast({
            body: `Please upload Image of Reminder # ${i + 1}`,
            type: 'info',
          });
          return;
        } else if (x?.message_type == 'video' && !!x?.embed_code == false) {
          showToast({
            body: `Please enter the embed code of Reminder # ${i + 1} video`,
            type: 'info',
          });
          return;
        }
      }
      setLoader(true);
      let res = await UPDATE_REMINDER_MESSAGES({
        body: {welcome_reminder_setting: list},
        token,
        navigation,
      });
      setLoader(false);
      if (res.code == 200) {
        showToast({
          title: STRINGS.REMINDER_SETTINGS.updatedSuccessfully,
          body: res.message,
          type: 'success',
        });
        dispatch(setConsultant(res?.consultant));
        navigation.goBack();
      } else {
        showToast({title: res.message, type: 'error'});
      }
    } catch (error) {
      console.log(error, ' Error in btn_update ReminderSettings.js');
      setLoader(false);
    }
  };

  const UpdateButton = () => {
    return (
      <View style={__styles.updateButtonContainer}>
        <MyButton
          title={STRINGS.REMINDER_SETTINGS.update}
          onPress={btn_update}
        />
      </View>
    );
  };

  const renderReminders = useCallback(
    ({item, index}) => {
      return (
        <View style={__styles.itemRoot}>
          <View style={__styles.buttonRow}>
            {list_length > 1 && (
              <TouchableOpacity
                onPress={() => removeOrAddReminder('remove', index)}
                style={__styles.button}>
                {icons.minusCircle()}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => removeOrAddReminder('add', -1)}
              style={__styles.button}>
              {icons.plusCircle()}
            </TouchableOpacity>
          </View>

          <MyInputs
            label={STRINGS.REMINDER_SETTINGS.afterDays}
            value={item?.reminder_days.toString()}
            onChangeText={text =>
              itemHander({type: 'reminder_days', value: text, index})
            }
            keyboardType="number-pad"
          />
          <MyTouchableInput
            onPress={() => openDatePicker(index, item.notify_time)}
            label={STRINGS.REMINDER_SETTINGS.notifyTime}
            value={moment(item?.notify_time, 'HH:mm').format('hh:mm A')}
            icon={icons.clock}
          />

          {/* Messge Type */}

          <MyText isLabel={true}>
            {STRINGS.REMINDER_SETTINGS.messageType}
          </MyText>
          <View style={__styles.typeRoot}>
            {type.map((x, i) => (
              <>
                <TouchableOpacity
                  onPress={() =>
                    itemHander({type: 'message_type', value: x, index})
                  }
                  style={[
                    __styles.typeView,
                    item.message_type == x && __styles.selectedType,
                  ]}>
                  <MyText
                    style={[
                      __styles.textCapitalize,
                      item.message_type == x && __styles.selectedText,
                    ]}>
                    {x}
                  </MyText>
                </TouchableOpacity>
                {(i == 0 || i == 1) && <View style={__styles.sepeartor} />}
              </>
            ))}
          </View>

          {item.message_type == 'image' && (
            <ImagUploadView
              onPress={() => setImage({isVisible: true, index, file: ''})}
              viewStyle={__styles.imageView}
              alreadyUploaded={item?.image}
              label={STRINGS.REMINDER_SETTINGS.image}
            />
          )}

          {item.message_type == 'video' && (
            <MyInputs
              label={STRINGS.REMINDER_SETTINGS.embedCode}
              multiline={true}
              value={item?.embed_code}
              onChangeText={text =>
                itemHander({type: 'embed_code', value: text, index})
              }
            />
          )}

          <Editor
            label={STRINGS.REMINDER_SETTINGS.reminderMessage}
            height={200}
            backgroundColor={'#232c43'}
            initialValue={item.reminder_message}
            onChange={text =>
              itemHander({type: 'reminder_message', value: text, index})
            }
            autoResonderMsgs={autoMsgsList}
            viewAccrossLabel={() => (
              <TouchableOpacity
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                style={__styles.infoIconPadding}
                onPress={() =>
                  ref_infoModal.current.openModal(
                    STRINGS.REMINDER_SETTINGS.infoForEditor,
                    '',
                    true,
                  )
                }>
                {icons.info_filled(colors.primary, 15)}
              </TouchableOpacity>
            )}
          />
        </View>
      );
    },
    [JSON.stringify(list)],
  );

  return (
    <RootView
      hideNotificaitonIcon
      hideChatIcon
      hideProfile
      title={STRINGS.REMINDER_SETTINGS.title}>
      <View style={__styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          keyboardShouldPersistTaps={'always'}
          data={list}
          renderItem={renderReminders}
          ListFooterComponent={UpdateButton}
          contentContainerStyle={__styles.flatListContent}
        />
      </View>
      <DateTimePickerModal
        isVisible={datePicker.isVisible}
        mode="time"
        date={moment(datePicker.time, 'HH:mm').toDate()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <ImageUploadModal
        isVisible={image.isVisible}
        onImagePicked={onPicked}
        closeModal={() => setImage({isVisible: false, index: -1})}
      />
      <MyLoader enable={loader} />
      <InfoModal ref={ref_infoModal} />
    </RootView>
  );
};

export default ReminderSettings;
const type = [
  STRINGS.REMINDER_SETTINGS.typeGeneral,
  STRINGS.REMINDER_SETTINGS.typeImage,
  STRINGS.REMINDER_SETTINGS.typeVideo,
];
const autoMsgsList = [
  {title: STRINGS.REMINDER_SETTINGS.autoMsgFirstName, message: '{first_name}'},
  {title: STRINGS.REMINDER_SETTINGS.autoMsgLastName, message: '{last_name}'},
  {title: STRINGS.REMINDER_SETTINGS.autoMsgFullName, message: '{full_name}'},
];

const reminderObj = {
  reminder_days: '0',
  notify_time: '00:00',
  message_type: 'general',
  embed_code: '',
  image: '',
  reminder_message: '',
  title: '',
};

const __styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: 30,
  },
  updateButtonContainer: {
    paddingHorizontal: 10,
  },
  itemRoot: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  typeView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  selectedType: {
    backgroundColor: colors.primary2,
  },
  selectedText: {
    color: colors.black,
    fontWeight: '500',
  },
  textCapitalize: {
    textTransform: 'capitalize',
  },
  typeRoot: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.lightText2,
    overflow: 'hidden',
    borderRadius: 5,
    height: 40,
    marginBottom: 15,
  },
  sepeartor: {
    height: '100%',
    width: 1,
    backgroundColor: colors.lightText2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 5,
  },
  imageView: {
    borderColor: colors.lightText2,
  },
  infoIconPadding: {
    padding: 5,
  },
});
