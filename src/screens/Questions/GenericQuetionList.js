import {View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../components/RootView';
import MyLoader from '../../components/MyLoader';
import {QUESTIONS_LIST} from '../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/reducers/userSlice';
import EmptyView from '../../components/EmptyView';
import MemberView from '../../components/MemberView';
import QuestionComponent from './Components/QuestionComponent';
import {Flex} from '../../UIComponents/FlexViews';

const GenericQuetionList = ({navigation, route}) => {
  const {token, S3_URL} = useSelector(selectUser);
  const {created_for, id: createdForId, memberId} = route?.params;
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [member, setMember] = useState(null);

  const getQuestionsListFromServer = async () => {
    let res = await QUESTIONS_LIST({
      token,
      navigation,
      body: {
        created_for: created_for || '',
        created_for_id: createdForId || '',
        member_id: memberId,
      },
    });
    if (res.code == 200) {
      setList(res?.questionnaire);
      setMember(res?.member);
      // setList(firstTime ? res.questionnaire_list : [...list, ...res.questionnaire_list])
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    getQuestionsListFromServer();
  }, []);

  const topView = () => {
    return <View>{!!member && <MemberView member={member} />}</View>;
  };

  return (
    <RootView titleView={topView}>
      <Flex flex={1}>
        <FlatList
          data={list}
          renderItem={({item, index}) => (
            <QuestionComponent item={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item?._id}
          ListEmptyComponent={!loader && <EmptyView />}
        />
      </Flex>
      <MyLoader enable={loader} />
    </RootView>
  );
};

export default GenericQuetionList;
