import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../../components/RootView';
import {colors} from '../../../utilities/colors';
import Editor from '../../../components/Editor';
import MyLoader from '../../../components/MyLoader';
import {MyButton} from '../../../components/MyButton';
import {icons} from '../../../utilities/icons';
import showToast from '../../../functions/showToast';
import {
  ADD_NOTES,
  ASSESSMENT_NOTE_ADD,
  ASSESSMENT_NOTE_UPDATE,
  EDIT_NOTES,
} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyText from '../../../components/MyText';

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
      showToast({body: 'Please enter note', type: 'info'});
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
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={__styles.closeBtnView}>
              {icons.back(colors.primary, 25)}
            </TouchableOpacity>
            <MyText fontSize={18} color={colors.primary} type="bold">
              {' '}
              {!!oldNote ? 'Edit Note' : 'Add Note'}{' '}
            </MyText>
          </View>

          <View style={{flex: 1, marginTop: 15}}>
            <Editor
              initialValue={note}
              height={150}
              onChange={text => setNote(text)}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 10,
              }}>
              <MyButton
                onPress={() => navigation.goBack()}
                invert
                title="Cancel"
                style={{paddingHorizontal: 10, marginRight: 10}}
              />

              <MyButton
                invert
                title={!!oldNote ? 'Update' : 'Save'}
                onPress={btn_save}
                style={{paddingHorizontal: 10}}
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
});
