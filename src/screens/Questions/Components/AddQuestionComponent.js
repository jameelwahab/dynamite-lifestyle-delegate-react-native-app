import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyLoader from '../../../components/MyLoader'
import { QUESTIONS_LIST } from '../../../DAL'
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
import Editor from '../../../components/Editor'
import MyTouchableInput from '../../../components/MyTouchableInput'
import OptionModal from '../../../components/OptionModal'


const AddQuestionComponent = ({ data, setData, onSubmit,btnText }) => {
  const [isVisible, setVisiblity] = useState(false)

  const changeText = (text, index) => {
    data.answerList[index] = text;
    setData({ answerList: [...data.answerList] });
  }

  const addNewInput = () => {
    setData({ answerList: [...data.answerList, ""] });
  }


  const removeInput = (index) => {
    data.answerList.splice(index, 1);
    setData({ answerList: [...data.answerList] });
  }



  const scalingQuestionView = () => {
    return (
      <View>
        <MyText color={colors.white} fontSize={16} type='bold' >Scale Limit</MyText>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            <MyInputs
              label='Min *'
              value={data.min}
              onChangeText={(text) => setData({ min: text })}
              keyboardType='number-pad'
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyInputs
              label='Max *'
              value={data.max}
              onChangeText={(text) => setData({ max: text })}
              keyboardType='number-pad'
            />
          </View>
        </View>
      </View>
    )
  }

  const RadioButtonView = () => {
    return (
      <View>
        {data.answerList.map((item, index) => {
          return (
            <View>
              <View style={{ backgroundColor: colors.transparent, flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: 15, marginTop: 15 }}>
                  <MyCheckBox
                    value={true}
                    circle
                    textColor={colors.lightText}
                    color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <MyInputs
                    label='Enter an answer choice *'
                    value={item}
                    onChangeText={(text) => changeText(text, index)}
                  />
                </View>

              </View>
              <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: -5 }}>
                {data?.answerList?.length > 1 &&
                  <TouchableOpacity
                    hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    onPress={() => removeInput(index)}>
                    {icons.minusCircle()}
                  </TouchableOpacity>}

                <TouchableOpacity
                  hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                  style={{ marginLeft: 10 }}
                  onPress={addNewInput}>
                  {icons.plusCircle()}
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
      </View>
    )
  }





  const QuestionsStatment = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <Editor
          label='Question Statement *'
          height={150}
          onChange={(val) => setData({ statement: val })}
          initialValue={data?.statement}
        />
      </View>
    )
  }


  const QuestionInputView = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <MyInputs
          label='Question Placeholder'
          value={data?.placeholder}
          onChangeText={(val) => setData({ placeholder: val })}
        />

        <MyTouchableInput
          label='Question Type'
          onPress={() => setVisiblity(true)}
          value={!!data?.type ? typeLable[data?.type] : ""}
        />

        <View style={__styles.radioRootView}>
          <MyText isLabel>Status</MyText>
          <View style={__styles.radioView}>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Active'
                value={data?.status}
                onPress={() => setData({ status: true })}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='Inactive'
                value={!data?.status}
                onPress={() => setData({ status: false })}
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
                value={data?.documentAllowed}
                onPress={() => setData({ documentAllowed: true })}
              />
            </View>
            <View style={__styles.radioItem}>
              <MyCheckBox
                title='No'
                value={!data?.documentAllowed}
                onPress={() => setData({ documentAllowed: false })}
              />
            </View>
          </View>
        </View>



      </View>
    )
  }
  return (
    <View style={__styles.rootView}>

      {QuestionsStatment()}


      {QuestionInputView()}


      <View style={{ marginTop: 10 }}>
        <View>
          {data?.type == "scaling" ? scalingQuestionView() :
            data?.type == "mcq" || data?.type == "checkbox" ? RadioButtonView()
              : null}
        </View>


        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 20 }}>
          <MyButton
            title={btnText}
            invert
            style={__styles.btn}
            onPress={onSubmit} />
        </View>
      </View>


      <OptionModal
        isVisible={isVisible}
        closeModal={() => setVisiblity(false)}
        onSelected={(item) => { setData({ type: item.key }); setVisiblity(false) }}
        optionList={list}
        noIcon
      />
    </View>
  )



}

export default AddQuestionComponent

const typeLable = {
  "mcq": "Single Selection",
  "scaling": "Scaling",
  "checkbox": "Multiple Selection",
  "textarea": "Text Area",
}

const list = [
  {
    title: "Single Selection",
    key: "mcq"
  },
  {
    title: "Multiple Selection",
    key: "checkbox"
  },
  {
    title: "Scaling",
    key: "scaling"
  },
  {
    title: "Text Area",
    key: "textarea"
  },
]

const __styles = StyleSheet.create({
  rootView: { marginTop: 10, borderRadius: 10 },
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
    // height: 40
  },
  collapseIconView: { width: 40, height: 40, alignItems: "center", justifyContent: "center" }
})


