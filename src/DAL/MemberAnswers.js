import invokeApi from "../functions/invokeAPI"

export const GET_MEMBERS_ANSWERS_LIST = ({ token, navigation, page, created_for, search_text }) => {
  return invokeApi({
    path: `api/questionnaire/list_question_reply/member_for_delegate?page=${page}&limit=20`,
    method: "POST",
    postData: { created_for, search_text },
    token: token,
    navigation: navigation,
  })
}
