import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import { FlatList } from 'react-native-gesture-handler';
import EmptyView from '../../../components/EmptyView';
import { GOAL_STATEMENT_ANSWERS_HISTORY } from '../../../DAL';
import moment from 'moment';
import { dateTimeFormat } from '../../../utilities/constants';
import MyLoader from '../../../components/MyLoader';



const AnswerHistoryModal = forwardRef(({ member, token, navigation }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [list, setList] = useState([]);
  const [question, setQuestion] = useState(null)
  useImperativeHandle(ref, () => {
    return {
      open
    }
  }, [])

  //! APIs
  const getDataFromServer = async (question) => {
    let res = await GOAL_STATEMENT_ANSWERS_HISTORY({
      navigation, token, body:
        { member_id: member?._id, question_id: question?._id }
    });
    if (res.code == 200) {
      setList(res?.answer_stats)
      setLoader(false)
    } else {
      setLoader(false)
    }
  }



  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setList([]);
    }, 400);
  }

  const open = (sQuestion) => {
    setLoader(true);
    setQuestion(sQuestion);
    getDataFromServer(sQuestion)
    setIsVisible(true);
  }



  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={{ flexDirection: "row" }} >
          <View style={__styles.dot} />
          <View style={{ flex: 1 }}>
            <MyText>{item?.answer}</MyText>
          </View>
        </View>
        <View style={{ marginTop: 5 }}>
          <MyText fontSize={12} color={colors.lightText} >{moment(item?.createdAt).format(dateTimeFormat.date)}</MyText>
        </View>
      </View>
    )
  }



  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      animationInTiming={300}
      animationOutTiming={300}
      style={{ margin: 0 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondaryVariant }}>
        <View style={{ flex: 1 }}>
          <View style={__styles.header}>
            <MyText isHeading>Answer History</MyText>
            <TouchableOpacity
              onPress={closeModal}
              style={__styles.closeBtn}>
              {icons.crosss(colors.primary)}
            </TouchableOpacity>
          </View>
          {!!question &&
            <View style={__styles.questionView} >
              <MyText>{question?.question}</MyText>
            </View>}
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <FlatList
                data={list}
                renderItem={renderList}
                ListEmptyComponent={(!loader) && <EmptyView label={"No Answers yet!"} />}
                keyExtractor={(item) => item?._id}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <MyLoader enable={loader} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
})

export default AnswerHistoryModal

const __styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: colors.white + "55",
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  closeBtn: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    backgroundColor: colors.lightPrimary2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemView: {
    // backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 10,
    // marginTop: 10,

  },
  questionView: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomColor: colors.white + "55",
    borderBottomWidth: 1,
    paddingHorizontal: 10
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: colors.primary,
    marginTop: 5,
    marginRight: 10
  }
})