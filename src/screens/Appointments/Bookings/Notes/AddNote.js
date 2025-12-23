import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
      showToast({body: 'Please enter note', type: 'info'});
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

          <View style={{flex: 1, marginTop: 20}}>
            {!oldNote && (
              <View style={{marginBottom: 5, marginHorizontal: 5}}>
                <MyCheckBox
                  value={addAsPersonalNote}
                  onPress={() => setAddAsPersonalNote(!addAsPersonalNote)}
                  title="Would you like to add it to Personal Notes?"
                />
              </View>
            )}
            <Editor
              initialValue={note}
              height={200}
              onChange={text => setNote(text)}
              autoResonderMsgs={autoResponderMsg}
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
