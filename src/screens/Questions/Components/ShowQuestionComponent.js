import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyLoader from '../../../components/MyLoader'
import { QUESTIONS_LIST } from '../../../DAL'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import EmptyView from '../../../components/EmptyView'
import { colors } from '../../../utilities/colors'
import MyWebview from '../../../components/MyWebview'
import { fonts } from '../../../utilities/fonts'
import MyInputs from '../../../components/MyInputs'
import MyCheckBox from '../../../components/MyCheckBox'
import Collapsible from 'react-native-collapsible'
import { icons } from '../../../utilities/icons'
import { MyButton } from '../../../components/MyButton'
import openUrl from '../../../functions/openUrl'


const ShowQuestionComponent = ({ item, index, onAddEditQuestion ,onDeleteQuestion}) => {
  const [isCollapsed, setIsCollapsed] = useState(index != 0);
		const { S3_URL } = useSelector(selectUser)

  const findCollapsed = (id) => {
    return !!isCollapsed.find(x => x == id)
  }




  const scalingQuestionView = (item, index) => {
    return (
      <View>
        <MyText color={colors.white} fontSize={16} type='bold' >Scale Limit</MyText>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <MyInputs
              label='Min'
              value={String(item?.scaling_min)}
              editable={false}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyInputs
              label='Max'
              value={String(item?.scaling_max)}
              editable={false}
            />
          </View>
        </View>
      </View>
    )
  }

  const RadioButtonView = (item, index) => {
    return (
      <Pressable onPress={() => { }}>
        {item.options.map((item2, index2) => {
          let isCheck = item?.answer?.answer_statement == item2;
          return (
            <View style={{ backgroundColor: isCheck ? colors.lightPrimary3 : colors.transparent, flexDirection: "row", alignItems: "center" }}>
              <View style={{ marginRight: 15, marginTop: 15 }}>
                <MyCheckBox
                  value={true}
                  // size={15}
                  circle
                  textColor={colors.lightText}
                  color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <MyInputs
                  label='Enter an answer choice'
                  value={item2}
                  editable={false}
                />
              </View>
            </View>
          )
        })}
      </Pressable>
    )
  }



  const textAreaView = (item, index) => {
    return (
      <View >
        <View style={{}}>
          {/* <MyInputs
            placeholder={item?.question_placeholder}
            multiline
            value={item?.answer?.answer_statement}
            editable={false}
            noSpace
          /> */}
          <View style={__styles.questionStatementView}>
            <MyText color={colors.white} >{item?.answer?.answer_statement}</MyText>
          </View>
        </View>
      </View>
    )
  }

  const QuestionsStatment = () => {
    return (
      <View>
        <MyText type='medium' >{"Question Statement"}</MyText>
        <View style={{ marginTop: 5 }}>
          {!!item?.question_statement &&
            <MyWebview
              fullWidth
              html={item?.question_statement}
              style={{
                h1: {
                  margin: 0,
                  color: colors.primary
                },
                h2: {
                  margin: 0,
                  color: colors.primary
                },
              }}
            />}
        </View>




      </View>
    )
  }


  const QuestionInputView = (item) => {
    return (
      <View style={{ marginTop: 10 }}>
        <MyInputs
          label='Question Placeholder'
          value={item?.question_placeholder}
          editable={false}
        />

        <MyInputs
          label='Question Type'
          value={typeLable[item?.question_type]}
          editable={false}
        />

        <View style={__styles.radioRootView}>
          <MyText isLabel>Status</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Active'
                color={colors.lightText}
                value={item?.status}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Inactive'
                color={colors.lightText}
                value={!item?.status}

              />
            </View>
          </View>
        </View>

        <View style={__styles.radioRootView}>
          <MyText isLabel>Is Documnet Allowed *</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Yes'
                color={colors.lightText}
                value={item?.is_document_allowed}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='No'
                color={colors.lightText}
                value={!item?.is_document_allowed}
              />
            </View>
          </View>
        </View>



      </View>
    )
  }
  return (
    <View style={__styles.rootView}>
      <Pressable
        onPress={() => setIsCollapsed(!isCollapsed)}
        style={{ flexDirection: "row", }}>
        <View style={{ flex: 1 }}>
          {QuestionsStatment()}
        </View>
        <View style={__styles.collapseIconView}>
          {isCollapsed ? icons.downwardArrow() : icons.upwardArrow()}
        </View>
      </Pressable>

      {QuestionInputView(item)}

      <View style={{ marginTop: 10 }}>
        <Collapsible collapsed={isCollapsed} >
          <View>
            {item?.question_type == "scaling" ? scalingQuestionView(item, index) :
              item?.question_type == "mcq" || item?.question_type == "checkbox" ? RadioButtonView(item, index)
                : null}
          </View>
          {item?.answer?.document_url && (
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <MyButton
                onPress={() => openUrl(S3_URL + item?.answer?.document_url)}
                style={__styles.documentBtn}
                textStyle={__styles.documentBtnText}
                invert title='View Document' />
            </View>
          )}

          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>

            <MyButton title='Edit' invert style={__styles.btn} onPress={() => onAddEditQuestion(item)} />

            <MyButton title='DELETE' invert style={__styles.btn} onPress={() => onDeleteQuestion(item)} />

          </View>
        </Collapsible>
      </View>
    </View>
  )



}

export default ShowQuestionComponent

const typeLable = {
  "mcq": "Single Selection",
  "scaling": "Scaling",
  "checkbox": "Multiple Selection",
  "textarea": "Text Area",
}

const __styles = StyleSheet.create({
  rootView: { backgroundColor: colors.secondary, padding: 10, marginTop: 10, borderRadius: 10 },
  questionStatementView: { borderWidth: 1 / 2, borderRadius: 10, borderColor: colors.white, minHeight: 100, padding: 10 },
  documentBtn: {
    height: 30,
    paddingHorizontal: 10
  },
  documentBtnText: {
    fontSize: 12,
    textTransform: "capitalize",
    textDecorationLine: "underline",
    textDecorationColor: colors.primary
  },
  radioRootView: {

    marginBottom: 15
  },
  radioView: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    // padding: 2
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  radioItem: {
    flex: 1,

  },
  btn: {
    marginLeft: 10,
    paddingHorizontal: 10,
    height: 40
  },
  collapseIconView: { width: 40, height: 40, alignItems: "center", justifyContent: "center" }
})


