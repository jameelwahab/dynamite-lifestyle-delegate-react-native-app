import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import RootView from '../../components/RootView';
import MyText from '../../components/MyText';
import MyLoader from '../../components/MyLoader';
import {DELETE_QUESTIONS, QUESTIONS_LIST_BY_MODULE} from '../../DAL';
import {useSelector} from 'react-redux';
import {selectUser} from '../../redux/reducers/userSlice';
import EmptyView from '../../components/EmptyView';
import {colors} from '../../utilities/colors';
import MyWebview from '../../components/MyWebview';
import {fonts} from '../../utilities/fonts';
import MyInputs from '../../components/MyInputs';
import MyCheckBox from '../../components/MyCheckBox';
import Collapsible from 'react-native-collapsible';
import {icons} from '../../utilities/icons';
import {MyButton} from '../../components/MyButton';
import openUrl from '../../functions/openUrl';
import MemberView from '../../components/MemberView';
import QuestionComponent from './Components/QuestionComponent';
import {useNavigation, useRoute} from '@react-navigation/native';
import AddQuestionComponent from './Components/AddQuestionComponent';
import ShowQuestionComponent from './Components/ShowQuestionComponent';
import FAB from '../../components/FAB';
import routes from '../../navigation/routes';
import ConfirmationModal from '../../components/ConfirmationModal';
import showToast from '../../functions/showToast';

const GenericQuetionListByModule = ({module, moduleId}) => {
  console.log('GenericQuetionListByModule');
  const navigation = useNavigation();
  const route = useRoute();
  const {token} = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [member, setMember] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isVisible: false,
    selectedItem: null,
  });

  const getQuestionsListFromServer = async () => {
    let res = await QUESTIONS_LIST_BY_MODULE({
      token,
      navigation,
      id: moduleId,
      module,
    });
    if (res.code == 200) {
      setList(res?.questionnaire);
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const onDeleteQuestion = item => {
    setConfirmModal({isVisible: true, selectedItem: item});
  };

  const onAgree = () => {
    setLoader(true);
    let item = confirmModal.selectedItem;
    setConfirmModal({isVisible: false, selectedItem: null});
    deleteQuestionFromServer(item);
  };

  const deleteQuestionFromServer = async item => {
    let res = await DELETE_QUESTIONS({
      token,
      navigation,
      questionId: item?._id,
    });
    if (res.code == 200) {
      setList(list => {
        return list.filter(x => x._id != item?._id);
      });
      setLoader(false);
      showToast({title: res?.message, type: 'success'});
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    setLoader(true);
    getQuestionsListFromServer();
  }, [route]);

  const onAddEditQuestion = item => {
    navigation.navigate(routes.addEditQuestions, {
      module,
      moduleId,
      screenName: route?.name,
      item,
    });
  };

  const topView = () => {
    return <View>{!!member && <MemberView member={member} />}</View>;
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          data={list}
          keyExtractor={item => item?._id}
          renderItem={({item, index}) => (
            <ShowQuestionComponent
              item={item}
              index={index}
              onAddEditQuestion={onAddEditQuestion}
              onDeleteQuestion={onDeleteQuestion}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView />}
          contentContainerStyle={{paddingBottom: 80}}
        />
      </View>

      <ConfirmationModal
        isVisible={confirmModal.isVisible}
        closeModal={() =>
          setConfirmModal({isVisible: false, selectedItem: null})
        }
        onAgree={onAgree}
        title={'Are you sure you want to delete this question?'}
      />

      <FAB onPress={() => onAddEditQuestion()} />

      <MyLoader enable={loader} />
    </View>
  );
};

export default GenericQuetionListByModule;
