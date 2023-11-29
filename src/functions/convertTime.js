import moment from "moment-timezone";



export const convertTimezone = (dateTime, timezone) => {
  console.log(dateTime, timezone, "dateTime, timezone")
  if (!(!!dateTime)) {
    return moment();
  }

  let admin_date_time = moment.tz(dateTime, timezone.admin)
  let user_date_time = admin_date_time.clone().tz(timezone.user);
  return user_date_time;

}