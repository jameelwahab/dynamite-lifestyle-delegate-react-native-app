import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../../components/RootView';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import Editor from '../../../components/Editor';
import MyLoader from '../../../components/MyLoader';
import {MyButton} from '../../../components/MyButton';
import {icons} from '../../../utilities/icons';
import showToast from '../../../functions/showToast';
import {MEMBER_ADD_NOTE, MEMBER_UPDATE_NOTE} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyText from '../../../components/MyText';
const AddNote = ({navigation, route}) => {
  const {token} = useSelector(selectUser);
  const {note: oldNote, memberId, autoResponderMsg} = route?.params;
  const [note, setNote] = useState(!!oldNote ? oldNote?.note : '');
  const [loader, setLoader] = useState(false);

  const btn_save = () => {
    if (note.trim() == '') {
      showToast({body: STRINGS.MEMBER_ADD_NOTE.pleaseEnterNote, type: 'info'});
    } else {
      setLoader(true);
      addTheNote();
    }
  };

  const addTheNote = async () => {
    let res;
    if (!!oldNote) {
      res = await MEMBER_UPDATE_NOTE({
        token,
        navigation,
        member_id: memberId,
        note_id: oldNote?._id,
        personal_note: note,
      });
    } else {
      res = await MEMBER_ADD_NOTE({
        token,
        navigation,
        member_id: memberId,
        personal_note: note,
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
          <View style={__styles.headerContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={__styles.closeBtnView}>
              {icons.back(colors.primary, 25)}
            </TouchableOpacity>
            <MyText fontSize={18} color={colors.primary} type="bold">
              {' '}
              {!!oldNote
                ? STRINGS.MEMBER_ADD_NOTE.editNote
                : STRINGS.MEMBER_ADD_NOTE.addNote}
            </MyText>
          </View>

          <View style={__styles.editorContainer}>
            <Editor
              initialValue={note}
              height={150}
              onChange={text => setNote(text)}
              autoResonderMsgs={autoResponderMsg}
            />

            <View style={__styles.buttonsContainer}>
              <MyButton
                onPress={() => navigation.goBack()}
                invert
                title={STRINGS.MEMBER_ADD_NOTE.cancel}
                style={__styles.cancelButton}
              />

              <MyButton
                invert
                title={
                  !!oldNote
                    ? STRINGS.MEMBER_ADD_NOTE.update
                    : STRINGS.MEMBER_ADD_NOTE.save
                }
                onPress={btn_save}
                style={__styles.saveButton}
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

const __styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
  },
  closeBtnView: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 40 / 2,
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
    marginTop: 15,
  },
  buttonsContainer: {
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
