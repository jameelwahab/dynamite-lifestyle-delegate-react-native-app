export const getProduct = item => {
  if (
    item?.transaction_type === 'mission' ||
    item?.transaction_type === 'mission_schedule'
  ) {
    return `Mission (${item?.mission_info?.title})`;
  }
  if (
    item?.transaction_type === 'quest' ||
    item?.transaction_type === 'mission_schedule'
  ) {
    return `Quest (${item?.mission_info?.title})`;
  } else if (
    item?.transaction_type === 'payment_request' &&
    item?.payment_request_info?.request_title
  ) {
    return `Payment Request (${item?.payment_request_info?.request_title})`;
  } else if (
    item?.transaction_type === 'payment_plan' &&
    item?.sale_page_info?.sale_page_title
  ) {
    return `Sale Page (${item?.sale_page_info?.sale_page_title})`;
  } else if (item?.transaction_type === 'dynamite_product_purchase') {
    return `Dynamite Shop`;
  } else {
    return 'N/A';
  }
};
