import invokeApi from "../functions/invokeAPI";

export const SELF_IMAGE_SAVE_AND_CLOSE = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/questionnaire/self_image/responded/${memberId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const SELF_IMAGE_INCOMPLETE = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/questionnaire/self_image/incomplete/${memberId}`,
    method: "GET",
    token,
    navigation,
  })
}

