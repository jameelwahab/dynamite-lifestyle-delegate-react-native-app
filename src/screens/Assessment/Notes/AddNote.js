import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../../components/RootView';
import {colors} from '../../../utilities/colors';
import Editor from '../../../components/Editor';
import MyLoader from '../../../components/MyLoader';
import {MyButton} from '../../../components/MyButton';
import {icons} from '../../../utilities/icons';
import showToast from '../../../functions/showToast';
import {ASSESSMENT_NOTE_ADD, ASSESSMENT_NOTE_UPDATE} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyText from '../../../components/MyText';
import {STRINGS} from '../../../utilities/strings';
import {__assessmentNotesAddEditStyles} from '../__styles';

const AddNote = ({navigation, route}) => {
  const {token} = useSelector(selectUser);
  const oldNote = route?.params?.oldNote;
  const {assessmentId, type} = route?.params;
  const [note, setNote] = useState(
    !!oldNote ? oldNote?.internal_note_message : '',
  );
  const [loader, setLoader] = useState(false);

  const btn_save = () => {
    if (note.trim() == '') {
      showToast({
        body: STRINGS.ASSESSMENT_NOTES_ADD_EDIT.pleaseEnterNote,
        type: 'info',
      });
    } else {
      setLoader(true);
      addTheNote();
    }
  };

  const addTheNote = async () => {
    let res;
    if (!!oldNote) {
      res = await ASSESSMENT_NOTE_UPDATE({
        token,
        navigation,
        assessmentId,
        type,
        noteId: oldNote?._id,
        message: note,
      });
    } else {
      res = await ASSESSMENT_NOTE_ADD({
        token,
        navigation,
        assessmentId,
        type,
        message: note,
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
          <View style={__assessmentNotesAddEditStyles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={__assessmentNotesAddEditStyles.closeBtnView}>
              {icons.back(colors.primary, 25)}
            </TouchableOpacity>
            <MyText fontSize={18} color={colors.primary} type="bold">
              {' '}
              {!!oldNote
                ? STRINGS.ASSESSMENT_NOTES_ADD_EDIT.editNote
                : STRINGS.ASSESSMENT_NOTES_ADD_EDIT.addNote}{' '}
            </MyText>
          </View>

          <View style={__assessmentNotesAddEditStyles.contentContainer}>
            <Editor
              initialValue={note}
              height={150}
              onChange={text => setNote(text)}
            />

            <View style={__assessmentNotesAddEditStyles.buttonsRow}>
              <MyButton
                onPress={() => navigation.goBack()}
                invert
                title={STRINGS.ASSESSMENT_NOTES_ADD_EDIT.cancel}
                style={__assessmentNotesAddEditStyles.cancelButton}
              />

              <MyButton
                invert
                title={
                  !!oldNote
                    ? STRINGS.ASSESSMENT_NOTES_ADD_EDIT.update
                    : STRINGS.ASSESSMENT_NOTES_ADD_EDIT.save
                }
                onPress={btn_save}
                style={__assessmentNotesAddEditStyles.saveButton}
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
