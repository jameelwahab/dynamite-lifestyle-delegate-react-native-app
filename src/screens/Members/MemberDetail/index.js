import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Pressable,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import UserImage from '../../../components/UserImage';
import {icons} from '../../../utilities/icons';
import StatView from '../Components/StatView';
import {convertTimezone} from '../../../functions/convertTime';
import {dateTimeFormat} from '../../../utilities/constants';
import {useSelector} from 'react-redux';
import {selectTimeZone} from '../../../redux/reducers/timezoneSlice';
import LeadModal from '../Components/LeadModal';
import {selectUser} from '../../../redux/reducers/userSlice';
import LeadHistoryModal from '../Components/LeadHistoryModal';
import {IS_CHAT_EXIST, UPDATE_CALL_FUNCTIONALITY} from '../../../DAL';
import routes from '../../../navigation/routes';
import moment from 'moment';
import numFormatter from '../../../functions/numFormatter';
import NotesModal from '../Components/NotesModal';
import {optionList} from '../Components/list';
import {MenuButton} from '../../../components/MyButton';
import MyCheckBox from '../../../components/MyCheckBox';
import CallHistoryNoteModal from '../Components/CallHistoryNoteModal';
import InfoModal from '../../../components/InfoModal';
import ConfirmationModal2 from '../../../components/ConfirmationModal2';
import OptionModal2 from '../../../components/OptionModal2';
import showToast from '../../../functions/showToast';
import breakReference from '../../../functions/breakReference';
import country from '../../../assets/data/countryList.json';
import {Row} from '../../../UIComponents/FlexViews';
import MyImage from '../../../components/MyImage';

