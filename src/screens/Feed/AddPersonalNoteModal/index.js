import {View, SafeAreaView, Pressable, StyleSheet} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../../utilities/colors';
import {icons} from '../../../utilities/icons';
import MyText from '../../../components/MyText';
import MyTouchableInput from '../../../components/MyTouchableInput';
import {MyButton} from '../../../components/MyButton';
import OptionModalWithSearch from '../../../components/OptionModalWithSearch';
import {STRINGS} from '../../../utilities/strings';
import {
  ADD_PERSONAL_NOTE_FOR_PORTAL,
  GET_MEMBER_LIST_FOR_PERSONAL_NOTES,
} from '../../../DAL';
import MyLoader from '../../../components/MyLoader';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import showToast from '../../../functions/showToast';
import Toast from 'react-native-toast-message';

let text = '';
const AddPersonalNoteModal = forwardRef(({}, ref) => {
  const navigation = useNavigation();
  const feed_Id = useRef('');
  const {token} = useSelector(selectUser);
  const [isVisible, setIsVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [optionModalVisibility, setoptionModalVisibility] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [list, setList] = useState([]);
  const [searchText, setSearchText] = useState('');

  useImperativeHandle(
    ref,
    () => {
      return {
        openModal,
      };
    },
    [],
  );

  const openModal = (note, feedId) => {
    text = note;
    feed_Id.current = feedId;
    setIsVisible(true);
  };

  const closeModal = () => {
    text = '';
    feed_Id.current = '';
    setSelectedMember(null);
    setIsVisible(false);
  };

  const getDataFromServer = async () => {
    let res = await GET_MEMBER_LIST_FOR_PERSONAL_NOTES({
      navigation,
      token,
      searchText: searchText.trim(),
    });
    if (res.code == 200) {
      setList(res?.member);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const addNotesToServer = async () => {
    if (!!!selectedMember) {
      showToast({
        title: STRINGS.ADD_PERSONAL_NOTE_MODAL.alert,
        body: STRINGS.ADD_PERSONAL_NOTE_MODAL.pleaseSelectMember,
        type: 'info',
      });
      return;
    }
    setLoader(true);
    let res = await ADD_PERSONAL_NOTE_FOR_PORTAL({
      navigation,
      token,
      feedId: feed_Id?.current,
      memberId: selectedMember?._id,
      note: `<p>${text}</p>`,
    });
    if (res.code == 200) {
      closeModal?.();
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, [searchText]);

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
      style={styles.modal}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View>
            <MyText fontSize={18} type="medium">
              {STRINGS.ADD_PERSONAL_NOTE_MODAL.title}
            </MyText>
          </View>
          <Pressable onPress={closeModal}>{icons.crosssWithCircle()}</Pressable>
        </View>
        <View style={styles.content}>
          <MyTouchableInput
            label="Members*"
            onPress={() => setoptionModalVisibility(true)}
            value={
              !!selectedMember
                ? `${selectedMember?.first_name} (${selectedMember?.email})`
                : ''
            }
          />

          <MyButton title="Add Note" onPress={addNotesToServer} />
        </View>

        <OptionModalWithSearch
          isVisible={optionModalVisibility}
          optionList={list}
          renderText={({item}) => (
            <MyText fontSize={16}>
              {STRINGS.ADD_PERSONAL_NOTE_MODAL.memberFormat(
                item?.first_name,
                item?.email,
              )}
            </MyText>
          )}
          closeModal={() => {
            setoptionModalVisibility(false);
            setSearchText('');
          }}
          onSelected={item => {
            setoptionModalVisibility(false);
            setSelectedMember(item);
          }}
          onSearchTextChange={text => setSearchText(text)}
          noIcon
          title={STRINGS.ADD_PERSONAL_NOTE_MODAL.member}
        />

        <MyLoader enable={loader} />
      </SafeAreaView>
      {isVisible && <Toast />}
    </Modal>
  );
});

const styles = StyleSheet.create({
  modal: {
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
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1 / 3,
    borderBottomColor: colors.lightText,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default AddPersonalNoteModal;
