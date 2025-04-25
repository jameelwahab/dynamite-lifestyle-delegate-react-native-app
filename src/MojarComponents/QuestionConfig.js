import { View, Text, Pressable, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ADD_ANSWER_FOR_SPECIFIC_QUESTION, GET_QUESTIONS_CONFIGURRATION, UPLOAD_FILE_QUESTIONS } from '../DAL'
import MyLoader from '../components/MyLoader';
import MyText from '../components/MyText';
import MyWebview from '../components/MyWebview';
import { colors } from '../utilities/colors';
import { fonts } from '../utilities/fonts';
import MyCheckBox from '../components/MyCheckBox';
import Collapsible from 'react-native-collapsible';
import { icons } from '../utilities/icons';
import MyInputs from '../components/MyInputs';
import { MyButton } from '../components/MyButton';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import openUrl from '../functions/openUrl';
import ImageUploadModal from '../components/ImageUploadModal';
import showToast from '../functions/showToast';
import EmptyView from '../components/EmptyView';
import utilities from '../utilities';
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/reducers/userSlice'

const QuestionConfig = ({
  token, navigation,
  created_for = null,
  created_for_id = null,
  description = ""
}) => {
  const [loader, setLoader] = useState(true);
  const [list, setList] = useState([])
  const [collapsed, setCollapsed] = useState({});
  const [answers, setAnswers] = useState([])
  const [filerPicker, setFilerPicker] = useState({ isVisible: false, item: null });
  const { S3_URL } = useSelector(selectUser)


  useEffect(() => {
    getQuestions()
  }, [])

  //! functionalities

  const toggleCollpasible = (id) => {
    if (!collapsed[id]) {
      collapsed[id] = true;
    } else {
      delete collapsed[id];
    }
    setCollapsed({ ...collapsed })
  }

  const getAnswers = (item) => {
    let index = answers.findIndex(x => x._id == item._id);
    if (index > -1) {
      return answers[index].answer_statement;
    } else {
      return null
    }
  }

  const findDocumentUrl = (id) => {
    let array = [...answers];
    let index = array.findIndex(x => x._id == id);
    if (index > -1) {
      return array[index].document_url;
    } else {
      return null
    }
  }

  const removeDocument = async (item) => {
    let array = [...answers];
    let index = array.findIndex(x => x._id == item._id);
    if (index > -1) {
      let obj = array[index];
      delete obj.document_url;
      array.splice(index, 1, obj);
      setAnswers([...array])
    }
  }

  const AnswerTheQuestions = (item, answer = undefined, fileURL = undefined) => {
    let array = [...answers];
    let index = array.findIndex(x => x._id == item._id);
    let obj;
    if (item.question_type != "checkbox") {

      obj = {
        _id: item._id,
      }
      if (index > -1) {
        if (!!array[index].answer_statement) {
          obj.answer_statement = array[index].answer_statement
        }
        if (!!array[index].document_url) {
          obj.document_url = array[index].document_url
        }
      }
      if (answer != undefined) {
        obj.answer_statement = answer
      }
      if (fileURL != undefined) {
        obj.document_url = fileURL
      }
      if (index > -1) {
        array.splice(index, 1, obj)
      } else {
        array.push(obj)
      }
    } else {
      obj = {
        _id: item._id,

      }
      if (index > -1) {
        if (!!array[index]?.answer_statement) {
          obj.answer_statement = array[index].answer_statement
        }
        if (!!array[index]?.document_url) {
          obj.document_url = array[index].document_url
        }
      }
      if (answer != undefined) {
        let checkboxArray = [];
        if (index > -1) {
          checkboxArray = array[index].answer_statement;
        }
        let index2 = checkboxArray.findIndex(x => x == answer);
        if (index2 > -1) {
          checkboxArray.splice(index2, 1);
        } else {
          checkboxArray.push(answer);
        }
        obj.answer_statement = checkboxArray
      }
      if (fileURL != undefined) {
        obj.document_url = fileURL
      }

      if (index > -1) {
        array.splice(index, 1, { ...obj })
      } else {
        array.push(obj)
      }
    }
    setAnswers([...array]);
  }

  const onDocumentPress = (item, document) => {
    if (document) {
      openUrl(S3_URL + document);
    } else {
      setFilerPicker({ isVisible: true, item: item });
    }
  }

  const onImagePicked = async (file) => {
    setLoader(true);
    let item = filerPicker?.item;
    let fd = new FormData();
    fd.append("file", file);
    let res = await UPLOAD_FILE_QUESTIONS({ token, navigation, file: fd });
    setLoader(false);
    if (res.code == 200) {
      AnswerTheQuestions(item, undefined, res?.image_path)
    }
  }

  //! API's
  const getQuestions = async () => {
    let res = await GET_QUESTIONS_CONFIGURRATION({ navigation, token, created_for, created_for_id });
    setLoader(false);
    if (res.code == 200) {
      setList(res?.questionnaire);
      setAnswers(res?.questionnaire_replies)
    }
  }

  const saveAnswerAPI = async () => {
    setLoader(true);
    let res = await ADD_ANSWER_FOR_SPECIFIC_QUESTION({ navigation, token, created_for, created_for_id, question_answer_array: answers });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: 'success' });
    }
  }


  //! Views

  //?   Qestion Type Views start

  const scalingQuestionView = (item, index) => {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }} >
        {Array((item.scaling_max - item.scaling_min) + 1).fill((item.scaling_max - item.scaling_min) + 1).map((y, j) => {
          return (
            <Pressable
              onPress={() => AnswerTheQuestions(item, item.scaling_min + j)}
              style={[__styles.scaleView, {
                backgroundColor: (getAnswers(item) >= (item.scaling_min + j)) ? colors.beige : colors.secondary
              }]} >
              <MyText
                color={(getAnswers(item) >= item.scaling_min + j) ? colors.white : colors.beige}
                type={fonts.medium}>
                {item.scaling_min + j}
              </MyText>
            </Pressable>
          )
        })}
      </View>
    )
  }

  const RadioButtonView = (item, index) => {

    return (
      <View >
        {item.options.map((item2, index2) => (
          <MyCheckBox
            key={"RadioBtnOptions" + index2}
            title={item2}
            circle
            value={getAnswers(item) == item2}
            onPress={() => AnswerTheQuestions(item, item2)}
            pb={15}
            isNormalText={true}
          />
        ))}
      </View>
    )


  }

  const checkBoxButtonView = (item, index) => {
    return (
      <View >
        {item.options.map((item2, index2) => (
          <MyCheckBox
            key={"checkboxOptions" + index2}
            title={item2}
            value={!!getAnswers(item)?.find(x => x == item2)}
            onPress={() => AnswerTheQuestions(item, item2)}
            pb={15}
            isNormalText={true}
          />
        ))}
      </View>
    )
  }

  const textAreaView = (item, index) => {
    return (
      <View>
        <MyInputs
          multiline={true}
          noLable
          placeholder={item.question_placeholder}
          value={getAnswers(item)}
          onChangeText={(text) => AnswerTheQuestions(item, text)}
        />
      </View>
    )
  }

  const renderQuestion = ({ item, index }) => {
    let document = item?.is_document_allowed ? findDocumentUrl(item?._id) : null;
    return (
      <View style={__styles.questionView}>
        <Pressable
          onPress={() => toggleCollpasible(item?._id)}
          style={{ flexDirection: "row", paddingVertical: 5 }}>
          <View style={{ flex: 1 }}>
            <MyWebview html={item?.question_statement}
              style={__webViewStyles}
            />
          </View>
          {!collapsed[item?._id] ? icons.upwardArrow() : icons.downwardArrow()}
        </Pressable>

        <Collapsible collapsed={!!collapsed[item?._id]}>
          <View style={{ marginTop: 10 }}>
            {item?.question_type == "scaling" ? scalingQuestionView(item, index) :
              item?.question_type == "mcq" ? RadioButtonView(item, index) :
                item?.question_type == "checkbox" ? checkBoxButtonView(item, index) :
                  item?.question_type == "textarea" ? textAreaView(item, index) : null}
          </View>

          <View style={__styles.btnRow}>
            <View style={{}}>
              <MyButton
                invert
                title='Save'
                style={__styles.btn}
                onPress={saveAnswerAPI}
              />
            </View>
            {item?.is_document_allowed &&
              <View style={{ marginLeft: 10, }}>
                <MyButton
                  onPress={() => onDocumentPress(item, document)}
                  invert
                  style={__styles.btn}
                  title={document ? 'View Document' : "upload Document"}
                  leftIcon={!document ? icons.upload2 : undefined}
                  noSpace
                />
                {document &&
                  <TouchableOpacity
                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    onPress={() => removeDocument(item)}
                    style={__styles.cancelBtn}>
                    {icons.crosss(colors.white, 18)}
                  </TouchableOpacity>}
              </View>}

          </View>
        </Collapsible>
      </View>)
  }

  const header = () => {
    return (
      <>{!!description &&
        <View style={{ alignSelf: "center", paddingVertical: 5 }}>
          <MyWebview width={utilities.screenWidth() - 20} html={description} />
        </View>}
      </>
    )
  }

  const footer = (
    <View style={{ alignSelf: "center", paddingVertical: 30 }}>
      {list.length > 0 &&
        <MyButton
          onPress={saveAnswerAPI}
          title='Submit'
          style={{ paddingHorizontal: 50, }}
        />}
    </View>
  )

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <KeyboardAwareFlatList
          enableResetScrollToCoords={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id}
          data={list}
          renderItem={renderQuestion}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          ListEmptyComponent={!loader && <EmptyView label={"Questions Not Found!"} />}
        />
      </View>

      <MyLoader enable={loader} />
      <ImageUploadModal
        isVisible={filerPicker?.isVisible}
        closeModal={() => setFilerPicker({ isVisible: false })}
        enableDocument={true}
        onImagePicked={onImagePicked}
      />
    </View>
  )
}

