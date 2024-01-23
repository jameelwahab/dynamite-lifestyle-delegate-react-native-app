
import invokeApi from "../functions/invokeAPI";


export const QUESTIONS_LIST = ({ token, navigation, slug, body: {
  created_for, created_for_id, member_id
} }) => {
  return invokeApi({
    path: `api/questionnaire/list_question_reply_against/${slug}`,
    method: "POST",
    token,
    navigation,
  })
}