const MemberDetail = ({navigation, route}) => {
  const {type} = route?.params;
  const {access, S3_URL} = useSelector(selectUser);
  const isAllMembers = type == STRINGS.MEMBER_DETAIL.types.allMember;
  const isMembers = type == STRINGS.MEMBER_DETAIL.types.member;
  const isNurture = type == STRINGS.MEMBER_DETAIL.types.nurture;
  const ref_optionModal = useRef();
  const leadModalRef = useRef();
  const hitoryModalRef = useRef();
  const notesModalRef = useRef();
  const ref_info = useRef();
  const ref_callHistoryModal = useRef();
  const ref_confirmModal = useRef();
  const timezone = useSelector(selectTimeZone);
  const {token, user} = useSelector(selectUser);
  const isSubTeam = user?.team_type == 'sub_team';
  const [member, setMember] = useState(route?.params?.member);
  const [showMorePages, setShowMorePages] = useState(false);
  const [showMorePrograms, setShowMorePrograms] = useState(false);

  const updateCallAPI = async () => {
    let res = await UPDATE_CALL_FUNCTIONALITY({
      token,
      navigation,
      body: {
        is_call_allowed: !member?.is_call_allowed,
        member_id: member?._id,
      },
    });
    if (res?.code == 200) {
      showToast({type: 'success', title: res?.message});
      let data = breakReference(member);
      data['is_call_allowed'] = !data['is_call_allowed'];
      setMember(data);
      route?.params?.updateData?.(data);
    } else {
    }
  };

  const onOptSelected = opt => {
    if (opt?.key == STRINGS.MEMBER_DETAIL.optionKeys.notes) {
      navigation.navigate(routes.memberNotesListing, {
        for: 'members',
        memberId: member?._id,
        updateNotes: updateTheNotes,
      });
    } else if (opt?.key == STRINGS.MEMBER_DETAIL.optionKeys.subscription) {
      navigation.navigate(routes.memberSubscribersListing, {
        memberId: member?._id,
      });
    } else if (opt?.key == STRINGS.MEMBER_DETAIL.optionKeys.manageMission) {
      navigation.navigate(routes.memberManage, {
        memberId: member?._id,
      });
    } else if (opt?.key == STRINGS.MEMBER_DETAIL.optionKeys.questionAnswer) {
      navigation.navigate(routes.memberQuestionListing, {
        memberId: member?._id,
        member: member,
      });
    } else if (opt?.key == STRINGS.MEMBER_DETAIL.optionKeys.profile) {
      navigation.navigate(routes.memberProfile, {
        memberId: member?._id,
      });
    } else if (opt?.key == STRINGS.MEMBER_DETAIL.optionKeys.updateCall) {
      ref_confirmModal?.current?.openModal({
        title: member?.is_call_allowed
          ? STRINGS.MEMBER_DETAIL.confirmDisableCall
          : STRINGS.MEMBER_DETAIL.confirmEnableCall,
        agreeFunc: () => updateCallAPI(),
      });
    }
  };

  const filterTheList = list => {
    return list.slice().filter(x => {
      if (x.key == STRINGS.MEMBER_DETAIL.optionKeys.profile) {
        return access?.view_profile;
      } else if (x.key == 'subscription-list' || x.key == 'transaction-list') {
        return isAllMembers;
      } else if (x.key == STRINGS.MEMBER_DETAIL.optionKeys.questionAnswer) {
        if (isSubTeam) {
          return isAllMembers;
        } else {
          return true;
        }
      } else return true;
    });
  };

  const updateTheNotes = (notes, memberId) => {
    route?.params?.updateNotes?.(notes, memberId);
    setMember({...member, personal_note: notes});
  };

  const updateCallNotes = (notes, memberId) => {
    route?.params?.updateCallNote?.(notes, memberId);
    setMember({...member, call_history: notes});
  };

  // ? funcvtions

  const updateLeadStatus = (leadStatus, icome, date, expiry) => {
    let lead = {
      background_color: leadStatus?.background_color,
      text_color: leadStatus?.text_color,
      title: leadStatus?.title,
      _id: leadStatus?._id,
    };

    if (leadStatus?.is_lead_status_locked) {
      lead = {
        ...lead,
        is_lead_status_locked: leadStatus?.is_lead_status_locked,
      };
    }

    let obj = {
      ...member,
      lead_status: lead,
      expiry_date: expiry,
      lead_status_history: [
        {
          income_value: icome,
          changed_date_time: date,
          lead_status: lead,
        },
        ...member?.lead_status_history,
      ],
    };
    setMember({...obj});
    route?.params?.updateData?.({...obj});
  };

  const onChatScreen = async memberId => {
    let res = await IS_CHAT_EXIST({token, navigation, memberId});
    if (res.code == 200) {
      if (res.is_chat_exist) {
        let member = res.chat.member.find(x => x._id != user?._id);
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: '',
          profileImage: !!member?.profile_image ? member?.profile_image : '',
          chatId: res?.chat?._id,
          canGoBack: true,
          resetCountToZero: () => {},
          refresh: () => {},
        });
      } else {
        let member = res.user_info;
        navigation.navigate(routes.chatMessageList, {
          isOnline: member?.is_online,
          memberId: member?._id,
          firstName: member?.first_name,
          lastName: member?.last_name,
          lastSeen: !!member?.last_login_activity
            ? member?.last_login_activity
            : '',
          profileImage: !!member?.member ? member?.member : '',
          chatId: '',
          canGoBack: true,
          resetCountToZero: () => {},
          refresh: () => {},
        });
      }
    }
  };

  const onWhatsappChatScreen = (member, item) => {
    navigation.navigate(routes.whtasappChatMessageList, {
      memberId: member?._id,
      firstName: member?.first_name,
      lastName: member?.last_name,
      profileImage: member?.profile_image,
      showTemplate: member?.whatsapp_chat_status != 'accepted',
      chatId: item._id,
      resetCountToZero,
      refresh,
      makeChatAccepted,
    });
  };

  // ? Views

  const topView = () => {
    return (
      <View style={styles.memberRootView}>
        <View style={styles.memberProfileView}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtton}>
            {icons.back(colors.primary, 25)}
          </TouchableOpacity>

          <Pressable
            onPress={() => {
              if (access?.view_profile) {
                onOptSelected({key: STRINGS.MEMBER_DETAIL.optionKeys.profile});
              }
            }}
            style={styles.profilePressable}>
            <View>
              <UserImage
                borderWidth={2}
                borderColor={
                  member.membership_level_badge_info
                    ?.membership_level_badge_color_code
                }
                image={member?.profile_image}
                name={member?.first_name}
                size={30}
              />
              <View
                style={[
                  member?.is_online
                    ? styles.onlineStatus
                    : styles.offlineStatus,
                  styles.memberStatusView,
                ]}
              />
              {/* <View style={[{ backgroundColor: member?.is_membership_active ? colors.active : colors.expire, }, __styles.memberActiveView]} /> */}
            </View>

            <View style={styles.memberProfileNameView}>
              <MyText fontSize={14} type="bold">
                {member?.first_name + ' ' + member?.last_name}
              </MyText>
              {isAllMembers && <MyText fontSize={12}>{member?.email}</MyText>}
            </View>
          </Pressable>
          <MyText style={styles.marginRight10}>
            {country.find(el => el.code === member?.country).flag}
          </MyText>
          <TouchableOpacity
            style={styles.marginRight10}
            onPress={() => onChatScreen(member?._id)}>
            {icons.message(colors.primary, 20)}
          </TouchableOpacity>

          <MenuButton
            size={22}
            onPress={() => ref_optionModal?.current?.openModal()}
          />
        </View>
      </View>
    );
  };

  const wheelOfLifeStatus = () => {
    if (!!member?.is_wheel_of_life) {
      return (
        <View style={styles.noteView}>
          <Image source={icons.wheelOfLife} style={styles.fullSize} />
        </View>
      );
    }
  };

  const leadStatusView = () => {
    return (
      <View style={styles.rowAlignCenter}>
        <TouchableHighlight
          style={styles.flex1}
          onPress={() => leadModalRef?.current?.openModal()}>
          <View
            style={[
              styles.leadRootView,
              !!member?.lead_status && {
                backgroundColor: member?.lead_status?.background_color,
              },
            ]}>
            <View style={styles.leadStatusTextView}>
              <MyText
                color={
                  !!member?.lead_status
                    ? member?.lead_status?.text_color
                    : colors.white
                }>
                {!!member?.lead_status
                  ? member?.lead_status?.title
                  : STRINGS.MEMBER_DETAIL.leadStatus}
              </MyText>
            </View>
            <View style={styles.leadStatusIconView}>
              {icons.down(colors.primary, 15)}
            </View>
          </View>
        </TouchableHighlight>
        {!!member?.lead_status > 0 && (
          <TouchableOpacity
            onPress={() => hitoryModalRef?.current?.openModal()}
            style={styles.historyBtn}>
            {icons.history(colors.primary, 15)}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const noteView = () => {
    return (
      <Pressable
        disabled={member?.personal_note.length == 0}
        onPress={() =>
          notesModalRef?.current?.openModal(
            [...member?.personal_note].reverse(),
          )
        }
        style={styles.noteView}>
        <MyText color={colors.black} fontSize={14}>
          {member?.personal_note.length}
        </MyText>
      </Pressable>
    );
  };

  const statusView = () => {
    return (
      <View
        style={[
          styles.statusView,
          member?.status ? styles.activeBackground : styles.inactiveBackground,
        ]}>
        <MyText color={colors.white} fontSize={14}>
          {!!member?.status
            ? STRINGS.MEMBER_DETAIL.active
            : STRINGS.MEMBER_DETAIL.inactive}
        </MyText>
      </View>
    );
  };

  const goalView = () => {
    return (
      <View
        style={[
          styles.statusView,
          member?.goal_statement_status
            ? styles.activeBackground
            : styles.inactiveBackground,
        ]}>
        <MyText color={colors.white} fontSize={14}>
          {!!member?.goal_statement_status
            ? STRINGS.MEMBER_DETAIL.unlocked
            : STRINGS.MEMBER_DETAIL.locked}
        </MyText>
      </View>
    );
  };

  const pagesView = () => {
    return (
      <View>
        {member?.event_subscriber.length > 0 ? (
          <>
            {member?.event_subscriber.map((x, i) => {
              if ((showMorePages == false && i < 2) || showMorePages) {
                return (
                  <MyText
                    key={`event_subscriber${i}`}
                    style={styles.marginTop3}
                    fontSize={12}
                    type="medium">
                    {x?.page_info?.sale_page_title +
                      ' | ' +
                      x?.plan_info?.plan_title}
                  </MyText>
                );
              }
            })}
            {member?.event_subscriber.length > 2 && (
              <MyText
                color={colors.primary}
                type="bold"
                onPress={() => setShowMorePages(!showMorePages)}>
                {showMorePages
                  ? STRINGS.MEMBER_DETAIL.showLess
                  : STRINGS.MEMBER_DETAIL.showMore}
              </MyText>
            )}
          </>
        ) : (
          <MyText fontSize={12} type="medium">
            {STRINGS.MEMBER_DETAIL.na}
          </MyText>
        )}
      </View>
    );
  };

  const ProgrammsView = () => {
    return (
      <View>
        {member?.program.length > 0 ? (
          <>
            {member?.program.map((x, i) => {
              if ((showMorePrograms == false && i < 2) || showMorePrograms) {
                return (
                  <MyText key={`program${i}`} fontSize={12} type="medium">
                    {x?._id?.title}
                  </MyText>
                );
              }
            })}
            {member?.program.length > 2 && (
              <MyText
                color={colors.primary}
                type="bold"
                onPress={() => setShowMorePrograms(!showMorePrograms)}>
                {showMorePrograms
                  ? STRINGS.MEMBER_DETAIL.showLess
                  : STRINGS.MEMBER_DETAIL.showMore}
              </MyText>
            )}
          </>
        ) : (
          <MyText fontSize={12} type="medium">
            {STRINGS.MEMBER_DETAIL.na}
          </MyText>
        )}
      </View>
    );
  };

  const contactNumberView = (phone, isChecked, isAllowed) => {
    return (
      <View style={styles.rowAlignCenter}>
        <View style={styles.marginRight10}>
          <MyText type="medium" fontSize={12}>
            {phone}
          </MyText>
        </View>
        {isAllowed ? (
          <MyCheckBox
            pb={0}
            value={isChecked}
            onPress={() => {
              if (isChecked) {
                let str = member?.call_history?.notes;
                let str2 = moment(member?.call_history?.date).format(
                  dateTimeFormat.date,
                );

                ref_info?.current?.openModal(str, str2, true);
              } else {
                ref_callHistoryModal?.current?.openModal();
              }
            }}
          />
        ) : (
          icons.crosss(colors.delete)
        )}
      </View>
    );
  };

  const appDownloadedView = value => {
    return (
      <View style={styles.rowAlignCenter}>
        <View style={styles.marginRight5}>
          {value
            ? icons.appDownloadedEmoji(25)
            : icons.appNotDownloadedEmoji(25)}
        </View>
        <MyText fontSize={12} type="medium">
          {value ? STRINGS.MEMBER_DETAIL.yes : STRINGS.MEMBER_DETAIL.no}
        </MyText>
      </View>
    );
  };

  const badgeLevelView = item => {
    return (
      <Row alignItems="center">
        {!!item?.membership_level_badge_info?.membership_level_badge_icon
          ?.thumbnail_1 && (
          <MyImage
            source={{
              uri:
                S3_URL +
                item?.membership_level_badge_info?.membership_level_badge_icon
                  ?.thumbnail_1,
            }}
            style={styles.badgeIcon}
          />
        )}
        {!!item?.membership_level_badge_info?.membership_level_badge_title && (
          <MyText fontSize={12} type="medium">
            {item?.membership_level_badge_info?.membership_level_badge_title}
          </MyText>
        )}
        <View
          style={[
            styles.membershipBadge,
            item?.is_membership_active
              ? styles.activeBadge
              : styles.expiredBadge,
          ]}>
          <MyText fontSize={10} uppercase type="bold" color={colors.white}>
            {item?.is_membership_active
              ? STRINGS.MEMBER_DETAIL.active
              : STRINGS.MEMBER_DETAIL.expired}
          </MyText>
        </View>
      </Row>
    );
  };

  const memberStatView = () => {
    return (
      <View>
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.membershipExpire}
          value={
            !!member?.membership_purchase_expiry
              ? isAllMembers
                ? member?.membership_purchase_expiry
                : moment(new Date(member?.membership_purchase_expiry))
                    .tz(timezone.admin)
                    .format(dateTimeFormat.date)
              : STRINGS.MEMBER_DETAIL.na
          }
        />

        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.coins}
          value={numFormatter(member?.coins_count)}
          uppercase
        />
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.appDownloaded}
          view={() => appDownloadedView(member?.downloaded_app)}
          uppercase
        />
        {isAllMembers && (
          <StatView
            title={STRINGS.MEMBER_DETAIL.stats.referredUser}
            value={
              !!member?.affliliate?.affiliate_user_info
                ? member?.affliliate?.affiliate_user_info?.first_name +
                  ' ' +
                  member?.affliliate?.affiliate_user_info?.last_name +
                  ' (' +
                  member?.affliliate?.affiliate_url_name +
                  ') '
                : STRINGS.MEMBER_DETAIL.masterLink
            }
          />
        )}
        {!isNurture && access?.Show_nurture_in_filter && (
          <StatView
            title={STRINGS.MEMBER_DETAIL.stats.nurture}
            value={
              !!member?.nurture
                ? member?.nurture?.first_name + ' ' + member?.nurture?.last_name
                : STRINGS.MEMBER_DETAIL.na
            }
          />
        )}
        {!isMembers && (
          <StatView
            title={STRINGS.MEMBER_DETAIL.stats.delegate}
            value={
              !!member?.consultant
                ? member?.consultant?.first_name +
                  ' ' +
                  member?.consultant?.last_name
                : STRINGS.MEMBER_DETAIL.na
            }
          />
        )}
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.badgeLevel}
          view={() => badgeLevelView(member)}
        />
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.wheelOfLife}
          view={wheelOfLifeStatus}
        />
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.lastLoginActivity}
          uppercase
          value={convertTimezone(member?.last_login_activity, timezone).format(
            dateTimeFormat.dateTime,
          )}
        />
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.phoneNumber}
          view={() =>
            contactNumberView(
              member?.contact_number,
              !!member?.call_history?.is_checked,
              member?.is_call_allowed,
            )
          }
        />
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.leadStatus}
          view={leadStatusView}
        />
        {isMembers && (
          <StatView
            title={STRINGS.MEMBER_DETAIL.stats.wheelOfLifeCompletedDate}
            value={
              !!member?.wheel_of_life_completed_date
                ? moment(member?.wheel_of_life_completed_date).format(
                    dateTimeFormat.date,
                  )
                : STRINGS.MEMBER_DETAIL.na
            }
          />
        )}
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.clientNote}
          view={noteView}
        />
        <StatView title={STRINGS.MEMBER_DETAIL.stats.pages} view={pagesView} />
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.programmes}
          view={ProgrammsView}
        />
        {isAllMembers && (
          <>
            <StatView
              title={STRINGS.MEMBER_DETAIL.stats.wheelOfLifeEnable}
              value={
                member?.is_wheel_of_life_enable
                  ? STRINGS.MEMBER_DETAIL.yes
                  : STRINGS.MEMBER_DETAIL.no
              }
            />
            <StatView
              title={STRINGS.MEMBER_DETAIL.stats.dailyIntentionCoins}
              value={numFormatter(member?.dynamite_diary_coins_count, 1)}
              uppercase
            />
            <StatView
              title={STRINGS.MEMBER_DETAIL.stats.gratitudeCoins}
              value={numFormatter(member?.dynamite_gratitude_coins_count, 1)}
              uppercase
            />
            <StatView
              title={STRINGS.MEMBER_DETAIL.stats.assessmentCoins}
              value={numFormatter(member?.attitude_assessment_coins_count, 1)}
              uppercase
            />
            <StatView
              title={STRINGS.MEMBER_DETAIL.stats.meditationCoins}
              value={numFormatter(member?.meditation_coins_count, 1)}
              uppercase
            />
            <StatView
              title={STRINGS.MEMBER_DETAIL.stats.goalStatement}
              value={
                !!member?.goal_statement_completed_status
                  ? `${STRINGS.MEMBER_DETAIL.completed} (${moment(
                      member.goal_statement_completed_date,
                    ).format(dateTimeFormat.date)})`
                  : STRINGS.MEMBER_DETAIL.incomplete
              }
            />
          </>
        )}

        <StatView
          title={
            isAllMembers
              ? STRINGS.MEMBER_DETAIL.stats.createdAt
              : STRINGS.MEMBER_DETAIL.stats.registrationDate
          }
          value={moment(member?.createdAt).format(dateTimeFormat.date)}
        />
        <StatView
          title={STRINGS.MEMBER_DETAIL.stats.status}
          view={statusView}
        />
        {isAllMembers && (
          <StatView title={STRINGS.MEMBER_DETAIL.stats.goal} view={goalView} />
        )}
      </View>
    );
  };

  return (
    <RootView hideSubHeader>
      {topView()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        indicatorStyle="white">
        {memberStatView()}
      </ScrollView>

      <LeadModal
        ref={leadModalRef}
        navigation={navigation}
        token={token}
        updateLeadStatus={updateLeadStatus}
        memberId={member?._id}
        oldLead={member}
      />

      <LeadHistoryModal
        ref={hitoryModalRef}
        memberId={member?._id}
        navigation={navigation}
        token={token}
      />

      <OptionModal2
        ref={ref_optionModal}
        onSelected={onOptSelected}
        optionList={filterTheList(optionList)}
      />
      <NotesModal
        memberId={member?._id}
        navigation={navigation}
        ref={notesModalRef}
        updateNotes={updateTheNotes}
      />

      <CallHistoryNoteModal
        ref={ref_callHistoryModal}
        memberId={member?._id}
        updateCallNotes={updateCallNotes}
      />

      <ConfirmationModal2 ref={ref_confirmModal} />

      <InfoModal ref={ref_info} />
    </RootView>
  );
};

