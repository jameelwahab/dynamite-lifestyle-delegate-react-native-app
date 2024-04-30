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
import { MenuButton, MyButton } from '../../../components/MyButton';
import { GOAL_STATEMENT_ADD_REPLY, GOAL_STATEMENT_DELETE_REPLY, QUESTION_ADD_REPLY, QUESTION_DELETE_REPLY, QUESTION_EDIT_REPLY, QUESTION_REPLY_LIST } from '../../../DAL';
import ConfirmationModal from '../../../components/ConfirmationModal';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import OptionModal from '../../../components/OptionModal';



const ReplyModal = forwardRef(({ member, question, refresh, list, onClose }, ref) => {
  const navigation = useNavigation();
  const { token } = useSelector(selectUser);
  const [isVisible, setIsVisible] = useState(false);
  const [optionModal, setOptionModal] = useState({ isVisible: false, item: null })
  const [loader, setLoader] = useState(false);
  const [desc, setDesc] = useState("");
  const [editId, setEditId] = useState("");
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
      onClose?.()
      // setQuestion(null); 
      // setIndex(-1)
    }, 400);
  }

  const open = (sQuestion) => {
    setLoader(true)
    setIsVisible(true);
    setTimeout(() => {
      setLoader(false)
      // setQuestion(sQuestion)
      // setIndex(sQuestion);
    }, 400);
  }

  const closeOptionModal = () => setOptionModal({ isVisible: false, item: null });

  const onSelected = (opt) => {
    let { item } = optionModal;
    console.log(item, "item")
    closeOptionModal();

    if (opt.key === "edit") {
      setEditId(item?._id);
      setDesc(item?.comment);
      refreshEditor()
    } else if (opt.key === "delete") {
      setTimeout(() => {
        setConfirmation({ isVisible: true, item: item });
      }, 450);
    }
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


  const cancelEditing = () => {
    setEditId("");
    setDesc("");
    refreshEditor();
  }
  //! APIs

  const addCommnent = async () => {
    setLoader(true);

    let res = await QUESTION_ADD_REPLY({
      navigation, token, body: {
        member: member?._id,
        comment: desc.trim(),
        question_id: question?._id,

      }
    });
    if (res.code == 200) {
      refresh?.()
      // let newQuestion = { ...question, comment: [res?.comment, ...question.comment] }
      // setQuestion({ ...newQuestion })
      // setBackQuestion?.(newQuestion);
      setDesc("");
      showToast({ title: res?.message, type: 'success' });
      setLoader(false)
      setDesc("");
      refreshEditor()
    } else {
      setLoader(false)
    }
  }
  const editCommnent = async () => {
    setLoader(true);
    let res = await QUESTION_EDIT_REPLY({
      navigation, token, body: {
        member: member?._id,
        comment: desc.trim(),
        question_id: question?._id,
        comment_id: editId
      }
    });
    if (res.code == 200) {
      cancelEditing?.()
      // let newQuestion = { ...question, comment: [res?.comment, ...question.comment] }
      // setQuestion({ ...newQuestion })
      // setBackQuestion?.(newQuestion);
      // setDesc("");
      refresh?.();
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
    let res = await QUESTION_DELETE_REPLY({
      navigation, token,
      body: {
        member: member?._id,
        comment: desc.trim(),
        question_id: question?._id,
        comment_id: comment?._id,
      }
    });
    if (res.code == 200) {
      // let newQuestion = { ...question, comment: question.comment.slice().filter(x => x?._id != comment?._id) }
      // setQuestion({ ...newQuestion });
      // setBackQuestion?.(newQuestion);
      showToast({ title: res?.message, type: 'success' });
      refresh?.()
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
              <MyText fontSize={12} >{moment(item.createdAt).format(dateTimeFormat.dateTime)}</MyText>
            </View>
          </View>
          <MenuButton
            onPress={() => setOptionModal({ isVisible: item, item })}
          />
          {/* <TouchableOpacity
            onPress={() => setConfirmation({ isVisible: true, item: item })}
            style={__styles.deleteBtn}>
            {icons.threeDots()}
          </TouchableOpacity> */}
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
      avoidKeyboard
      style={{ margin: 0 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondaryVariant }}>
        <View style={{ flex: 1 ,paddingBottom:10}}>
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
                <MyWebview html={question?.question_statement} />
              </View>}
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <FlatList
                // data={!!Array.isArray(question?.answer?.comments) ? question?.answer?.comments : []}
                data={Array.isArray(question?.answer?.comments) ? question.answer?.comments.slice().reverse() : []}
                renderItem={renderList}
                ListEmptyComponent={(!loader) && <EmptyView label={"No Replies Found"} />}
                keyExtractor={(item) => item?._id}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View style={{ paddingHorizontal: 10,marginTop:5 }}>
              {editor &&
                <Editor
                label='Reply'
                  height={120}
                  initialValue={desc}
                  onChange={(text) => setDesc(text)}

                />}
              {!!editId ?
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  <MyButton
                    onPress={cancelEditing}
                    invert
                    title='Cancel'
                    style={{ paddingHorizontal: 20, }}
                  />

                  <MyButton
                    onPress={editCommnent}
                    invert
                    title='Update'
                    style={{ paddingHorizontal: 20, marginLeft: 10 }}
                  />
                </View> :
                <View style={{ alignItems: "flex-end" }}>
                  <MyButton
                    onPress={addCommnent}
                    invert
                    title='Submit'
                    style={{ paddingHorizontal: 20 }}
                  />
                </View>}
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

        <OptionModal
          optionList={optionsList}
          isVisible={optionModal?.isVisible}
          closeModal={closeOptionModal}
          onSelected={onSelected}
        />
      </SafeAreaView>
      {isVisible && <Toast />}
    </Modal>
  )
})

export default ReplyModal

const optionsList = [
  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },

]


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
    // padding: 10,
    marginTop: 20,
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