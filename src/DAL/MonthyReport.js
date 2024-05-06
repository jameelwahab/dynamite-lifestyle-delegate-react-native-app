import invokeApi from "../functions/invokeAPI";

export const GET_MONTHLY_REPORT = ({ token, navigation, monthYear }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/delegate_performance/stats`,
    method: "POST",
    postData: { month_with_year: monthYear },
    token,
    navigation,
  })
}
