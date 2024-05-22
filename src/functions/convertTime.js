import moment from "moment-timezone";
import momentSimple from "moment";


export const convertTimezone = (dateTime, timezone) => {
  if (!(!!dateTime)) {
    return moment();
  }

  let admin_date_time = moment.tz(dateTime, timezone.admin)
  let user_date_time = admin_date_time.clone().tz(timezone.user);
  return user_date_time;

}

export const convertTimezoneFrom = (dateTime, user, admin) => {
  if (!(!!dateTime)) {
    return moment();
  }

  let admin_date_time = moment.tz(momentSimple(dateTime).format("YYYY-MM-DD HH:mm"), admin)
  let user_date_time = admin_date_time.clone().tz(user);
  return user_date_time;

}