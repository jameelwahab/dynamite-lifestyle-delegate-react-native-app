import {View, TouchableOpacity, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import {colors} from '../../../utilities/colors';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import MyLoader from '../../../components/MyLoader';
import MyText from '../../../components/MyText';
import {icons} from '../../../utilities/icons';
import FAB from '../../../components/FAB';
import {ASSESSMENT_NOTE_DELETE, ASSESSMENT_NOTE_LIST} from '../../../DAL';
import routes from '../../../navigation/routes';
import MyWebview from '../../../components/MyWebview';
import UserImage from '../../../components/UserImage';
import OptionModal from '../../../components/OptionModal';
import ConfirmationModal from '../../../components/ConfirmationModal';
import EmptyView from '../../../components/EmptyView';
import {convertTimezone} from '../../../functions/convertTime';
import {selectTimeZone} from '../../../redux/reducers/timezoneSlice';
import {STRINGS} from '../../../utilities/strings';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import {__assessmentNotesListStyles} from '../__styles';

const List = ({navigation, route}) => {
  const {type, assessmentId} = route?.params;

  const {token} = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([]);
  const [optionModal, setOptionModal] = useState({isVisible: false, for: ''});
  const [confirmationModal, setConfirmationModal] = useState({
    isVisible: false,
    title: '',
    item: null,
  });

  const getNotesList = async () => {
    setLoader(true);
    let res = await ASSESSMENT_NOTE_LIST({
      token,
      navigation,
      type,
      assessmentId,
    });
    setLoader(false);
    if (res.code == 200) {
      setList(res?.internal_notes);
    }
  };

  const optionsAction = opt => {
    let notes = optionModal?.for;
    setOptionModal({for: '', isVisible: false});
    if (opt.type == 'edit') {
      navigation.navigate(routes.assessmentNotesAddEdit, {
        type,
        assessmentId,
        oldNote: notes,
        refresh: getNotesList,
      });
    } else if (opt.type == 'delete') {
      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          item: notes,
          title: STRINGS.ASSESSMENT_NOTES_LIST.deleteConfirmation,
        });
      }, 400);
    }
  };

  const deleteNote = async noteId => {
    setLoader(true);
    let res = await ASSESSMENT_NOTE_DELETE({
      token,
      navigation,
      type,
      assessmentId,
      noteId,
    });
    if (res.code == 200) {
      getNotesList();
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    getNotesList();
  }, [route]);

  const renderList = ({item, index}) => {
    return (
      <View style={__assessmentNotesListStyles.itemRootView}>
        <Row alignItems="center">
          <UserImage
            image={item?.action_user_info?.profile_image}
            name={item?.action_user_info?.action_name}
            size={30}
          />

          <View style={__assessmentNotesListStyles.itemNameAndDateView}>
            <Flex flex={1}>
              <MyText color={colors.primary} fontSize={14}>
                {item?.action_user_info?.action_name}
              </MyText>
            </Flex>
            <MyText fontSize={10}>
              {convertTimezone(item?.note_date_time, timezone).format(
                STRINGS.DATE_FORMATES.YYYY_MM_DD_HH_MM_A,
              )}
            </MyText>

            <TouchableOpacity
              onPress={() => setOptionModal({isVisible: true, for: item})}
              style={__assessmentNotesListStyles.threeDotBtnView}>
              {icons.threeDots()}
            </TouchableOpacity>
          </View>
        </Row>
        {!!item?.internal_note_message && (
          <View style={{paddingVertical: 5}}>
            <MyWebview html={item?.internal_note_message} />
          </View>
        )}
      </View>
    );
  };

  return (
    <RootView title={STRINGS.ASSESSMENT_NOTES_LIST.title}>
      <Flex flex={1}>
        <Flex flex={1}>
          <FlatList
            data={list}
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 70, marginTop: 10}}
            ListEmptyComponent={() =>
              !loader && (
                <EmptyView label={STRINGS.ASSESSMENT_NOTES_LIST.noNotes} />
              )
            }
          />
        </Flex>

        <MyLoader enable={loader} />
        <FAB
          onPress={() =>
            navigation.navigate(routes.assessmentNotesAddEdit, {
              type,
              assessmentId,
              refresh: getNotesList,
            })
          }
          icon={() => icons.plus(colors.black, 20)}
        />
        <OptionModal
          closeModal={() => setOptionModal({isVisible: false, for: ''})}
          isVisible={optionModal?.isVisible}
          optionList={myOptions}
          onSelected={optionsAction}
        />
        <ConfirmationModal
          isVisible={confirmationModal.isVisible}
          title={confirmationModal.title}
          closeModal={() =>
            setConfirmationModal({isVisible: false, title: '', item: null})
          }
          onAgree={() => {
            deleteNote(confirmationModal.item?._id);
            setConfirmationModal({isVisible: false, title: '', item: null});
          }}
        />
      </Flex>
    </RootView>
  );
};

export default List;

const myOptions = [
  {
    icon: icons.edit,
    title: STRINGS.ASSESSMENT_NOTES_LIST.edit,
    type: 'edit',
  },
  {
    icon: icons.trash,
    title: STRINGS.ASSESSMENT_NOTES_LIST.delete,
    type: 'delete',
  },
];
