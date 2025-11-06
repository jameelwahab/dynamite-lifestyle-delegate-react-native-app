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
import routes from '../../../navigation/routes';
import {selectUser} from '../../../redux/reducers/userSlice';
import {useSelector} from 'react-redux';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';

const MemberManage = ({route, navigation}) => {
  const {token, user} = useSelector(selectUser);
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const tab_list = [{title: 'Mission'}, {title: 'Quest'}];
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
          <View style={{height: 40}}>
            <TitleView
              title={`${result?.member?.first_name} ${result?.member?.last_name}`}
            />
          </View>

          <Tabs
            list={tab_list}
            tab={tab}
            style={{zIndex: 10}}
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
              <View
                style={{
                  backgroundColor: colors.secondary,
                  padding: 10,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <View>
                  <StatView
                    title={'Title'}
                    original={true}
                    value={item.mission_info.title}
                  />
                  <StatView
                    title={!tab ? 'Mission Duration' : 'Quest Duration'}
                    value={item.mission_duration}
                  />
                  <StatView
                    title={'Status'}
                    value={
                      item.mission_status == 'in_progress'
                        ? 'In Progress'
                        : 'Completed'
                    }
                  />
                </View>
                {!isSubTeam && (
                  <View style={{alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      onPress={() => onUserDetail(item)}
                      style={{padding: 5, marginTop: 10}}>
                      <MyText color={colors.primary} type="medium">
                        View More...
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
