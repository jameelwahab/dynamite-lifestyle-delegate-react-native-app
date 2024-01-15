import moment from "moment";
import invokeApi from "../functions/invokeAPI";

export const LIST_OF_MEMBERS = ({ token, navigation, page, searchText, body: {
  coins, coins_from = 0, coins_range = false, coins_to = 0, community = [], date = null,
  event_page = [], expiry_in = 3, filter_From = "", filter_name = null, from_date = null,
  is_date_range = false, lead_status = [], member_ship_expiry = "", membership_expiry = null,
  membership_purchase_expiry_from = moment(), membership_purchase_expiry_to = moment(),
  nurture = null, plan = null, sort_by = null, status = "", to_date = null,
  user_status_type = ""
} }) => {
  return invokeApi({
    path: `api/member/member_list_for_delegate?page=${page}&limit=10&search_text=${searchText}`,
    method: "POST",
    postData: {
      coins, coins_from, coins_range, coins_to, community, date, event_page, expiry_in, filter_From,
      filter_name, from_date, is_date_range, lead_status, member_ship_expiry, membership_expiry, membership_expiry,
      membership_purchase_expiry_from, membership_purchase_expiry_to, nurture, plan, sort_by, status, to_date, user_status_type
    },
    token,
    navigation,
  })
}