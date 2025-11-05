import React from 'react';
import MyText from '../../../components/MyText';

export const ReferralUserView = ({ row }) => {
  let affiliate_user = row?.affiliate_info?.affiliate_user_info;
  let affiliate_url_name = row?.affiliate_info?.affiliate_url_name;
  let refferal_name = "Master Link";
  let userType = "";

  if (affiliate_url_name && affiliate_user) {
    userType = affiliate_user?.affiliate_user_created_for == "memberuser"
      ? " | Public User"
      : " | Delegate User";
  }

  if (!!affiliate_user) {
    refferal_name = `${affiliate_user?.first_name || ""} ${affiliate_user?.last_name || ""}`.trim() || "N/A";
    if (!!affiliate_url_name) {
      refferal_name += ` (${affiliate_url_name})`;
    }
  }

  return (
    <MyText fontSize={12} type="medium" style={{ textTransform: 'capitalize' }}>
      {refferal_name + (!!userType ? userType : "")}
    </MyText>
  );
};
