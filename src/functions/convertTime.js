import moment from "moment-timezone";
import momentSimple from "moment";


export const convertTimezone = (dateTime, timezone) => {
  if (!(!!dateTime) || !(!!timezone)) {
    return moment();
  }

  let admin_date_time = moment.tz(dateTime, timezone.admin)
  let user_date_time = admin_date_time.clone().tz(timezone.user);
  return user_date_time;

}

export const convertTimezoneFrom = (dateTime, user, admin) => {
  if (!(!!dateTime)|| !(!!timezone)) {
    return moment();
  }

  let admin_date_time = moment.tz(momentSimple.utc(dateTime).format("YYYY-MM-DD HH:mm"), admin)
  let user_date_time = admin_date_time.clone().tz(user);
  return user_date_time;

}

export const convertTimezone2 = (date,state) => {
  if (!(!!date) || !(!!state)) {
    return moment();
  }
  let formated_date = moment(date, "YYYY-MM-DD HH:mm:ss").format(
    "YYYY-MM-DD HH:mm"
  );
  let momentObj = moment.tz(
    formated_date,
    "YYYY-MM-DD HH:mm:ss",
    state.admin
  );

  let final_date = moment(momentObj).tz(state.user);
  return final_date;
};

export const convertTimezoneToRegion = (
  date,
  state
) => {
  // let formated_date = moment(date, "YYYY-MM-DD HH:mm:ss").format(
  //   "YYYY-MM-DD HH:mm:ss"
  // );
  let momentObj = moment.utc(
    date,
    "YYYY-MM-DD HH:mm:ss",
  );

  let final_date = moment(momentObj).clone().tz(state.user);
  return final_date;
};
