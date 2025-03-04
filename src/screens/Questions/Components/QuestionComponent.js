import { View, StyleSheet, Pressable, } from 'react-native'
import React, { useState } from 'react'
import MyText from '../../../components/MyText'
import { colors }from '../../../utilities/colors'
import MyWebview from '../../../components/MyWebview'
import MyCheckBox from '../../../components/MyCheckBox'
import Collapsible from 'react-native-collapsible'
import { icons } from '../../../utilities/icons'
import { MyButton } from '../../../components/MyButton'
import openUrl from '../../../functions/openUrl'
import { S3_URL } from '../../../utilities/constants'


const QuestionComponent = ({ item, index, showRepliesbtns = false, disableCollapse= false, onShowReplyPress, onRelpyBtnPress, hideRepliesCheckBox = false, hideCollapse = false, noQuestionStatement = false,padding=10 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const findCollapsed = (id) => {
    return !!isCollapsed.find(x => x == id)
  }

  const toggleCollapsed = (id) => {
    let index = isCollapsed.findIndex(x => x == id);
    if (index > -1) {
      setIsCollapsed((list) => list.filter(x => x != id))
    } else {
      setIsCollapsed((list) => [...list, id])
    }
  }
  //?   Qestion Type Views start

  const scalingQuestionView = (item, index) => {
    return (
      <Pressable onPress={() => { }} style={{ flexDirection: "row", flexWrap: "wrap" }} >
        {Array((item.scaling_max - item.scaling_min) + 1).fill((item.scaling_max - item.scaling_min) + 1).map((y, j) => {
          return (
            <View
              key={"scaling" + j}
              style={{
                height: 25, width: 25, borderRadius: 15, borderWidth: 1, borderColor: colors.beige, alignItems: "center", justifyContent: "center", margin: 3,
                backgroundColor: item?.answer?.answer_statement >= item.scaling_min + j ? colors.beige : colors.transparent
              }} >
              <MyText fontSize={12} type='medium' color={item?.answer?.answer_statement >= item.scaling_min + j ? colors.black : colors.beige} >{(item.scaling_min + j)}</MyText>
            </View>
          )
        })}
      </Pressable>
    )
  }

  const RadioButtonView = (item, index) => {
    return (
      <Pressable onPress={() => { }}>
        {item.options.map((item2, index2) => {
          let isCheck = item?.answer?.answer_statement == item2;
          return (
            <View key={"radio" + index2} style={{ paddingTop: 10, justifyContent: "center", backgroundColor: isCheck ? colors.lightPrimary3 : colors.transparent }}>
              <MyCheckBox
                value={isCheck}
                size={15}
                title={item2}
                circle
                textColor={colors.lightText} color={colors.lightText} />
            </View>
          )
        })}
      </Pressable>
    )
  }

  const checkBoxButtonView = (item, index) => {

    return (
      <Pressable onPress={() => { }}>
        {item.options.map((item2, index2) => {
          let isCheck = !!item.answer?.answer_statement && Array.isArray(item.answer?.answer_statement) && item.answer?.answer_statement.findIndex(x => x == item2) > -1;
          return (
            <View key={"checkbox" + index2} style={{ paddingTop: 10, justifyContent: "center", }}>
              <MyCheckBox
                value={isCheck}
                size={15} title={item2} textColor={colors.lightText2} />
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
          <View style={{ borderWidth: 1 / 2, borderRadius: 10, borderColor: colors.white, minHeight: 100, padding: 10 }}>
            <MyText color={colors.lightText} style={{opacity:0.8}} >{item?.answer?.answer_statement || item?.question_placeholder}</MyText>
          </View>
        </View>
      </View>
    )
  }


  const repliesBtns = (item) => {
    return (
      <View style={__styles.btnView}>
        <MyButton
          onPress={() => onRelpyBtnPress?.(item)}
          invert={true}
          title={`Replies (${Array.isArray(item?.answer?.comments) ? item?.answer?.comments?.length : 0})`}
          style={__styles.btn}
          noCapitalize
        />
        {!hideRepliesCheckBox &&
          <MyCheckBox
            title='Show Replies to Client'
            onPress={() => onShowReplyPress?.(item)}
            pb={0}
            value={!!item?.answer?.show_replies}
          />}
      </View>)
  }
		const addStyle=(txt)=> {
				for(let i=0; txt.length; i++){
						if(txt[i]=='<' && txt[i+2]==">"){
								const style=` "style="display: inline-block;" `;
								return `${txt.slice(0,i+2)}${style}${txt.slice(i+2)}`
						}
				}	
		}

		const addImport = (txt)=> {
				const str = `<span> *</span>`;
				for(let i=0; i < txt.length; i++){
						if(txt[i] === "<" && txt[i+1] === "/"){
								 return addStyle(`${txt.slice(0,i)}${str}${txt.slice(i)}`)
						}
				}
				return  txt
		}
  return (
    <View style={{ backgroundColor: colors.secondary, padding:padding, marginTop: 10, borderRadius: 10 }}>
      <Pressable
        disabled={hideCollapse}
        onPress={() => !disableCollapse && setIsCollapsed(!isCollapsed)}
        style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          {!noQuestionStatement &&
          <MyText type='medium' >{"Question Statement"}</MyText>}
          <View style={{ marginTop: 5 }}>
            {!!item?.question_statement &&
              <>
								<MyWebview
										fullWidth
										html={item?.is_required ? addImport(item?.question_statement): item?.question_statement}
										style={{
												h1: {
												margin: 0,
														color: colors.primary
												},
												h2: {
														margin: 0,
														color: colors.primary
												},
										  span:{
												color:colors.delete,
												fontSize:16,
												paddingTop:10,
												transform: [{ translateY:50 }]
											},
												
										}}
								/>
						 </>
						}
          </View>
        </View>
        {hideCollapse &&
          <View>
            {isCollapsed ? icons.downwardArrow() : icons.upwardArrow()}
          </View>}
      </Pressable>
      <View style={{ marginTop: 10 }}>
        <Collapsible collapsed={isCollapsed} >
          <View>
            {item?.question_type == "scaling" ? scalingQuestionView(item, index) :
              item?.question_type == "mcq" ? RadioButtonView(item, index) :
                item?.question_type == "checkbox" ? checkBoxButtonView(item, index) :
                  item?.question_type == "textarea" ? textAreaView(item, index)
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
          {showRepliesbtns && repliesBtns(item)}
        </Collapsible>
      </View>
    </View>
  )



}

export default QuestionComponent

const __styles = StyleSheet.create({
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
  btnView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  btn: {
    paddingHorizontal: 10,
    height: 35,
    marginRight: 20
  }
})

