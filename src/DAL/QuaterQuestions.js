import invokeApi from "../functions/invokeAPI";

export const GET_QUATER_QUESTION_LIST = ({ token, navigation, page, }) => {
  return invokeApi({
    path: `api/quarter/list?page=${page}&limit=20&search_text=`,
    method: "GET", 
    token,
    navigation,
  })
}
