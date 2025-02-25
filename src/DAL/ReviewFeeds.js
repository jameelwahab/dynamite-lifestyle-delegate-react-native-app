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