export default QuestionConfig;

const __styles = StyleSheet.create({
  questionView: {
    backgroundColor: colors.secondary,
    padding: 10,
    marginTop: 10,
    borderRadius: 10
  },
  btnRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 15 },
  btn: {
    paddingHorizontal: 10, height: 40
  },
  scaleView: {
    height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.beige, alignItems: "center", justifyContent: "center", margin: 3,
  },
  cancelBtn: {
    position: "absolute",
    top: -15,
    right: 0,
    backgroundColor: colors.delete,
    borderRadius: 25 / 2,
    height: 25,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
  }
})

const __webViewStyles = {
  a: {
    color: colors.white,
    textDecorationColor: colors.white,
    fontFamily: fonts.regular,
    fontSize: 14,
    margin: 0,
  },
  div: {
    color: colors.white,
    fontFamily: fonts.regular,
    margin: 0,
  },
  p: {
    margin: 0,
    fontFamily: fonts.regular
  },
  h1: {
    margin: 0,
    fontWeight: "400",
  },
  h2: {
    margin: 0,
    color: colors.primary,
    fontWeight: "400",
  },
  h3: {
    margin: 0,
    fontWeight: "400",
  },
  h4: {
    margin: 0,
    fontWeight: "400",
  },
  h5: {
    margin: 0,
    fontWeight: "400",
  },
  h6: {
    margin: 0,
    fontWeight: "400",
  },
  img: {
    marginTop: 5,
  },
}
