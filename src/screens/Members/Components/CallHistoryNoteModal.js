import {View, SafeAreaView, Pressable, StyleSheet} from 'react-native';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import {icons} from '../../../utilities/icons';
import MyText from '../../../components/MyText';
import MyTouchableInput from '../../../components/MyTouchableInput';
import {MyButton} from '../../../components/MyButton';
import {ADD_CALL_HISTORY_NOTE} from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import showToast from '../../../functions/showToast';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {dateTimeFormat} from '../../../utilities/constants';
import Editor from '../../../components/Editor';
import MyCheckBox from '../../../components/MyCheckBox';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CalendarModal from '../../../components/CalendarModal';

const CallHistoryNoteModal = forwardRef(({memberId, updateCallNotes}, ref) => {
  const navigation = useNavigation();
  const ref_calendar = useRef();
  const {token} = useSelector(selectUser);
  const [isVisible, setIsVisible] = useState(false);
  const [loader, setLoader] = useState(false);

  const [date, setDate] = useState(moment());
  const [addAsPersonalNote, setAddAsPersonalNote] = useState(false);
  const [note, setNote] = useState('');

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal,
      };
    },
    [],
  );

  const openModal = () => {
    setDate(moment());
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const validate = () => {
    if (note.trim() == '') {
      showToast({
        title: STRINGS.CALL_HISTORY_NOTE_MODAL.alertTitle,
        type: 'info',
        body: STRINGS.CALL_HISTORY_NOTE_MODAL.noteEmpty,
      });
      return;
    }
    addNotesToServer();
  };

  const addNotesToServer = async () => {
    setLoader(true);
    let res = await ADD_CALL_HISTORY_NOTE({
      navigation,
      token,
      memberId,
      body: {
        date: moment(date).format(STRINGS.DATE_FORMATES.YYYY_MM_DD),
        is_add_to_personal_notes: addAsPersonalNote,
        is_checked: true,
        notes: note.trim(),
      },
    });
    if (res.code == 200) {
      updateCallNotes?.(res?.call_history, memberId);
      closeModal?.();
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={300}
      animationOutTiming={300}
      style={styles.modalContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <MyText fontSize={18} type="medium">
              {STRINGS.CALL_HISTORY_NOTE_MODAL.title}
            </MyText>
          </View>
          <Pressable onPress={closeModal}>{icons.crosssWithCircle()}</Pressable>
        </View>
        <View style={styles.contentContainer}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <MyTouchableInput
              label={STRINGS.CALL_HISTORY_NOTE_MODAL.date}
              icon={() => icons.calendar(colors.primary)}
              value={moment(date).format(dateTimeFormat.date)}
              onPress={() => ref_calendar?.current?.openModal(date)}
            />

            <View style={styles.radioRootView}>
              <MyText isLabel>
                {STRINGS.CALL_HISTORY_NOTE_MODAL.addToPersonalNotes}
              </MyText>
              <View style={styles.radioView}>
                <View style={styles.radioItem}>
                  <MyCheckBox
                    title={STRINGS.CALL_HISTORY_NOTE_MODAL.yes}
                    onPress={() => setAddAsPersonalNote(true)}
                    value={addAsPersonalNote}
                  />
                </View>
                <View style={styles.radioItem}>
                  <MyCheckBox
                    title={STRINGS.CALL_HISTORY_NOTE_MODAL.no}
                    onPress={() => setAddAsPersonalNote(false)}
                    value={!addAsPersonalNote}
                  />
                </View>
              </View>
            </View>

            <Editor
              label={STRINGS.CALL_HISTORY_NOTE_MODAL.note}
              height={150}
              initialValue={note}
              onChange={text => setNote(text)}
            />

            <MyButton
              title={STRINGS.CALL_HISTORY_NOTE_MODAL.submit}
              onPress={validate}
            />
          </KeyboardAwareScrollView>
        </View>

        <MyLoader enable={loader} />
        <CalendarModal
          ref={ref_calendar}
          onDateSelected={date => setDate(date)}
        />
      </SafeAreaView>
      {isVisible && <Toast />}
    </Modal>
  );
});

export default CallHistoryNoteModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    margin: 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.secondaryVariant,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1 / 3,
    borderBottomColor: colors.lightText,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  radioRootView: {
    marginBottom: 15,
  },
  radioView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,
  },
});
