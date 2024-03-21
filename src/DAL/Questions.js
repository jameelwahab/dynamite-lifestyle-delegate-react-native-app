
import invokeApi from "../functions/invokeAPI";


export const QUESTIONS_LIST = ({ token, navigation, body: {
  created_for, created_for_id, member_id
} }) => {
  return invokeApi({
    path: `api/questionnaire/list_question_reply_against/lesson`,
    method: "POST",
    postData: { created_for, created_for_id, member_id },
    token,
    navigation,
  })
}



export const QUESTIONS_LIST_BY_MODULE = ({ token, navigation, module, id }) => {
  return invokeApi({
    path: `api/questionnaire/list/by_module?created_for=${module}&created_for_id=${id}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_QUESTIONS = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/questionnaire`,
    method: "POST",
    postData: formdata,
    headers: { "Content-Type": "multipart/form-data", },
    token,
    navigation,
  })
}