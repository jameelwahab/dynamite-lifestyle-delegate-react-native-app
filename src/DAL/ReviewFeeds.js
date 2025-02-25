import invokeApi from "../functions/invokeAPI";
export const GET_REVIEW_FEEDS =
  ({ token, navigation, page=0, limit=50, search_text="" }) => {
    return invokeApi({
      path: `api/feeds/list/review_feeds?page=${page}&limit=${limit}&search_text=${search_text}`,
      method: "GET",
      token,
      navigation,
    })
  }

export const DELETE_REVIEW_FEEDS =  ({ token, navigation, id}) => invokeApi({
    path:`api/feeds/${id}`,
    method:"DELETE",
    token,
    navigation,
})

export const APPROVE_REVIEW_FEEDS = ({token, navigation, id}) => invokeApi({
    path:`api/feeds/approve/${id}`,
    method:"GET",
    token,
    navigation,
})
