
import invokeApi from "../functions/invokeAPI";


export const QUESTIONS_LIST = ({ token, navigation,  body: {
  created_for, created_for_id, member_id
} }) => {
  return invokeApi({
    path: `api/questionnaire/list_question_reply_against/lesson`,
    method: "POST",
    postData:{ created_for, created_for_id, member_id},
    token,
    navigation,
  })
}