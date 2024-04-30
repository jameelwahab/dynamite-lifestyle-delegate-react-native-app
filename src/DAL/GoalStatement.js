import invokeApi from "../functions/invokeAPI";

export const GOAL_STATEMENT_LIST = ({ token, navigation, type, }) => {
  return invokeApi({
    path: type == "responded" ?
      `api/goal_statement_question/user_list_goal_statement_save_and_close_for_consultant` :
      `api/goal_statement_question/user_list_goal_statement_for_consultant?type=${type}`,
    method: "GET",
    token,
    navigation,
  })
}




export const GOAL_STATEMENT_MARK_INCOMPLETE = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/goal_statement_question/goal_statement_incomplete`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    postData: formdata,
    token,
    navigation,
  })
}

export const GOAL_STATEMENT_SAVE_AND_CLOSE = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/goal_statement_question/goal_statement_save_and_close`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    postData: formdata,
    token,
    navigation,
  })
}


export const GOAL_STATEMENT_DETAIL = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/member/get_goal_statement_by_member_id/${memberId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GOAL_STATEMENT_ANSWERS_HISTORY = ({ token, navigation, body: { question_id, member_id } }) => {
  return invokeApi({
    path: `api/member/get_answer_stat`,
    method: "POST",
    postData: { question_id, member_id },
    token,
    navigation,
  })
}


export const GOAL_STATEMENT_ADD_REPLY = ({ token, navigation, body: { questionId, memberId, comment } }) => {
  return invokeApi({
    path: `api/goal_statement_question/add_comment_on_goal_statement_question`,
    method: "POST",
    postData: { question_id: questionId, member_id: memberId, comment },
    token,
    navigation,
  })
}

export const GOAL_STATEMENT_DELETE_REPLY = ({ token, navigation, replyId }) => {
  return invokeApi({
    path: `api/goal_statement_question/comment/${replyId}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const GOAL_STATEMENT_DELETE_DYNAMITE_REPLY = ({ token, navigation, replyId }) => {
  return invokeApi({
    path: `api/goal_statement_reply/delete_reply/${replyId}`,
    method: "DELETE",
    token,
    navigation,
  })
}