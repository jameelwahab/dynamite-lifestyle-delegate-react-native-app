import invokeApi from "../functions/invokeAPI"
export const GET_LIVE_CHAT_LIST = ({ token, navigation, module_id, user_id }) => {
  return invokeApi({
    path: `api/live_general_chat/list?page=0&limit=30`,
    method: "POST",
    token,
    navigation,
    postData:{
	user_id,
	module_id,
    }
  })
}

