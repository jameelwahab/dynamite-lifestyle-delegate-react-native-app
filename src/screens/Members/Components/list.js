const filterFromlist = [{
  key: "new-filter",
  title: "Apply New Filter",
},
{
  key: "saved-filter",
  title: "Apply Saved Filter",
}]



const levelList = [{
  key: "dynamite",
  title: "Dynamite",
},
{
  key: "pta",
  title: "PTA",
},
{
  key: "elite",
  title: "Elite",
},
{
  key: "mastery",
  title: "Mastery",
}]

const memberStatusList = [{
  key: "none",
  title: "None",
}, {
  key: "active",
  title: "Active",
}, {
  key: "inactive",
  title: "Inactive",
}]


const onlineStatusList = [{
  key: "all",
  title: "All",
}, {
  key: "online",
  title: "Online",
}, {
  key: "offline",
  title: "Offline",
}]

const membershipStatusList = [{
  key: "none",
  title: "None",
}, {
  key: "expired",
  title: "Expired",
}, {
  key: "not_expired",
  title: "Active",
}]


const expireDaysList = [{
  key: "3",
  title: "3 Days",
},
{
  key: "7",
  title: "7 Days",
},
{
  key: "15",
  title: "15 Days",
},
{
  key: "30",
  title: "30 Days",
},
{
  key: "custom",
  title: "Custom",
}]

const sortList = [
  {
    key: "registration_date_asc",
    title: "Registration Date (Oldest First)"
  },
  {
    key: "registration_date_desc",
    title: "Registration Date (Newest First)"
  },
  {
    key: "membership_expiry_date_asc",
    title: "Membership Expiry Date (Oldest First)"
  },
  {
    key: "membership_expiry_date_desc",
    title: "Membership Expiry Date (Newest First)"
  },
  {
    key: "last_login_date_asc",
    title: "Last Login Date (Oldest First)"
  },
  {
    key: "last_login_date_desc",
    title: "Last Login Date (Newest First)"
  },

]

export {sortList, filterFromlist, levelList, memberStatusList, onlineStatusList, membershipStatusList, expireDaysList }