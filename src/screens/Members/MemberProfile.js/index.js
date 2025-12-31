import {
  View,
  Pressable,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {INITIATE_WHATSAPP_CHAT, MEMBER_PROFILE} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import moment from 'moment';
import MyLoader from '../../../components/MyLoader';
import MemberView from '../../../components/MemberView';
import {icons} from '../../../utilities/icons';
import {__styles} from './style';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import StatView from './StatView';
import WheelofLife from './WheelofLife';
import QuestionsView from './QuestionsView';
import SubscriptionVIew from './SubscriptionVIew';
import NinetyDaysView from './NinetyDaysView';
import CalenderView from './CalenderView';
import {convertTimezone} from '../../../functions/convertTime';
import {selectTimeZone} from '../../../redux/reducers/timezoneSlice';
import {onChatScreen} from '../../../functions/onChatScreen';
import DailyDynamiteGraph from './DailyDynamiteGraph';
import routes from '../../../navigation/routes';
import {isValidNumber} from 'libphonenumber-js';
import showToast from '../../../functions/showToast';
import SmsModal from './SmsModal';

const MemberProfile = ({navigation, route}) => {
  let {token, user, isChatAllowed, isWhatsappChatAllowed, access} =
    useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);
  const {memberId} = route?.params;
  const tabRef = useRef();
  const ref_sms = useRef();
  const [loader, setLoader] = useState(false);
  const [member, setMember] = useState(null);
  const [date, setDate] = useState(
    moment().format(STRINGS.DATE_FORMATES.YYYY_MM_DD),
  );
  const [selectedTab, setSelectedTab] = useState(tabs[0].key);
  const [events, setEvents] = useState(null);
  const [type, setType] = useState('month');
  const [_90DayGraph, set_90DayGraph] = useState([]);

  const geMemberDataFromServer = async (selectedDate, ttype) => {
    let sDATE = moment(selectedDate)
      .subtract({month: 1})
      .endOf(ttype)
      .format(STRINGS.DATE_FORMATES.YYYY_MM_DD);
    let eDATE = moment(selectedDate)
      .endOf(ttype)
      .format(STRINGS.DATE_FORMATES.YYYY_MM_DD);
    let res = await MEMBER_PROFILE({
      token,
      navigation,
      memberId: memberId,
      startDate: sDATE,
      endDate: eDATE,
    });
    if (res.code == 200) {
      //? make Calendar data
      let startDate = moment(
        selectedDate,
        STRINGS.DATE_FORMATES.YYYY_MM_DD,
      ).startOf(ttype);
      let endDate = moment(
        selectedDate,
        STRINGS.DATE_FORMATES.YYYY_MM_DD,
      ).endOf(ttype);
      let newArray = {};
      let diff = moment(endDate).diff(moment(startDate), 'days') + 1;
      for (let i = 0; i < diff; i++) {
        let curDate = moment(startDate)
          .add({day: i})
          .format(STRINGS.DATE_FORMATES.YYYY_MM_DD);
        let list = res.event.filter(
          x =>
            convertTimezone(x?.start_date_time, timezone).format(
              STRINGS.DATE_FORMATES.YYYY_MM_DD,
            ) == curDate,
        );
        newArray[curDate] = {
          count: list.length,
          list: list,
        };
      }

      //? make graph data
      let graphData = res?.member_earning_app
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      let newlist = [];
      graphData.forEach((x, i) => {
        let index = newlist.findIndex(y => y.date === x.date);
        if (index == -1) {
          let day;
          if (i == 0) {
            day = 1;
          } else {
            day = moment(x.date, STRINGS.DATE_FORMATES.YYYY_MM_DD).diff(
              moment(graphData[0].date, STRINGS.DATE_FORMATES.YYYY_MM_DD),
              'day',
            );
          }

          let newObj = {
            date: x.date,
            earning: x.earning,
            day: day,
          };
          newlist.push(newObj);
        } else {
          let newObj = {
            ...newlist[index],
            earning: newlist[index].earning + x.earning,
          };
          newlist.splice(index, 1, newObj);
        }
      });

      set_90DayGraph(newlist);
      setEvents(newArray);
      setMember(res);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const onWhatsappChatScreen = async () => {
    if (isValidNumber('+' + member?.member?.contact_number)) {
      setLoader(true);
      let res = await INITIATE_WHATSAPP_CHAT({
        token,
        navigation,
        receiver_id: memberId,
      });
      setLoader(false);
      if (!res.data.error) {
        let rMember = res.data?.receiver_info;
        navigation.navigate(routes.whtasappChatMessageList, {
          memberId: rMember?._id,
          firstName: rMember?.first_name,
          showTemplate: rMember?.whatsapp_chat_status != 'accepted',
          lastName: rMember?.last_name,
          profileImage: !!rMember?.profile_image ? rMember?.profile_image : '',
          chatId: res?.data?._id,
          canGoBack: true,
        });
      } else {
        showToast({body: res?.message, title: STRINGS.MEMBER_PROFILE.error});
      }
    } else {
      showToast({
        body: STRINGS.MEMBER_PROFILE.providedContactNumberInvalid,
        title: STRINGS.MEMBER_PROFILE.invalidContactNumber,
      });
    }
  };

  const onArrowPress = btnType => {
    let newDate;
    if (btnType == 'prev') {
      newDate = moment(date)
        .subtract(type, 1)
        .format(STRINGS.DATE_FORMATES.YYYY_MM_DD);
    } else if (btnType == 'next') {
      newDate = moment(date)
        .add(type, 1)
        .format(STRINGS.DATE_FORMATES.YYYY_MM_DD);
    }
    setEvents(null);
    setDate(newDate);
    setLoader(true);
    geMemberDataFromServer(newDate, type);
  };

  const onTypePress = ntype => {
    setEvents(null);
    setType(ntype);
    setLoader(true);
    geMemberDataFromServer(date, ntype);
  };

  const onSmsModal = (token, navigation) => {
    ref_sms?.current?.openModal({
      token,
      navigation,
      user: member?.member?.contact_number,
    });
  };

  useEffect(() => {
    setLoader(true);
    geMemberDataFromServer(date, type);
  }, []);

  const topView = () => {
    return (
      <View style={styles.topViewContainer}>
        <View style={styles.topViewMemberContainer}>
          {!!member?.member && (
            <View>
              <MemberView
                member={member?.member}
                borderColor={
                  member?.member?.membership_level_badge_info
                    ?.membership_level_badge_id?.color_code
                }
                showPhoneNumber
              />
              <View
                style={[
                  {
                    backgroundColor: member?.member?.is_online
                      ? colors.online
                      : colors.primary2,
                  },
                  __styles.memberStatusView,
                ]}
              />
            </View>
          )}
        </View>
        {isWhatsappChatAllowed && (
          <Pressable
            onPress={() => onWhatsappChatScreen()}
            style={[__styles.topBtn, styles.whatsappButton]}>
            {icons.whatsapp(colors.white, 18)}
          </Pressable>
        )}
        {isChatAllowed && (
          <Pressable
            onPress={() => onChatScreen(memberId, token, navigation, user?._id)}
            style={[__styles.topBtn, styles.messageButton]}>
            {icons.message(colors.white, 18)}
          </Pressable>
        )}

        {access?.allow_to_send_sms && (
          <Pressable
            onPress={() => onSmsModal(token, navigation)}
            style={[__styles.topBtn, styles.smsButton]}>
            {icons.sms(colors.white, 18)}
          </Pressable>
        )}
      </View>
    );
  };

  const TabView = () => {
    return (
      <View style={styles.tabViewContainer}>
        <FlatList
          ref={tabRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabs}
          keyExtractor={item => item.key}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  tabRef?.current?.scrollToIndex({
                    index: index,
                    animated: true,
                  });
                  setSelectedTab(item.key);
                }}
                style={styles.tabItemContainer}>
                <MyText
                  color={
                    item.key == selectedTab ? colors.primary : colors.lightText2
                  }
                  type="medium"
                  fontSize={16}>
                  {item.title}
                </MyText>
                <View
                  style={[
                    styles.tabIndicator,
                    {
                      backgroundColor:
                        item.key == selectedTab
                          ? colors.primary
                          : colors.transparent,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          }}
        />
        <View style={styles.tabSeparator} />
      </View>
    );
  };

  const showScreen = () => {
    return (
      <View>
        {selectedTab == 'wol' ? (
          <WheelofLife
            member={member?.member}
            settings={member?.wheel_of_life_setting}
          />
        ) : selectedTab == 'question' ? (
          <QuestionsView member={member} />
        ) : selectedTab == 'subscription' ? (
          <SubscriptionVIew list={member?.subscribers} />
        ) : selectedTab == '90days' ? (
          <NinetyDaysView member={member} graphData={_90DayGraph} />
        ) : selectedTab == 'calendar' && events != null ? (
          <CalenderView
            onArrowPress={onArrowPress}
            timezone={timezone}
            events={events}
            member={member}
            selectedDate={date}
            setDate={setDate}
            type={type}
            setType={onTypePress}
            loader={loader}
          />
        ) : selectedTab == 'daily-dynamite-graph' ? (
          <DailyDynamiteGraph />
        ) : null}
      </View>
    );
  };

  return (
    <RootView titleView={!!member ? () => topView() : undefined}>
      {!!member && (
        <View style={styles.flexOne}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <StatView member={member} />
            {TabView()}
            {showScreen()}
          </ScrollView>
        </View>
      )}
      <MyLoader enable={loader} />
      <SmsModal ref={ref_sms} />
    </RootView>
  );
};

export default MemberProfile;

const tabs = [
  {
    key: 'wol',
    title: STRINGS.MEMBER_PROFILE.tabs.wheelOfLife,
  },
  {
    key: 'question',
    title: STRINGS.MEMBER_PROFILE.tabs.questions,
  },
  {
    key: '90days',
    title: STRINGS.MEMBER_PROFILE.tabs.ninetyDays,
  },
  {
    key: 'subscription',
    title: STRINGS.MEMBER_PROFILE.tabs.subscriptions,
  },
  {
    key: 'daily-dynamite-graph',
    title: STRINGS.MEMBER_PROFILE.tabs.intentionsAnalysis,
  },
  {
    key: 'calendar',
    title: STRINGS.MEMBER_PROFILE.tabs.calendarEvents,
  },
];

const styles = StyleSheet.create({
  topViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 15,
  },
  topViewMemberContainer: {
    flex: 1,
  },
  whatsappButton: {
    backgroundColor: '#61D467',
  },
  messageButton: {
    backgroundColor: '#EDBF60',
  },
  smsButton: {
    backgroundColor: '#366FB1',
  },
  tabViewContainer: {
    marginVertical: 10,
    height: 40,
    justifyContent: 'center',
  },
  tabItemContainer: {
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  tabIndicator: {
    height: 2,
    width: '100%',
    marginTop: 2,
    borderRadius: 10,
  },
  tabSeparator: {
    height: 1,
    backgroundColor: colors.darkSecondary,
    shadowColor: colors.lightText2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
});
