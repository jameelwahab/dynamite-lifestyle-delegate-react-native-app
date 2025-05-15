import invokeApi from "../functions/invokeAPI";

export const GET_ACTIVE_DELEGATES = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/active_consultant_list/department`,
    method: "GET",
    token,
    navigation,
  })
}


export const ASSIGN_DELEGATES_FOR_SELF_IMAGE_OR_GOAL_STATEMENT = ({ token, navigation,
  type, userId, delegateId,
}) => {
  return invokeApi({
    path: `api/consultant/self_image_and_goal_statement/user_update`,
    method: "POST",
    postData: {
      type:type,
      assign_to: delegateId,
      user_id: userId
    },
    token,
    navigation,
  })
}
