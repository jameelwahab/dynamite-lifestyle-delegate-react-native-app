import {View, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import RootView from '../../../components/RootView';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MyInputs from '../../../components/MyInputs';
import getCurrecncyName from '../../../functions/getCurrecncyName';
import Editor from '../../../components/Editor';
import {MyButton} from '../../../components/MyButton';
import {colors} from '../../../utilities/colors';
import {MARK_PAYMENT_AS_CANCELLED_OR_PAID} from '../../../DAL';
import showToast from '../../../functions/showToast';
import MyLoader from '../../../components/MyLoader';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {STRINGS} from '../../../utilities/strings';

const MarkAsPaid = ({navigation, route}) => {
  const {data, changeStatus} = route?.params;
  const {token} = useSelector(selectUser);
  const [editorValue, setEditorValue] = useState('');
  const [loader, setLoader] = useState(false);

  const markPayemntCancelOrPaid = async (item, type, note = undefined) => {
    setLoader(true);
    let res = await MARK_PAYMENT_AS_CANCELLED_OR_PAID({
      navigation,
      token,
      slug: item?.payment_request_slug,
      type,
      note,
    });
    if (res.code == 200) {
      changeStatus('paid', item);
      showToast({body: res?.message, type: 'success'});
      navigation.goBack();
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const onSubmit = () => {
    if (editorValue.trim() == '') {
      showToast({
        body: STRINGS.MARK_AS_PAID.transactionNoteRequired,
        type: 'error',
      });
    } else {
      markPayemntCancelOrPaid(data, 'paid', editorValue);
    }
  };
  return (
    <RootView title={data?.request_title}>
      <KeyboardAwareScrollView>
        <View>
          <View>
            <MyInputs
              editable={false}
              label={STRINGS.MARK_AS_PAID.member}
              value={data?.member?.first_name + ' ' + data?.member?.last_name}
            />
          </View>

          <View>
            <MyInputs
              label={STRINGS.MARK_AS_PAID.totalAmount}
              editable={false}
              value={String(data?.total_amount)}
            />
          </View>

          <View>
            <MyInputs
              label={STRINGS.MARK_AS_PAID.currency}
              editable={false}
              value={getCurrecncyName(data?.currency)}
            />
          </View>

          <View>
            <Editor
              label={STRINGS.MARK_AS_PAID.transactionNote}
              initialValue={editorValue}
              onChange={text => setEditorValue(text)}
              height={150}
              backgroundColor={colors.secondaryVariant}
            />
          </View>

          <View style={styles.btnView}>
            <MyButton
              title={STRINGS.MARK_AS_PAID.submit}
              invert
              style={styles.submitButton}
              onPress={onSubmit}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default MarkAsPaid;

const styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    flex: 1,
  },
  innerView: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.white + '55',
    paddingBottom: 10,
    marginBottom: 10,
  },
  checkboxView: {
    flexDirection: 'row',
  },
  btnView: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  submitButton: {
    paddingHorizontal: 10,
  },
});
