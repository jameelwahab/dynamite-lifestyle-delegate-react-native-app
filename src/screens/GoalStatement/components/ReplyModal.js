import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, FlatList, } from 'react-native'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import { icons } from '../../../utilities/icons';
import EmptyView from '../../../components/EmptyView';
import MyLoader from '../../../components/MyLoader';
import MyWebview from '../../../components/MyWebview';
import moment from 'moment';
import { dateTimeFormat } from '../../../utilities/constants';
import Editor from '../../../components/Editor';
import { MyButton } from '../../../components/MyButton';
import { GOAL_STATEMENT_ADD_REPLY, GOAL_STATEMENT_DELETE_REPLY } from '../../../DAL';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';



const ReplyModal = forwardRef(({ member, token, navigation, setBackQuestion }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [question, setQuestion] = useState(null);
  const [loader, setLoader] = useState(false);
  const [desc, setDesc] = useState("");
  const [confirmation, setConfirmation] = useState({
    isVisible: false,
    item: null
  })
  const [editor, setEditor] = useState(true);
  useImperativeHandle(ref, () => {
    return {
      open
    }
  }, [])



  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setQuestion(null);
    }, 400);
  }

  const open = (sQuestion) => {
    setLoader(true)
    setIsVisible(true);
    setTimeout(() => {
      setLoader(false)
      setQuestion(sQuestion);
    }, 400);
  }


  const onAgree = (opt) => {
    let { item } = confirmation;
    setConfirmation({ isVisible: false, item: null });
    deletCommnent(item);
  }

  const refreshEditor = () => {
    setEditor(false)
    setTimeout(() => {
      setEditor(true)
    }, 50);
  }

  //! APIs
  const addCommnent = async () => {
    setLoader(true);

    let res = await GOAL_STATEMENT_ADD_REPLY({
      navigation, token, body: {
        comment: desc.trim(),
        memberId: member?._id,
        questionId: question?._id
      }
    });
    if (res.code == 200) {
      let newQuestion = { ...question, comment: [res?.comment, ...question.comment] }
      setQuestion({ ...newQuestion })
      setBackQuestion?.(newQuestion);
      setDesc("");
      showToast({ title: res?.message, type: 'success' });
      setLoader(false)
      setDesc("");
      refreshEditor()
    } else {
      setLoader(false)
    }
  }


  const deletCommnent = async (comment) => {
    setLoader(true);
    let res = await GOAL_STATEMENT_DELETE_REPLY({ navigation, token, replyId: comment?._id });
    if (res.code == 200) {
      let newQuestion = { ...question, comment: question.comment.slice().filter(x => x?._id != comment?._id) }
      setQuestion({ ...newQuestion });
      setBackQuestion?.(newQuestion);
      showToast({ title: res?.message, type: 'success' });
      setLoader(false)
    } else {
      setLoader(false)
    }
  }





  const renderList = ({ item, index }) => {
    return (
      <View style={__styles.itemView}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <MyWebview html={item?.comment} />
            <View style={{ marginTop: 5 }}>
              <MyText fontSize={12} >{moment(item.createdAt).format(dateTimeFormat.date)}</MyText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setConfirmation({ isVisible: true, item: item })}
            style={__styles.deleteBtn}>
            {icons.trashFilled()}
          </TouchableOpacity>
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
            <MyText isHeading>Replies</MyText>
            <MyText>{member?.first_name + " " + member?.last_name}</MyText>
            <TouchableOpacity
              onPress={closeModal}
              style={__styles.closeBtn}>
              {icons.crosss(colors.primary)}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, }}>
            {!!question &&
              <View style={__styles.questionView} >
                <MyText>{question?.question}</MyText>
              </View>}
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <FlatList
                data={!!question ? question?.comment : []}
                renderItem={renderList}
                ListEmptyComponent={(!loader) && <EmptyView label={"No Replies Found"} />}
                keyExtractor={(item) => item?._id}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View style={{ paddingHorizontal: 10 }}>
              {editor &&
                <Editor
                  height={120}
                  initialValue={desc}
                  onChange={(text) => setDesc(text)}

                />}
              <View style={{ alignItems: "flex-end" }}>
                <MyButton
                  onPress={addCommnent}
                  invert
                  title='Submit'
                  style={{ paddingHorizontal: 20 }}
                />
              </View>
            </View>
          </View>
          <MyLoader enable={loader} />
        </View>

        <ConfirmationModal
          isVisible={confirmation?.isVisible}
          closeModal={() => setConfirmation({ isVisible: false, item: null })}
          onAgree={onAgree}
          title={"Are you sure you want to delete ?"}
        />
      </SafeAreaView>
      {isVisible && <Toast />}
    </Modal>
  )
})

export default ReplyModal

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
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  questionView: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomColor: colors.white + "55",
    borderBottomWidth: 1,
    paddingHorizontal: 10
  },
  deleteBtn: {
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 3,
    alignSelf: "flex-start"
  }
})