export const ORDER_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const ORDER_STATUS = {
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  WAITING_FOR_ENOUGH_STOCK: 'WAITING_FOR_ENOUGH_STOCK',
  WAITING_FOR_PAYMENT: 'WAITING_FOR_PAYMENT',
  WAITING_FOR_EXPORTING: 'WAITING_FOR_EXPORTING',
  WAITING_FOR_SHIPPING: 'WAITING_FOR_SHIPPING',
  DELIVERING: 'DELIVERING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
};

export const CANCEL_ORDER_REASON = {
  LACK_OF_STOCK: 'LACK_OF_STOCK',
  OUT_OF_DEBT: 'OUT_OF_DEBT',
  OTHER: 'OTHER',
};

export const WARNING_MODAL_ACTION = {
  APPROVAL_STOCK_LIST: 'APPROVAL_STOCK_LIST',
  APPROVAL_STOCK_DETAIL: 'APPROVAL_STOCK_DETAIL',
  WAITING_STOCK_LIST: 'WAITING_STOCK_LIST',
  WAITING_STOCK_DETAIL: 'WAITING_STOCK_DETAIL',
  DENY_STOCK_LIST: 'DENY_STOCK_LIST',
  DENY_STOCK_DETAIL: 'DENY_STOCK_DETAIL',
  CONFIRM_STOCK_LIST: 'CONFIRM_STOCK_LIST',
  CONFIRM_STOCK_DETAIL: 'CONFIRM_STOCK_DETAIL',
};