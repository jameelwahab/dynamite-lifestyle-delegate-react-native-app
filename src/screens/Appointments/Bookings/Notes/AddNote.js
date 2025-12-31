import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../../../components/RootView';
import {colors} from '../../../../utilities/colors';
import Editor from '../../../../components/Editor';
import MyLoader from '../../../../components/MyLoader';
import {MyButton} from '../../../../components/MyButton';
import {icons} from '../../../../utilities/icons';
import showToast from '../../../../functions/showToast';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../../redux/reducers/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyText from '../../../../components/MyText';
import {BOOKING_NOTES_ADD, BOOKING_NOTES_UPDATE} from '../../../../DAL';
import MyCheckBox from '../../../../components/MyCheckBox';
import {STRINGS} from '../../../../utilities/strings';

const AddNote = ({navigation, route}) => {
  const defaultNote = `<p><span style="font-weight: bold;">BIO:</span> <br /><br /><span style="font-weight: bold;">GOAL:</span> <br /><br /><span style="font-weight: bold;">PARADIGM:</span> <br /><br /><span style="font-weight: bold;">SOLUTION:</span> </p>`;
  const {bookingId} = route?.params;
  const {token} = useSelector(selectUser);
  const {note: oldNote, memberId, autoResponderMsg} = route?.params;

  const [note, setNote] = useState(!!oldNote ? oldNote?.note : defaultNote);
  const [loader, setLoader] = useState(false);
  const [addAsPersonalNote, setAddAsPersonalNote] = useState(false);
  const btn_save = () => {
    if (note.trim() == '') {
      showToast({body: STRINGS.ADD_NOTE.enterNote, type: 'info'});
    } else {
      setLoader(true);
      addTheNote();
    }
  };

  const addTheNote = async () => {
    let res;
    if (!oldNote) {
      res = await BOOKING_NOTES_ADD({
        token,
        navigation,
        body: {
          add_as_personal_note: addAsPersonalNote,
          booking_id: bookingId,
          note: note,
        },
      });
    } else {
      res = await BOOKING_NOTES_UPDATE({
        token,
        navigation,
        id: oldNote?._id,
        note: note,
      });
    }
    setLoader(false);
    if (res.code == 200) {
      route?.params?.refresh?.();
      navigation.goBack();
    }
  };

  return (
    <RootView hideHeader>
      <KeyboardAwareScrollView>
        <View>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.closeBtnView}>
              {icons.back(colors.primary, 25)}
            </TouchableOpacity>
            <MyText fontSize={18} color={colors.primary} type="bold">
              {' '}
              {!!oldNote
                ? STRINGS.ADD_NOTE.editNote
                : STRINGS.ADD_NOTE.addNote}{' '}
            </MyText>
          </View>

          <View style={styles.editorContainer}>
            {!oldNote && (
              <View style={styles.checkboxContainer}>
                <MyCheckBox
                  value={addAsPersonalNote}
                  onPress={() => setAddAsPersonalNote(!addAsPersonalNote)}
                  title={STRINGS.ADD_NOTE.addToPersonalNotes}
                />
              </View>
            )}
            <Editor
              initialValue={note}
              height={200}
              onChange={text => setNote(text)}
              autoResonderMsgs={autoResponderMsg}
            />

            <View style={styles.buttonContainer}>
              <MyButton
                onPress={() => navigation.goBack()}
                invert
                title={STRINGS.ADD_NOTE.cancel}
                style={styles.cancelButton}
              />

              <MyButton
                invert
                title={
                  !!oldNote ? STRINGS.ADD_NOTE.update : STRINGS.ADD_NOTE.save
                }
                onPress={btn_save}
                style={styles.saveButton}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default AddNote;

const styles = StyleSheet.create({
  closeBtnView: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editorContainer: {
    flex: 1,
    marginTop: 20,
  },
  checkboxContainer: {
    marginBottom: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 10,
    marginRight: 10,
  },
  saveButton: {
    paddingHorizontal: 10,
  },
});
