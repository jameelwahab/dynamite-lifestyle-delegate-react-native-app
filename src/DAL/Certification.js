import invokeApi from "../functions/invokeAPI";

export const STUDY_ASSESSSMENT_QUESTIONS_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/delegates_question/consutant`,
    method: "GET",
    token,
    navigation,
  })
}