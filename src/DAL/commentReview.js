import invokeApi from "../functions/invokeAPI";
export const GET_COMMENT_REVIEW =
  ({ token, navigation, page=0, limit=50, search_text="" }) => {
    return invokeApi({
      path: `api/comment/list/review_comments?page=${page}&limit=${limit}&search_text=${search_text}`,
      method: "GET",
      token,
      navigation,
    })
  }

export const DELETE_COMMNET_REVIEW =  ({ token, navigation, id}) => invokeApi({
    path:`api/comment/${id}`,
    method:"DELETE",
    token,
    navigation,
})

export const APPROVE_COMMENT_REVIEW = ({token, navigation, id}) => invokeApi({
    path:`api/feeds/approve/${id}?type=comment`,
    method:"GET",
    token,
    navigation,
})
