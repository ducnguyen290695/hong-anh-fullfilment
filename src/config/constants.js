/* eslint-disable no-useless-escape */

import { PERMISSION_ARRAY } from './permissions';

export const REGEX = {
  NUMBER: new RegExp('^[0-9]+$'),
  PHONE: /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/,
  CURRENCY: /\B(?=(\d{3})+(?!\d))/g,
  CURRENCY_PARSER: /\$\s?|(\.*)/g,
  EMAIL:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  //At least one upper case, one lower case English letter, one digit, one special character and minimum eight in length
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
};

export const INPUT_TYPE = {
  TEXT_AREA: 'TEXT_AREA',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  INPUT: 'INPUT',
  MASKED_INPUT: 'MASKED_INPUT',
  DATE_PICKER: 'DATE_PICKER',
  PASSWORD: 'PASSWORD',
  IMAGE_UPLOAD: 'IMAGE_UPLOAD',
  RANGE_PICKER: 'RANGE_PICKER',
  BUTTON_GROUP: 'BUTTON_GROUP',
  PHONE_NUMBER_INPUT: 'PHONE_NUMBER_INPUT',
  CHECK_BOX: 'CHECK_BOX',
  RADIO_GROUP: 'RADIO_GROUP',
  TIME_PICKER: 'TIME_PICKER',
  SWITCH: 'SWITCH',
};

export const TOKEN = 'token';

export const FORM_LAYOUT = {
  layout: 'horizontal',
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

export const FORM_TYPE = {
  CREATE: 'CREATE',
  DETAIL: 'DETAIL',
};

export const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';

export const DATE_FORMAT = 'DD/MM/YYYY';

export const DATE_ISO_8601_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]';

export const TIME_FORMAT = 'HH:mm:ss';

export const ACCEPT_IMG_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];

export const ACCEPT_FILE_TYPES = ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'];

export const PRODUCT_INPUT_TYPE = {
  SHORT_CODE: 'shortCode',
  CURRENCY: 'currency',
  NUMBER: 'number',
  VAT: 'vat',
};

export const USER_PERMISSIONS = PERMISSION_ARRAY.reduce(
  (previousValue, currentValue) => ({ ...previousValue, [currentValue]: currentValue }),
  {}
);

export const SHIPPING_TYPE = {
  BUS: 'BUS',
  URBAN_COD: 'URBAN_COD',
  DELIVER_3PARTY: 'DELIVER_3PARTY',
  PICK_UP_COUNTER: 'PICK_UP_COUNTER',
  URBAN_NOT_COD: 'URBAN_NOT_COD',
};

export const PRIORITY_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const PAYMENT_METHOD = {
  Cash: 'CASH',
  CashAndDebt: 'CASH_AND_DEBT',
  COD: 'COD',
  Debt: 'DEBT',
};

export const STATUS_ORDER = {
  ALL: 'ALL',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  WAITING_FOR_ENOUGH_STOCK: 'WAITING_FOR_ENOUGH_STOCK',
  WAITING_FOR_PAYMENT: 'WAITING_FOR_PAYMENT',
  WAITING_FOR_EXPORTING: 'WAITING_FOR_EXPORTING',
  WAITING_FOR_SHIPPING: 'WAITING_FOR_SHIPPING',
  DELIVERING: 'DELIVERING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
};

export const FULL_STOCK_REQUIRED = {
  YES: true,
  NO: false,
};

export const STOCK_STATUS = {
  FULL: 'FULL',
  LACK: 'LACK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
};

export const EXPORT_VAT = {
  YES: true,
  NO: false,
};

export const EXPORT_CART_TYPE = {
  JPEG: 'JPEG',
  PDF: 'PDF',
};

export const EXPORT_FILE_ACTION = {
  CART: 'CART',
  ORDER: 'ORDER',
};