export default MemberDetail;

const styles = StyleSheet.create({
  memberRootView: {},
  memberProfileView: {flexDirection: 'row', alignItems: 'center'},
  profilePressable: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  memberStatusView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 9,
    width: 9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.white,
  },
  onlineStatus: {
    backgroundColor: colors.online,
  },
  offlineStatus: {
    backgroundColor: colors.primary2,
  },
  memberActiveView: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  memberProfileNameView: {flex: 1, marginLeft: 10},
  backButtton: {height: 50, width: 30, justifyContent: 'center'},
  marginRight10: {
    marginRight: 10,
  },
  marginRight5: {
    marginRight: 5,
  },
  marginTop3: {
    marginTop: 3,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  noteView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusView: {
    height: 25,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  activeBackground: {
    backgroundColor: colors.online,
  },
  inactiveBackground: {
    backgroundColor: colors.heart,
  },
  historyBtn: {
    width: 30,
    paddingVertical: 5,
    alignItems: 'center',
  },
  leadRootView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: colors.placeholder,
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  leadStatusTextView: {
    flex: 1,
  },
  leadStatusIconView: {},
  badgeIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  membershipBadge: {
    borderRadius: 5,
    padding: 3,
    marginLeft: 5,
  },
  activeBadge: {
    backgroundColor: colors.active,
  },
  expiredBadge: {
    backgroundColor: colors.delete,
  },
  fullSize: {
    height: '100%',
    width: '100%',
  },
  scrollContainer: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 5,
  },
});
