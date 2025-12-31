import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import {STRINGS} from '../../../utilities/strings';
import {MEMBER_QUESTIONS_MODULE_LIST} from '../../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../../redux/reducers/userSlice';
import EmptyView from '../../../components/EmptyView';
import StatView from '../Components/StatView';
import {colors} from '../../../utilities/colors';
import moment from 'moment';
import {dateTimeFormat} from '../../../utilities/constants';
import routes from '../../../navigation/routes';
import FooterLoader from '../../../components/FooterLoader';
import {MenuButton} from '../../../components/MyButton';
import OptionModal from '../../../components/OptionModal';
import {icons} from '../../../utilities/icons';
import MyLoader from '../../../components/MyLoader';
import MemberView from '../../../components/MemberView';

let page = 0;
let canLoadMore = false;
const QuestionsList = ({navigation, route}) => {
  let {token} = useSelector(selectUser);
  const {memberId, member} = route?.params;
  const [loader, setLoader] = useState(false);
  const [footerLoader, setFooterLoader] = useState(false);
  const [list, setList] = useState([]);
  const [optionModal, setOptionModal] = useState({
    isVisible: false,
    item: null,
  });

  const getQuestionsListFromServer = async (firstTime = false) => {
    let res = await MEMBER_QUESTIONS_MODULE_LIST({
      token,
      navigation,
      memberId: memberId,
    });
    if (res.code == 200) {
      let listLength = firstTime
        ? 0 + res.questionnaire_list
        : list.length + res.questionnaire_list;
      if (res?.total_count > listLength) {
        page = page + 1;
        canLoadMore = true;
      } else {
        canLoadMore = false;
      }
      setList(
        firstTime
          ? res.questionnaire_list
          : [...list, ...res.questionnaire_list],
      );
      setLoader(false);
      setFooterLoader(false);
    } else {
      setLoader(false);
      setFooterLoader(false);
    }
  };

  const onOptSelected = opt => {
    let {item} = optionModal;
    setOptionModal({isVisible: false, item: null});
    if (opt.key == STRINGS.QUESTIONS_LIST.optionKeys.answers) {
      navigation.navigate(routes.genericQestionListing, {
        created_for: item?.created_for,
        id: !!item?.created_for_id?._id ? item?.created_for_id?._id : '',
        memberId: memberId,
      });
    }
  };

  useEffect(() => {
    setLoader(true);
    getQuestionsListFromServer(true);
  }, []);

  const renderList = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.genericQestionListing, {
            created_for: item?.created_for,
            id: !!item?.created_for_id?._id ? item?.created_for_id?._id : '',
            memberId: memberId,
          });
        }}
        style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <MyText color={colors.primary}>{index + 1 + '.'}</MyText>
          <MenuButton
            size={20}
            onPress={() => setOptionModal({isVisible: true, item: item})}
          />
        </View>
        <StatView
          title={STRINGS.QUESTIONS_LIST.stats.questionsCreatedFor}
          value={item?.created_for.replace(/_/g, ' ').replace(/-/g, ' ')}
        />
        <StatView
          title={STRINGS.QUESTIONS_LIST.stats.moduleTitle}
          value={
            !!item?.created_for_id?.title
              ? item?.created_for_id?.title
              : STRINGS.GENERIC.N_A
          }
        />
        <StatView
          title={STRINGS.QUESTIONS_LIST.stats.answeredDate}
          value={moment(item?.reply_date).format(dateTimeFormat.date)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <RootView title={STRINGS.QUESTIONS_LIST.title}>
      {!!member && <MemberView member={member} />}
      <View style={styles.flex1}>
        <FlatList
          data={list}
          renderItem={renderList}
          ListEmptyComponent={!loader && <EmptyView />}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<FooterLoader isVisible={footerLoader} />}
          onEndReached={() => {
            if (canLoadMore) {
              canLoadMore = false;
              setFooterLoader(true);
              getQuestionsListFromServer(false);
            }
          }}
        />
      </View>
      <MyLoader enable={loader} />

      <OptionModal
        isVisible={optionModal?.isVisible}
        optionList={optionList}
        closeModal={() => setOptionModal({isVisible: false, item: null})}
        onSelected={onOptSelected}
      />
    </RootView>
  );
};

export default QuestionsList;

const optionList = [
  {
    key: STRINGS.QUESTIONS_LIST.optionKeys.answers,
    title: STRINGS.QUESTIONS_LIST.answersDetails,
    icon: () => icons.edit(colors.primary, 18),
  },
];

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: colors.secondary,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
});
