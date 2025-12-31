import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Keyboard,
  Platform,
  TouchableHighlight,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import {
  IS_CHAT_EXIST,
  LIST_OF_MEMBERS,
  LIST_OF_MEMBERS_ONLY,
  LIST_OF_NURTURE,
  UPDATE_CALL_FUNCTIONALITY,
} from '../../../DAL';
import {colors} from '../../../utilities/colors';
import numFormatter from '../../../functions/numFormatter';
import UserImage from '../../../components/UserImage';
import {icons} from '../../../utilities/icons';
import MyLoader from '../../../components/MyLoader';
import routes from '../../../navigation/routes';
import StatView from '../Components/StatView';
import {convertTimezone} from '../../../functions/convertTime';
import {selectTimeZone} from '../../../redux/reducers/timezoneSlice';
import {dateTimeFormat} from '../../../utilities/constants';
import MyInputs from '../../../components/MyInputs';
import SortModal from '../Components/SortModal';
import EmptyView from '../../../components/EmptyView';
import FooterLoader from '../../../components/FooterLoader';
import FilterModal from '../Components/FilterModal';
import moment from 'moment';
import {optionList, programStatusList} from '../Components/list';
import utilities from '../../../utilities';
import {MenuButton} from '../../../components/MyButton';
import SaveFilterModal from '../Components/SaveFilterModal';
import RNFetchBlob from 'react-native-blob-util';
import showToast from '../../../functions/showToast';
import LeadModal from '../Components/LeadModal';
import LeadHistoryModal from '../Components/LeadHistoryModal';
import InfoModal from '../../../components/InfoModal';
import ConfirmationModal2 from '../../../components/ConfirmationModal2';
import OptionModal2 from '../../../components/OptionModal2';
import breakReference from '../../../functions/breakReference';
import countries from '../../../assets/data/countryList.json';
import {Flex, Row} from '../../../UIComponents/FlexViews';
import MyImage from '../../../components/MyImage';
import isArray from '../../../functions/isArray';
import isObject from '../../../functions/isObject';
import {STRINGS} from '../../../utilities/strings';

