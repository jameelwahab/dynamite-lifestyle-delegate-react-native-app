import RootView from '../../../components/RootView';
import MyText from '../../../components/MyText';
import MyLoader from '../../../components/MyLoader';
import Tabs from '../../../components/Tabs';
import EmptyView from '../../../components/EmptyView';
import TitleView from '../../../components/TitleView';
import StatView from '../../../components/StatView';
import MyRefreshControl from '../../../components/MyRefreshControl';
import {MEMBER_MISSION_QUEST} from '../../../DAL';
import {colors} from '../../../utilities/colors';
import {STRINGS} from '../../../utilities/strings';
import routes from '../../../navigation/routes';
import {selectUser} from '../../../redux/reducers/userSlice';
import {useSelector} from 'react-redux';
import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useState, useEffect} from 'react';

const MemberManage = ({route, navigation}) => {
  const {token, user} = useSelector(selectUser);
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const tab_list = [
    {title: STRINGS.MEMBER_MANAGE.tabs.mission},
    {title: STRINGS.MEMBER_MANAGE.tabs.quest},
  ];
  const isSubTeam = user?.team_type == 'sub_team';

  const getMember = async ({load = false}) => {
    setLoading(load);
    const res = await MEMBER_MISSION_QUEST({
      token,
      navigation,
      member_id: route.params.memberId,
    });
    if (res.code == 200) {
      setResult(res);
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    getMember({load: true});
  }, []);

  const onUserDetail = item => {
    navigation.navigate(routes.missionReportScreen, {
      missionId: item?.mission_info?._id,
      memberId: item?.user_info?._id,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    getMember({load: false});
  };

  return (
    <RootView hideBackBottomButton hideSubHeader>
      <MyLoader enable={loading} />
      {!loading && (
        <>
          <View style={styles.titleContainer}>
            <TitleView
              title={`${result?.member?.first_name} ${result?.member?.last_name}`}
            />
          </View>

          <Tabs
            list={tab_list}
            tab={tab}
            style={styles.tabsZIndex}
            changeTab={e => setTab(e)}
          />
          <FlatList
            data={tab == 0 ? result?.missions : result?.quests}
            ListEmptyComponent={<EmptyView />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            refreshControl={
              <MyRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <View>
                  <StatView
                    title={STRINGS.MEMBER_MANAGE.title}
                    original={true}
                    value={item.mission_info.title}
                  />
                  <StatView
                    title={
                      !tab
                        ? STRINGS.MEMBER_MANAGE.missionDuration
                        : STRINGS.MEMBER_MANAGE.questDuration
                    }
                    value={item.mission_duration}
                  />
                  <StatView
                    title={STRINGS.MEMBER_MANAGE.status}
                    value={
                      item.mission_status == 'in_progress'
                        ? STRINGS.MEMBER_MANAGE.inProgress
                        : STRINGS.MEMBER_MANAGE.completed
                    }
                  />
                </View>
                {!isSubTeam && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => onUserDetail(item)}
                      style={styles.button}>
                      <MyText color={colors.primary} type="medium">
                        {STRINGS.MEMBER_MANAGE.viewMore}
                      </MyText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        </>
      )}
    </RootView>
  );
};

export default MemberManage;

const styles = StyleSheet.create({
  titleContainer: {
    height: 40,
  },
  tabsZIndex: {
    zIndex: 10,
  },
  itemContainer: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    padding: 5,
    marginTop: 10,
  },
});
