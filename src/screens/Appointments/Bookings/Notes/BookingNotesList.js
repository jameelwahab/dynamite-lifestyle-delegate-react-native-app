import {View, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../../components/RootView';
import {colors} from '../../../../utilities/colors';
import MyLoader from '../../../../components/MyLoader';
import MyText from '../../../../components/MyText';
import {icons} from '../../../../utilities/icons';
import FAB from '../../../../components/FAB';
import routes from '../../../../navigation/routes';
import MyWebview from '../../../../components/MyWebview';
import UserImage from '../../../../components/UserImage';
import OptionModal from '../../../../components/OptionModal';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import EmptyView from '../../../../components/EmptyView';
import {convertTimezone} from '../../../../functions/convertTime';
import {dateTimeFormat} from '../../../../utilities/constants';
import MemberView from '../../../../components/MemberView';
import {BOOKING_NOTES_DELETE, BOOKING_NOTES_LIST} from '../../../../DAL';
import {selectTimeZone} from '../../../../redux/reducers/timezoneSlice';
import {selectUser} from '../../../../redux/reducers/userSlice';
import {useSelector} from 'react-redux';
import {STRINGS} from '../../../../utilities/strings';

const BookingNotesList = ({navigation, route}) => {
  const {bookingId, userInfo} = route?.params;
  const timezone = useSelector(selectTimeZone);
  const {token} = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [optionModal, setOptionModal] = useState({isVisible: false, for: ''});
  const [confirmationModal, setConfirmationModal] = useState({
    isVisible: false,
    title: '',
  });

  const optionsAction = opt => {
    if (opt.type == 'edit') {
      navigation.navigate(routes.bookingAddNote, {
        bookingId: bookingId,
        refresh: getDataFromServer,
        note: optionModal?.for,
      });
      setOptionModal({isVisible: false, for: ''});
    } else if (opt.type == 'delete') {
      setTimeout(() => {
        setConfirmationModal({
          isVisible: true,
          title: STRINGS.BOOKING_NOTES_LIST.deleteConfirmation,
        });
      }, 400);
      setOptionModal({...optionModal, isVisible: false});
    } else if (opt.type == 'event') {
      setTimeout(() => {
        navigation.navigate(routes.calendarEventsAddEdit, {
          member: userInfo,
          note: optionModal?.for?.note,
          popTo: route.name,
        });
      }, 400);
      setOptionModal({...optionModal, isVisible: false});
    }
  };

  const deleteNote = async noteId => {
    setLoader(true);
    let res = await BOOKING_NOTES_DELETE({token, navigation, id: noteId});
    if (res.code == 200) {
      getDataFromServer();
    } else {
      setLoader(false);
    }
  };

  const getDataFromServer = async () => {
    let res = await BOOKING_NOTES_LIST({token, navigation, id: bookingId});
    if (res.code == 200) {
      setList(res?.booking_notes);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    getDataFromServer();
  }, []);

  const renderList = ({item, index}) => {
    return (
      <View style={styles.itemRootView}>
        <View style={styles.itemUserView}>
          <UserImage
            image={item?.user_info?.profile_image?.thumbnail_1}
            name={item?.user_info?.first_name}
            size={30}
          />

          <View style={styles.itemNameAndDateView}>
            <View style={styles.nameContainer}>
              <MyText color={colors.primary} fontSize={14}>
                {`${item?.user_info?.first_name} ${
                  item?.user_info?.last_name
                } ${
                  item?.user_info?.action_by == 'admin_user'
                    ? STRINGS.BOOKING_NOTES_LIST.admin
                    : STRINGS.BOOKING_NOTES_LIST.consultant
                } `}
              </MyText>
              <MyText fontSize={10} color={colors.lightText2}>
                {STRINGS.BOOKING_NOTES_LIST.createdAt +
                  convertTimezone(item?.createdAt, timezone).fromNow()}
              </MyText>
            </View>

            {item?.action_by != 'admin_user' && (
              <TouchableOpacity
                onPress={() => setOptionModal({isVisible: true, for: item})}
                style={styles.threeDotBtnView}>
                {icons.threeDots()}
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.webviewContainer}>
          <MyWebview html={item?.note} />
        </View>

        <View style={styles.lastActionContainer}>
          {!!item?.last_updated_date_time ? (
            <MyText fontSize={10} color={colors.lightText2}>
              {STRINGS.BOOKING_NOTES_LIST.lastAction +
                convertTimezone(item?.last_updated_date_time, timezone).format(
                  dateTimeFormat.dateTime,
                )}
            </MyText>
          ) : (
            <View />
          )}
        </View>
      </View>
    );
  };

  const topView = () => {
    return (
      <View style={styles.topViewContainer}>
        <MemberView member={userInfo} />

        <View style={styles.totalContainer}>
          <MyText
            fontSize={10}
            type="medium"
            color={
              colors.lightText2
            }>{`${STRINGS.BOOKING_NOTES_LIST.total}${list?.length}`}</MyText>
        </View>
      </View>
    );
  };

  return (
    <RootView title={STRINGS.BOOKING_NOTES_LIST.bookingNotes}>
      {!!userInfo && topView()}
      <View style={styles.contentContainer}>
        <View style={styles.listContainer}>
          <FlatList
            data={list}
            renderItem={renderList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            ListEmptyComponent={
              !loader && (
                <EmptyView label={STRINGS.BOOKING_NOTES_LIST.noNotes} />
              )
            }
          />
        </View>

        <FAB
          onPress={() =>
            navigation.navigate(routes.bookingAddNote, {
              bookingId: bookingId,
              refresh: getDataFromServer,
              note: optionModal?.for,
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
          closeModal={() => setConfirmationModal({isVisible: false, title: ''})}
          onAgree={() => {
            setConfirmationModal({isVisible: false, title: ''});
            deleteNote(optionModal.for?._id);
            setOptionModal({isVisible: false, for: ''});
          }}
        />
      </View>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default BookingNotesList;

const myOptions = [
  {
    icon: icons.edit,
    title: STRINGS.BOOKING_NOTES_LIST.edit,
    type: 'edit',
  },
  {
    icon: icons.trash,
    title: STRINGS.BOOKING_NOTES_LIST.delete,
    type: 'delete',
  },
  {
    icon: () => icons.calendar(colors.primary),
    title: STRINGS.BOOKING_NOTES_LIST.addToCalendarEvent,
    type: 'event',
  },
];

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  closeBtnView: {
    height: 40,
    width: 40,
    backgroundColor: colors.lightPrimary2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRootView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemUserView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemNameAndDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  nameContainer: {
    flex: 1,
  },
  threeDotBtnView: {
    backgroundColor: colors.lightPrimary2,
    height: 25,
    width: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  webviewContainer: {
    paddingVertical: 5,
  },
  lastActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  totalContainer: {
    marginTop: -2,
    paddingBottom: 5,
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  flatListContent: {
    paddingBottom: 70,
  },
});