let canLoadMore = false;
let page = 0;
const MemberList = ({navigation, route}) => {
  const ref_infoModal = useRef();
  const ref_optionModal = useRef();
  const ref_confirmModal = useRef();
  const {type} = route?.params;
  const isAllMembers = type == 'all-member';
  const isMembers = type == 'member';
  const isNurture = type == 'nurture';
  const {token, user, isChatAllowed, access, S3_URL} = useSelector(selectUser);
  const isSubTeam = user?.team_type == 'sub_team';
  const [showChips, setShowChips] = useState(false);
  const [member, setMember] = useState(null);
  const sortModalRef = useRef();
  const filterModalRef = useRef();
  const saveModalRef = useRef();
  const leadModalRef = useRef();
  const hitoryModalRef = useRef();
  const [loader, setLoader] = useState(true);
  const [footerLoader, setFooterLoader] = useState(false);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const timezone = useSelector(selectTimeZone);
  const [sorted, setSorted] = useState(sort);
  const [Filter, setFilter] = useState({...filteroObj});
  const [filterData, setFilterData] = useState(null);
  const [isSavedFilterApplied, setIsSavedFilterApplied] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [filterChipList, setFilterChipList] = useState([
    {
      label: sort.title,
      value: sort.key,
      type: 'sort',
    },
  ]);

  const updateFilter = updation => {
    setFilter(filter => ({...filter, ...updation}));
    setIsSavedFilterApplied(false);
  };

  const updateCallAPI = async member => {
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
      updateData(data);
    } else {
    }
  };

  const onOptSelected = (opt, item) => {
    if (opt?.key == 'notes') {
      navigation.navigate(routes.memberNotesListing, {
        for: 'members',
        memberId: item?._id,
        updateNotes: updateNotes,
      });
    } else if (opt?.key == 'subscription') {
      navigation.navigate(routes.memberSubscribersListing, {
        memberId: item?._id,
      });
    } else if (opt?.key == 'question-answer') {
      navigation.navigate(routes.memberQuestionListing, {
        memberId: item?._id,
        member: item,
      });
    } else if (opt?.key == 'manage-mission') {
      navigation.navigate(routes.memberManage, {
        memberId: item?._id,
      });
    } else if (opt?.key == 'profile') {
      navigation.navigate(routes.memberProfile, {
        memberId: item?._id,
        contactNumber: item?.contact_number,
      });
    } else if (opt?.key == 'update_call') {
      setTimeout(() => {
        ref_confirmModal?.current?.openModal({
          title: item?.is_call_allowed
            ? STRINGS.MEMBER_LIST.areYouSureDisableCall
            : STRINGS.MEMBER_LIST.areYouSureEnableCall,
          agreeFunc: () => updateCallAPI(item),
        });
      }, 500);
    } else if (opt?.key == 'subscription-list') {
      navigation.navigate(routes.memberSubscriptionList, {
        memberId: item?._id,
      });
    } else if (opt?.key == 'transaction-list') {
      navigation.navigate(routes.memberTransactionList, {
        memberId: item?._id,
      });
    }
  };

  const updateData = memberObj => {
    let index = list.findIndex(x => x._id === memberObj?._id);
    if (index > -1) {
      list.splice(index, 1, memberObj);
      setList([...list]);
    }
  };

  const makeCsv = async () => {
    let file = '';
    let header = `First Name, Last Name, Email, Contact Number\n`;
    list.forEach((x, i) => {
      file += `${x?.first_name}, ${x?.last_name}, ${x?.email}, ${x?.contact_number} \n`;
    });
    file = header + file;
    const pathToWrite =
      Platform.OS == 'ios'
        ? `${RNFetchBlob.fs.dirs.DocumentDir}/CSV/data.csv`
        : `${RNFetchBlob.fs.dirs.DownloadDir}/CSV/data.csv`;

    RNFetchBlob.fs
      .writeFile(pathToWrite, file, 'utf8')
      .then(async res => {
        if (Platform.OS == 'android') {
          let result = await RNFetchBlob.MediaCollection.copyToMediaStore(
            {
              name: 'data.csv', // name of the file
              parentFolder: 'Mission Control', // subdirectory in the Media Store, e.g. HawkIntech/Files to create a folder HawkIntech with a subfolder Files and save the image within this folder
              mimeType: 'text/csv',
            },
            'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
            pathToWrite, // Path to the file being copied in the apps own storage
          );
          showToast({
            title: STRINGS.MEMBER_LIST.csvFileDownloaded,
            type: 'success',
          });
        } else if (Platform.OS == 'ios') {
          showToast({
            title: STRINGS.MEMBER_LIST.csvFileDownloaded,
            type: 'success',
          });
        }
      })
      .catch(error => console.error(error));
  };

  const setSortfilter = sort => {
    let nOBj = {
      label: sort.title,
      value: sort.key,
      type: 'sort',
    };
    let index = filterChipList.findIndex(x => x.type == 'sort');
    if (index > -1) {
      filterChipList.splice(index, 1, nOBj);
    } else {
      filterChipList.push(nOBj);
    }
    setFilterChipList([...filterChipList]);
  };

  const filterTheData = (obj, data, isSavedFilter, isFilter) => {
    let list = [];

    if (!!sorted) {
      let nOBj = {
        label: sorted.title,
        value: sorted.key,
        type: 'sort',
      };
      list.push(nOBj);
    }
    // ref_firstRender?.current = false;

    console.log(obj, 'filterobj');
    Object.keys(obj).forEach((x, i) => {
      if (Array.isArray(obj[x])) {
        if (x == 'badge_levels') {
          obj[x].forEach((z, j) => {
            let obj = access?.badge_levels.find(y => y?._id == z);
            let nOBj = {
              label: obj?.title,
              value: obj?._id,
              type: x,
            };
            list.push(nOBj);
          });
        } else if (x == 'event_page') {
          let id = obj[x][0];
          if (!!id) {
            let label = data?.sale_pages.find(
              x => x._id == id,
            )?.sale_page_title;
            let nOBj = {
              label: label,
              value: id,
              type: x,
            };
            list.push(nOBj);
          }
        } else if (x == 'lead_status') {
          obj[x].forEach((z, j) => {
            let label = data?.lead_status.find(y => y._id == z)?.title;
            if (label) {
              let nOBj = {
                label: label,
                value: z,
                type: x,
              };
              list.push(nOBj);
            }
          });
        } else if (x == 'program') {
          obj[x].forEach((z, j) => {
            let label = data?.programs.find(y => y._id == z)?.title;
            if (label) {
              let nOBj = {
                label: label,
                value: z,
                type: x,
              };
              list.push(nOBj);
            }
          });
        }
      } else if (x == 'delegate' && !!obj[x]) {
        let label = getNameForDelage(data?.delegates_list, obj[x]);
        if (label) {
          let nOBj = {
            label: label,
            value: obj[x],
            type: x,
          };
          list.push(nOBj);
        }
      } else if (x == 'nurture' && !!obj[x]) {
        let label = getNameForDelage(data?.delegates_list, obj[x]);
        if (label) {
          let nOBj = {
            label: label,
            value: obj[x],
            type: x,
          };
          list.push(nOBj);
        }
      } else if (x == 'plan' && !!obj[x]) {
        let pageId = obj.event_page[0];
        if (!!pageId) {
          let nOBj = {
            label: data?.sale_pages
              .find(x => x._id == pageId)
              ?.payment_plans.find(z => z?._id == obj[x])?.plan_title,
            value: obj[x],
            type: x,
          };
          list.push(nOBj);
        }
      } else if (x == 'status' && typeof obj[x] == 'boolean') {
        let nOBj = {
          label: obj[x]
            ? STRINGS.MEMBER_LIST.active
            : STRINGS.MEMBER_LIST.inactive,
          value: 'statusActive',
          type: x,
        };
        list.push(nOBj);
      } else if (x == 'downloaded_app' && typeof obj[x] == 'boolean') {
        let nOBj = {
          label: obj[x]
            ? STRINGS.MEMBER_LIST.downloaded
            : STRINGS.MEMBER_LIST.notDownloaded,
          value: obj[x],
          type: x,
        };
        list.push(nOBj);
      } else if (x == 'program_status') {
        let statusObj = programStatusList.find(y => y.key == obj[x]);
        if (isObject(statusObj)) {
          let nOBj = {
            label: statusObj?.title,
            value: obj[x],
            type: x,
          };
          list.push(nOBj);
        }
      } else if (x == 'user_status_type' && !!obj[x]) {
        let nOBj = {
          label: obj[x],
          value: obj[x],
          type: x,
        };
        list.push(nOBj);
      } else if (x == 'member_ship_expiry' && obj[x] == 'expired') {
        let nOBj = {
          label: STRINGS.MEMBER_LIST.expired,
          value: obj[x],
          type: x,
        };
        list.push(nOBj);
      } else if (
        x == 'member_ship_expiry' &&
        obj[x] == 'not_expired' &&
        obj.expiry_in != 'custom'
      ) {
        let nOBj = {
          label: `${STRINGS.MEMBER_LIST.expireIn} ${obj.expiry_in} ${STRINGS.MEMBER_LIST.days}`,
          value: obj[x],
          type: 'expiry_in',
        };
        list.push(nOBj);
      } else if (
        x == 'member_ship_expiry' &&
        obj[x] == 'not_expired' &&
        obj.expiry_in == 'custom'
      ) {
        let nOBj = {
          label: `${STRINGS.MEMBER_LIST.membershipExpiryStartDate}${moment(
            obj?.membership_purchase_expiry_from,
          ).format(STRINGS.DATE_FORMATES.YYYY_MM_DD)}${
            STRINGS.MEMBER_LIST.membershipExpiryEndDate
          }${moment(obj?.membership_purchase_expiry_to).format(
            STRINGS.DATE_FORMATES.YYYY_MM_DD,
          )}`,
          value: obj[x],
          type: 'expiry_in',
        };
        list.push(nOBj);
      } else if (x == 'is_date_range' && !!obj[x]) {
        let nOBj = {
          label: `${STRINGS.MEMBER_LIST.startDate}${moment(
            obj?.from_date,
          ).format(STRINGS.DATE_FORMATES.YYYY_MM_DD)}${
            STRINGS.MEMBER_LIST.endDate
          }${moment(obj?.to_date).format(STRINGS.DATE_FORMATES.YYYY_MM_DD)}`,
          value: obj[x],
          type: x,
        };
        list.push(nOBj);
      } else if (x == 'coins_range' && !!obj[x]) {
        let nOBj = {
          label: `${STRINGS.MEMBER_LIST.startCoins}${obj.coins_from}${STRINGS.MEMBER_LIST.endCoins}${obj.coins_to}`,
          value: 'coins_range_true',
          type: x,
        };
        list.push(nOBj);
      }
    });
    console.log(list, 'list');
    setFilterChipList(list);
    setIsFilterApplied(isFilter);
    setIsSavedFilterApplied(isSavedFilter);
    setFilter({...obj});
    setFilterData(data);
    setFirstTimeLoad(false);
  };

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
      lead_status_expiry: expiry,
      lead_status_history: [
        {
          income_value: icome,
          changed_date_time: date,
          lead_status: lead,
        },
        ...member?.lead_status_history,
      ],
    };
    setList(members => {
      let index = members.findIndex(x => x?._id == member?._id);
      if (index > -1) {
        members[index] = {...member[index], ...obj};
      }
      return [...members];
    });
    // route?.params?.updateData?.({ ...obj });
  };

  const getMembers = async (isFirstTime, noSearch = false) => {
    if (isFirstTime) {
      setLoader(true);
      setList([]);
    }
    let res;
    Keyboard.dismiss();
    if (isAllMembers) {
      res = await LIST_OF_MEMBERS({
        token,
        navigation,
        page: page,
        searchText: noSearch ? '' : search,
        body: {
          sort_by: !!sorted ? sorted?.key : null,
          ...Filter,
          search_text: search,
        },
      });
    } else if (isMembers) {
      res = await LIST_OF_MEMBERS_ONLY({
        token,
        navigation,
        page: page,
        searchText: noSearch ? '' : search,
        body: {
          sort_by: !!sorted ? sorted?.key : null,
          ...Filter,
          search_text: search,
        },
      });
    } else if (isNurture) {
      res = await LIST_OF_NURTURE({
        token,
        navigation,
        page: page,
        searchText: noSearch ? '' : search,
        body: {
          sort_by: !!sorted ? sorted?.key : null,
          ...Filter,
          search_text: search,
        },
      });
    }
    if (res.code == 200) {
      let length = isFirstTime ? 0 : list.length;

      if (isAllMembers) {
        if (res?.total_member_count > res?.member.length + length) {
          page = page + 1;
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
        setList(isFirstTime ? res?.member : [...list, ...res?.member]);
        setTotal(res?.total_member_count);
      } else if (isMembers) {
        if (res?.total_count > res?.event_subscriber.length + length) {
          page = page + 1;
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
        setList(
          isFirstTime
            ? res?.event_subscriber
            : [...list, ...res?.event_subscriber],
        );
        setTotal(res?.total_count);
      } else if (isNurture) {
        if (res?.total_count > res?.member_array.length + length) {
          page = page + 1;
          canLoadMore = true;
        } else {
          canLoadMore = false;
        }
        setList(
          isFirstTime ? res?.member_array : [...list, ...res?.member_array],
        );
        setTotal(res?.total_count);
      }

      setLoader(false);
      setFooterLoader(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
    }
    isFirst = false;
  };

  const saveFilter = () => {
    saveModalRef?.current?.openModal();
  };

  const clearFilter = () => {
    setFilterChipList([]);
    setFilter({...filteroObj});
    setSorted(null);
    setIsFilterApplied(false);
    setIsSavedFilterApplied(false);
  };
  const updateNotes = (notes, MemberId) => {
    let newList = [...list];
    let index = list.findIndex(x => x._id === MemberId);
    if (index > -1) {
      let obj = {...list[index], personal_note: notes};
      newList.splice(index, 1, obj);
      setList(newList);
    }
  };

  const updateCallNote = (notes, MemberId) => {
    let newList = [...list];
    let index = list.findIndex(x => x._id === MemberId);
    if (index > -1) {
      let obj = {...list[index], call_history: notes};
      newList.splice(index, 1, obj);
      setList(newList);
    }
  };

  useEffect(() => {
    page = 0;
    canLoadMore = false;
    getMembers(true);
    // debounce(() => getMembers(true), 100)
  }, [JSON.stringify(sorted), JSON.stringify(Filter)]);

  // useEffect(() => {
  //   if (!isFirst) {

  //     page = 0;
  //     canLoadMore = false
  //     debounce(() => getMembers(true,), 100)
  //   }
  // }, [search])

  const onMemberDetail = item => {
    navigation.navigate(routes.memberDetails, {
      member: item,
      updateNotes: updateNotes,
      updateCallNote: updateCallNote,
      updateData: updateData,
    });
  };

  const topView = () => {
    return (
      <View style={styles.topViewContainer}>
        <View>
          <MyText fontSize={18} type="bold" color={colors.primary}>
            {isAllMembers
              ? STRINGS.MEMBER_LIST.allMembers
              : isMembers
              ? STRINGS.MEMBER_LIST.members
              : isNurture
              ? STRINGS.MEMBER_LIST.nurtureMembers
              : ''}
          </MyText>
          <MyText
            fontSize={10}
            type="medium"
            color={
              colors.lightText2
            }>{`${STRINGS.MEMBER_LIST.showing} ${list.length} ${STRINGS.MEMBER_LIST.of} ${total}`}</MyText>
        </View>
        <View style={styles.topViewButtonsContainer}>
          {((isMembers && access?.member_export_csv) ||
            (isNurture && access?.nurture_export_csv) ||
            (isAllMembers && access?.all_member_export_csv)) && (
            <TouchableOpacity
              onPress={() => makeCsv()}
              style={__styles.headerBtn}>
              <Image source={icons.csv} style={styles.csvIcon} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => sortModalRef?.current?.openModal()}
            style={__styles.headerBtn}>
            {icons.sort(colors.black, 17)}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => filterModalRef?.current?.openModal()}
            style={__styles.headerBtn}>
            {icons.filter(colors.black, 17)}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const chip = (title, onPress) => {
    return (
      <View key={'chip' + title} style={__styles.chipView}>
        <View>
          <MyText fontSize={12} color={colors.white}>
            {title}
          </MyText>
        </View>
        <TouchableOpacity onPress={onPress} style={__styles.chipBtn}>
          {icons.crosss(colors.primary, 15)}
        </TouchableOpacity>
      </View>
    );
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

  const getNameForDelage = (list, id) => {
    let obj = list.find(x => x._id == id);
    if (obj) {
      return obj?.first_name + ' ' + obj?.last_name;
    } else return null;
  };

  const countLength = () => {
    let count = 0;

    Object.keys(Filter).forEach(filter => {
      if (Array.isArray(Filter[filter])) {
        count = count + Filter[filter].length;
      } else if (typeof Filter[filter] == 'string') {
        if (
          filter != 'from_date' &&
          filter != 'to_date' &&
          filter != 'membership_purchase_expiry_from' &&
          filter != 'membership_purchase_expiry_to' &&
          filter != 'date' &&
          filter != 'status' &&
          !!Filter[filter] &&
          filter != 'coins_from' &&
          filter != 'coins_to'
        ) {
          count = count + 1;
        }
      } else if (typeof Filter[filter] == 'boolean') {
        if (Filter[filter]) {
          count = count + 1;
        }
      }
    });
    if (!!sorted) {
      count = count + 1;
    }
    return count;
  };

  const filterRemoveAction = item => {
    if (item.type == 'sort') {
      setSorted(null);
    } else if (item.type == 'badge_levels') {
      updateFilter({
        badge_levels: Filter?.badge_levels.slice().filter(z => z != item.value),
      });
    } else if (item.type == 'event_page') {
      updateFilter({event_page: []});
    } else if (item.type == 'lead_status') {
      updateFilter({
        lead_status: Filter?.lead_status.filter(y => y != item.value),
      });
    } else if (item.type == 'plan') {
      updateFilter({plan: null});
    } else if (item.type == 'delegate') {
      updateFilter({delegate: null});
    } else if (item.type == 'nurture') {
      updateFilter({nurture: null});
    } else if (item.type == 'nurture') {
      updateFilter({nurture: null});
    } else if (item.type == 'downloaded_app') {
      updateFilter({downloaded_app: null});
    } else if (item.type == 'user_status_type') {
      updateFilter({user_status_type: ''});
    } else if (item.type == 'member_ship_expiry') {
      updateFilter({member_ship_expiry: '', expiry_in: 3});
    } else if (item.type == 'expiry_in') {
      updateFilter({expiry_in: 3, member_ship_expiry: ''});
    } else if (item.type == 'is_date_range') {
      updateFilter({is_date_range: false, from_date: null, to_date: null});
    } else if (item.type == 'coins_range') {
      updateFilter({coins_range: false, coins_from: 0, coins_to: 0});
    } else if (item.type == 'program') {
      let status = '';
      let pList = Filter?.program.filter(y => y != item.value);
      if (!isArray(pList)) {
        status = '';
      } else {
        status = Filter?.program_status;
      }
      updateFilter({program: pList, program_status: status});
    } else if (item.type == 'program_status') {
      updateFilter({program_status: ''});
    }
    setFilterChipList(list => list.slice().filter(x => x.value != item.value));
  };

  const filterTheList = list => {
    return list.slice().filter(x => {
      if (x.key == 'profile') {
        return access?.view_profile;
      } else if (x.key == 'subscription-list' || x.key == 'transaction-list') {
        return isAllMembers;
      } else if (x.key == 'question-answer') {
        if (isSubTeam) {
          return isAllMembers;
        } else {
          return true;
        }
      } else return true;
    });
  };

  const headerView = () => {
    return (
      <View style={styles.headerViewContainer}>
        {filterChipList.length > 0 && (
          <>
            <Row alignItems="center" flexWrap="wrap">
              <View>
                <MyText type="bold">{STRINGS.MEMBER_LIST.filteredBy}</MyText>
              </View>
              {filterChipList.map((item, index) => {
                if ((index >= 4 && showChips) || index < 4)
                  return chip(item.label, () => filterRemoveAction(item));
              })}
              {filterChipList.length > 4 && (
                <Pressable onPress={() => setShowChips(!showChips)}>
                  <MyText type="medium" style={styles.seeAllText}>
                    {showChips
                      ? STRINGS.MEMBER_LIST.seeLess
                      : STRINGS.MEMBER_LIST.seeAll}
                  </MyText>
                </Pressable>
              )}

              {/* <TouchableOpacity
                onPress={clearFilter}
                style={{ borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.lightPrimary3, marginLeft: 5 }}>
                <MyText color={colors.primary}>{"Clear All"}</MyText>
              </TouchableOpacity> */}

              {/* {Filter?.community?.map((x) => chip(levelList.find(y => y.key == x).title, () => updateFilter({ community: Filter?.community.slice().filter(z => z != x) })))}
              {!!Filter?.event_page[0] && chip(filterData?.sale_pages.find((x) => x._id == Filter?.event_page[0])?.sale_page_title, () => updateFilter({ event_page: [] }))}
              {!!sorted && chip(sorted.title, () => setSorted(null))}
              {!!Filter?.event_page[0] && !!Filter?.plan && chip(filterData?.sale_pages.find((x) => x._id == Filter?.event_page[0])?.payment_plans.find(z => z?._id == Filter.plan)?.plan_title, () => updateFilter({ plan: null }))}
              {!!Filter?.nurture && chip(getNameForDelage(filterData?.delegates_list, Filter?.nurture), () => updateFilter({ nurture: null }))}
              {!!Filter?.delegate && chip(getNameForDelage(filterData?.delegates, Filter?.delegate), () => updateFilter({ delegate: null }))}
              {Filter?.lead_status?.map((x) => chip(filterData?.lead_status.find(y => y._id == x)?.title, () => updateFilter({ lead_status: Filter?.lead_status.filter(y => y != x) })))}
              {typeof (Filter?.status) == "boolean" && chip(Filter?.status ? "Active" : "Inactive", () => updateFilter({ status: "" }))}
              {Filter?.user_status_type != "" && chip(onlineStatusList.find(x => x.key == Filter?.user_status_type)?.title, () => updateFilter({ user_status_type: "" }))}
              {Filter?.member_ship_expiry != "" && Filter?.member_ship_expiry != 'not_expired' && chip(membershipStatusList.find(x => x.key == Filter?.member_ship_expiry)?.title, () => updateFilter({ member_ship_expiry: "" }))}
              {Filter?.member_ship_expiry != "" && Filter?.member_ship_expiry == 'not_expired' && Filter?.expiry_in != 'custom' && chip(`Expiry in ${expireDaysList.find(x => x.key == Filter?.expiry_in)?.title}`, () => updateFilter({ expiry_in: 3, member_ship_expiry: "" }))}
              {Filter?.member_ship_expiry != "" && Filter?.member_ship_expiry == 'not_expired' && Filter?.expiry_in == "custom" && chip(`Membership Expiry Start Date : ${moment(filterData?.membership_purchase_expiry_from).format("YYYY-MM-DD")} - Membership Expiry End Date : ${moment(filterData?.membership_purchase_expiry_to).format("YYYY-MM-DD")}`, () => updateFilter({ expiry_in: 3, member_ship_expiry: "" }))}
              {!!Filter?.is_date_range && !!Filter?.from_date != "" && !!Filter?.to_date != "" && chip(`Start Date : ${moment(filterData?.from_date).format("YYYY-MM-DD")} - End Date : ${moment(filterData?.to_date).format("YYYY-MM-DD")}`, () => updateFilter({ is_date_range: false, from_date: null, to_date: null }))}
              {!!Filter?.coins_range && chip(`Start Coins : ${Filter?.coins_from} - End Coins : ${Filter?.coins_to}`, () => updateFilter({ coins_range: false, coins_from: 0, coins_to: 0 }))} */}
            </Row>

            {filterChipList.length > 0 && firstTimeLoad == false && (
              <View style={styles.filterButtonsContainer}>
                <Pressable onPress={clearFilter}>
                  <TouchableOpacity
                    onPress={clearFilter}
                    style={styles.filterButton}>
                    <MyText color={colors.primary}>
                      {STRINGS.MEMBER_LIST.clearFilter}
                    </MyText>
                  </TouchableOpacity>
                </Pressable>

                <View style={styles.rowContainer}>
                  {
                    !isSavedFilterApplied && (
                      <TouchableOpacity
                        onPress={saveFilter}
                        style={styles.filterButton}>
                        <MyText color={colors.primary}>
                          {STRINGS.MEMBER_LIST.saveFilter}
                        </MyText>
                      </TouchableOpacity>
                    )
                    // <MyButton invert textStyle={{fontSize:12}} style={{paddingHorizontal:5,height:30}} title='Save Filter' onPress={saveFilter} />
                  }

                  {/* <TransparentButton title='Clear All' onPress={clearFilter} /> */}
                </View>
                {/* {filterChipList.length > 4 &&
                  <TouchableOpacity
                    onPress={() => setShowChips(!showChips)}
                    style={{ borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.lightPrimary3, marginLeft: 5, flexDirection: "row", alignItems: "center" }}>
                    <MyText color={colors.primary}>{showChips ? "Show Less" : "Show All"}</MyText>
                    <View style={{ transform: [{ rotateZ: showChips ? "180deg" : "0deg" }] }}>
                      {icons.down(colors.primary, 15)}
                    </View>
                  </TouchableOpacity>} */}
                {/* {countLength() > 5 &&
                 <TransparentButton title={showChips ?
                  "Show Less" : "Show All"} onPress={() => setShowChips(!showChips)} />
                  } */}
              </View>
            )}
          </>
        )}
        {/* <Collapsible collapsed={searchCollapsed}> */}
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputContainer}>
              <MyInputs
                rightIcon={
                  search.length > 0 ? icons.crosssWithCircle_20 : icons.noIcon
                }
                value={search}
                placeholder={STRINGS.MEMBER_LIST.search}
                onChangeText={text => setSearch(text)}
                rightIconOnPress={() => {
                  setSearch('');
                }}
                noSpace
                isSearch={true}
                onSubmitEditing={() => {
                  page = 0;
                  canLoadMore = false;
                  getMembers(true);
                }}
              />
            </View>
            <View style={styles.searchButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  page = 0;
                  canLoadMore = false;
                  getMembers(true);
                }}
                style={styles.searchButton}>
                {icons.search(colors.primary, 20)}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* </Collapsible> */}
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
            styles.badgeActiveView,
            {
              backgroundColor: item?.is_membership_active
                ? colors.active
                : colors.delete,
            },
          ]}>
          <MyText
            fontSize={10}
            uppercase
            type="bold"
            // color={item?.is_membership_active ? colors.active : colors.delete}
            color={colors.white}>
            {item?.is_membership_active
              ? STRINGS.MEMBER_LIST.active
              : STRINGS.MEMBER_LIST.expired}
          </MyText>
        </View>
      </Row>
    );
  };

  const leadStatusView = item => {
    return (
      <View style={styles.rowContainer}>
        <TouchableHighlight
          style={styles.flexOne}
          onPress={() => {
            setMember(item);
            leadModalRef?.current?.openModal();
          }}>
          <View
            style={[
              __styles.leadRootView,
              !!item?.lead_status && {
                backgroundColor: item?.lead_status?.background_color,
              },
            ]}>
            <Flex flex={1}>
              <MyText
                color={
                  !!item?.lead_status
                    ? item?.lead_status?.text_color
                    : colors.white
                }>
                {!!item?.lead_status
                  ? item?.lead_status?.title
                  : STRINGS.MEMBER_LIST.leadStatus}
              </MyText>
            </Flex>
            <View style={__styles.leadStatusIconView}>
              {icons.down(colors.primary, 15)}
            </View>
          </View>
        </TouchableHighlight>
        {!!item?.lead_status > 0 && (
          <TouchableOpacity
            onPress={() => {
              setMember(item);
              hitoryModalRef?.current?.openModal();
            }}
            style={__styles.historyBtn}>
            {icons.history(colors.primary, 15)}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderMemberList = useCallback(
    ({item, index}) => {
      return (
        <View style={[__styles.memberRootView]}>
          <Row alignItems="center">
            <Pressable
              onPress={() => {
                if (access?.view_profile)
                  navigation.navigate(routes.memberProfile, {
                    memberId: item?._id,
                  });
              }}
              style={styles.memberProfilePressable}>
              <View>
                <UserImage
                  borderWidth={2}
                  borderColor={
                    item?.membership_level_badge_info
                      ?.membership_level_badge_color_code
                  }
                  image={item?.profile_image}
                  name={item?.first_name}
                  size={30}
                />

                <View
                  style={[
                    {
                      backgroundColor: item?.is_online
                        ? colors.online
                        : colors.primary2,
                    },
                    __styles.memberStatusView,
                  ]}
                />

                {/* <View style={[{ backgroundColor: item?.is_membership_active ? colors.active : colors.expire, }, __styles.memberActiveView]} /> */}
              </View>

              <View style={__styles.memberProfileNameView}>
                <MyText fontSize={14} type="bold">
                  {item?.first_name + ' ' + item?.last_name}
                </MyText>
                {isAllMembers && <MyText fontSize={12}>{item?.email}</MyText>}
              </View>
            </Pressable>

            <MyText style={styles.countryFlag}>
              {countries.find(el => el.code === item?.country)?.flag || ''}
            </MyText>
            <Pressable
              onPress={() =>
                ref_infoModal?.current?.openModal(
                  item?.downloaded_app
                    ? STRINGS.MEMBER_LIST.memberHasDownloadedApp
                    : STRINGS.MEMBER_LIST.memberHasNotDownloadedApp,
                )
              }
              style={styles.appDownloadIcon}>
              {item?.downloaded_app
                ? icons.appDownloadedEmoji(25)
                : icons.appNotDownloadedEmoji(25)}
            </Pressable>

            {item?.is_wheel_of_life && (
              <View style={styles.wheelOfLifeIcon}>
                <Image
                  source={icons.wheelOfLife}
                  style={styles.wheelOfLifeImage}
                />
              </View>
            )}

            {isChatAllowed && (
              <TouchableOpacity
                style={styles.chatIcon}
                onPress={() => onChatScreen(item?._id)}>
                {icons.message(colors.primary, 20)}
              </TouchableOpacity>
            )}

            <MenuButton
              size={20}
              onPress={() => {
                ref_optionModal?.current?.openModal?.(item);
              }}
            />
          </Row>

          <View>
            <StatView
              title={STRINGS.MEMBER_LIST.membershipExpire}
              value={
                !!item?.membership_purchase_expiry
                  ? !isAllMembers
                    ? moment(new Date(item?.membership_purchase_expiry)).format(
                        dateTimeFormat.date,
                      )
                    : item?.membership_purchase_expiry
                  : STRINGS.MEMBER_LIST.na
              }
            />
            <StatView
              title={STRINGS.MEMBER_LIST.coins}
              value={numFormatter(item?.coins_count)}
              uppercase
            />
            {/* <StatView title={"App Downloaded"} value={numFormatter(item?.coins_count)} uppercase /> */}
            {isAllMembers && (
              <StatView
                title={STRINGS.MEMBER_LIST.refferedUser}
                value={
                  !!item?.affliliate?.affiliate_user_info?.first_name
                    ? item?.affliliate?.affiliate_user_info?.first_name +
                      ' ' +
                      item?.affliliate?.affiliate_user_info?.last_name +
                      ' (' +
                      item?.affliliate?.affiliate_url_name +
                      ') '
                    : STRINGS.MEMBER_LIST.masterLink
                }
              />
            )}
            {!isNurture && access?.Show_nurture_in_filter && (
              <StatView
                title={STRINGS.MEMBER_LIST.nurture}
                value={
                  !!item?.nurture
                    ? item?.nurture?.first_name + ' ' + item?.nurture?.last_name
                    : STRINGS.MEMBER_LIST.na
                }
              />
            )}
            {!isMembers && (
              <StatView
                title={STRINGS.MEMBER_LIST.delegate}
                value={
                  !!item?.consultant
                    ? item?.consultant?.first_name +
                      ' ' +
                      item?.consultant?.last_name
                    : STRINGS.MEMBER_LIST.na
                }
              />
            )}
            <StatView
              title={STRINGS.MEMBER_LIST.badgeLevel}
              // icon_img={item?.membership_level_badge_info?.membership_level_badge_icon?.thumbnail_1}
              // value={item?.membership_level_badge_info?.membership_level_badge_title}
              view={() => badgeLevelView(item)}
            />
            <StatView
              title={STRINGS.MEMBER_LIST.lastLoginActivity}
              uppercase
              value={convertTimezone(
                item?.last_login_activity,
                timezone,
              ).format(dateTimeFormat.dateTime)}
            />
            <StatView
              title={STRINGS.MEMBER_LIST.leadStatus}
              view={() => leadStatusView(item)}
            />

            {/* <StatView title={"Regis Expire"} value={convertTimezone(item?.createdAt, timezone).format(dateTimeFormat.date)} /> */}
          </View>

          <View style={styles.viewMoreContainer}>
            <TouchableOpacity
              onPress={() => onMemberDetail(item)}
              style={styles.viewMoreButton}>
              <MyText color={colors.primary} type="medium">
                {STRINGS.MEMBER_LIST.viewMore}
              </MyText>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [list],
  );

  return (
    <RootView hideBackBottomButton titleView={topView}>
      <Flex flex={1}>
        <FlatList
          removeClippedSubviews={true}
          windowSize={10}
          keyExtractor={item => item?._id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={headerView()}
          stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          data={list}
          renderItem={renderMemberList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          onEndReached={() => {
            if (canLoadMore) {
              canLoadMore = false;
              setFooterLoader(true);
              getMembers(false);
            }
          }}
        />
      </Flex>
      <MyLoader enable={loader} />

      <InfoModal ref={ref_infoModal} />
      <ConfirmationModal2 ref={ref_confirmModal} />

      <SortModal
        ref={sortModalRef}
        onSelected={selected => {
          setSorted(selected);
          setSortfilter(selected);
        }}
        alreadySelected={sorted}
      />
      <FilterModal
        token={token}
        filterTheData={filterTheData}
        ref={filterModalRef}
        appliedFilter={{...Filter, isSavedFilterApplied: isSavedFilterApplied}}
        type={type}
        isMembers={isMembers}
        isNurture={isNurture}
        isAllMembers={isAllMembers}
        isNurtureAccessable={access?.Show_nurture_in_filter}
      />

      <SaveFilterModal
        token={token}
        navigation={navigation}
        ref={saveModalRef}
        tabName={type}
        filters={Filter}
        filterData={filterData}
        searchText={search}
        sort={sorted}
        isMembers={isMembers}
        isNurture={isNurture}
        isAllMembers={isAllMembers}
        access={access}
      />

      <OptionModal2
        ref={ref_optionModal}
        onSelected={onOptSelected}
        optionList={filterTheList(optionList)}
      />

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
    </RootView>
  );
};

export default MemberList;

const sort = {
  key: 'registration_date_desc',
  title: 'Registration Date (Newest First)',
};

const filteroObj = {
  // "community": [],
  badge_levels: [],
  event_page: [],
  lead_status: [],
  plan: null,
  nurture: null,
  delegate: null,
  is_date_range: false,
  coins_range: false,
  coins_from: 0,
  coins_to: 0,
  from_date: null,
  to_date: null,
  downloaded_app: null,
  membership_purchase_expiry_from: moment(),
  membership_purchase_expiry_to: moment(),
  date: null,
  coins: null,
  membership_expiry: null,
  status: '',
  expiry_in: 3,
  member_ship_expiry: '',
  user_status_type: '',
  program: [],
  program_status: '',
};

const __styles = StyleSheet.create({
  memberRootView: {
    backgroundColor: colors.secondary,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },

  memberStatusView: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 9,
    width: 9,
    borderRadius: 10 / 2,
    borderWidth: 1,
    borderColor: colors.white,
  },
  memberActiveView: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
  },
  memberProfileNameView: {flex: 1, marginLeft: 10},
  headerBtn: {
    height: 28,
    width: 28,
    borderRadius: 28 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    backgroundColor: colors.primary,
  },
  chipView: {
    paddingVertical: 2,
    paddingRight: 5,
    paddingLeft: 10,
    backgroundColor: colors.chip,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2,
    maxWidth: utilities.screenWidth() - 40,
  },
  chipBtn: {
    marginLeft: 5,
    height: 20,
    width: 20,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20 / 2,
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
  historyBtn: {
    width: 30,
    paddingVertical: 5,
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  topViewContainer: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  topViewButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  csvIcon: {
    height: 12,
    aspectRatio: 1.5,
  },
  seeAllText: {
    color: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    paddingVertical: 5,
    backgroundColor: colors.lightPrimary3,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  searchContainer: {
    marginTop: 5,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    marginTop: -15,
  },
  searchButtonContainer: {
    marginLeft: 5,
  },
  searchButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    flex: 1,
    marginTop: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  badgeActiveView: {
    borderRadius: 5,
    padding: 3,
    marginLeft: 5,
  },
  flexOne: {
    flex: 1,
  },
  memberProfilePressable: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  countryFlag: {
    marginRight: 10,
  },
  appDownloadIcon: {
    marginRight: 10,
  },
  wheelOfLifeIcon: {
    marginRight: 10,
  },
  wheelOfLifeImage: {
    height: 20,
    width: 20,
  },
  chatIcon: {
    marginRight: 5,
  },
  viewMoreContainer: {
    alignItems: 'flex-end',
  },
  viewMoreButton: {
    padding: 5,
    marginTop: 10,
  },
  badgeIcon: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  headerViewContainer: {
    backgroundColor: colors.darkSecondary,
  },
});
