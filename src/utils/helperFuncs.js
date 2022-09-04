import { notification } from 'antd';
import { REGEX } from 'config/constants';
import queryString from 'query-string';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'config/constants';
import intersection from 'lodash/intersection';

//Open notify toast
export const notify = {
  error: ({ message, ...options }) =>
    notification.error({
      message,
      ...options,
    }),

  info: ({ message, ...options }) =>
    notification.info({
      message,
      ...options,
    }),

  success: ({ message, ...options }) =>
    notification.success({
      message,
      ...options,
    }),

  warning: ({ message, ...options }) =>
    notification.warning({
      message,
      ...options,
    }),
};

//Generate password
export const passwordGenerator = (len) => {
  var length = len ? len : 8;
  var string = 'abcdefghijklmnopqrstuvwxyz';
  var numeric = '0123456789';
  var punctuation = '#?!@$%^&*-'; // "!@#$%^&*()_+~`|}{[]:;?><,./-="
  var password = '';
  var character = '';
  while (password.length < length) {
    let entity1 = Math.ceil(string.length * Math.random() * Math.random());
    let entity2 = Math.ceil(numeric.length * Math.random() * Math.random());
    let entity3 = Math.ceil(punctuation.length * Math.random() * Math.random());
    let hold = string.charAt(entity1);
    hold = password.length % 2 === 0 ? hold.toUpperCase() : hold;
    character += hold;
    character += numeric.charAt(entity2);
    character += punctuation.charAt(entity3);
    password = character;
  }
  password = password
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');
  return password.substr(0, len);
};

//Validator input data
export const validator = ({ regex, message, type }) => {
  let reg = '';
  let mess = '';
  switch (type) {
    case 'email': {
      reg = REGEX.EMAIL;
      mess = 'Email không đúng định dạng !';
      break;
    }
    case 'phone': {
      reg = REGEX.PHONE;
      mess = 'Số điện thoại không đúng định dạng !';
      break;
    }
    case 'number': {
      reg = REGEX.NUMBER;
      mess = 'Vui lòng nhập số !';
      break;
    }
    case 'password': {
      reg = REGEX.PASSWORD;
      mess = 'Mật khẩu phải tối thiếu 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt !';
      break;
    }
  }
  return () => ({
    validator(_, value) {
      if (!value || (reg || regex).test(value)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(mess || message));
    },
  });
};

//Build query string by params
export const buildQueryString = ({ params }) => {
  let rootUrl = window.location.origin + window.location.pathname;
  let queryRoot = `${rootUrl}?`;

  const query = queryString.stringify(params, { arrayFormat: 'bracket', parseBooleans: true });
  window.history.pushState(null, null, queryRoot + query);
};

//Get query string by params
export const getQuery = () => {
  return queryString.parse(window.location.search, { arrayFormat: 'bracket', parseBooleans: true });
};

//Debounce function
export const debounce = (func, delay = 400) => {
  let timmerId = '';
  return (...args) => {
    if (timmerId) {
      clearTimeout(timmerId);
    }
    timmerId = setTimeout(() => func(args), delay);
  };
};

//Formart date by time
export const formatDatetime = (date) => {
  return moment(date).format(DATE_TIME_FORMAT);
};

//Read file function
export const readFile = ({ getResult, type, file }) => {
  const reader = new FileReader();
  reader.onload = function () {
    getResult(reader.result);
  };
  if (type === 'Base64String') {
    reader.readAsDataURL(file);
  }
};

//Custom request upload fuction
export const dummyRequest = (file, onSuccess) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

//Get the timestamp by date
export const getTimeStamp = (value) => {
  let timeStamp = {
    from: '',
    to: '',
  };

  var thisYear = moment().year();
  const firstDayOfMonth = moment().startOf('month').utcOffset(840).format(DATE_TIME_FORMAT);
  const firstDayOfYear = moment().startOf('year').utcOffset(840).format(DATE_TIME_FORMAT);
  const lastDayOfYear = moment().endOf('year').utcOffset(840).format(DATE_TIME_FORMAT);

  const firstDayOfQuarter = moment({
    year: thisYear,
    month: getTheFirstMonthOfQuarter() - 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
  })
    .utcOffset(840)
    .format(DATE_TIME_FORMAT);

  const now = moment().utcOffset(840).format(DATE_TIME_FORMAT);
  const midDateOfYear = moment({
    year: thisYear,
    month: 5,
    day: 30,
    hour: 23,
    minute: 59,
    second: 59,
  })
    .utcOffset(840)
    .format(DATE_TIME_FORMAT);

  function getTheFirstMonthOfQuarter() {
    let thisMonth = moment().month() + 1;
    if (thisMonth % 3 === 0) {
      return thisMonth - 2;
    } else {
      return thisMonth - ((thisMonth % 3) - 1);
    }
  }

  function getTimeStampByDate(date) {
    return moment(date, DATE_TIME_FORMAT).toISOString();
  }

  switch (value) {
    case 'this_month': {
      timeStamp = {
        from: getTimeStampByDate(firstDayOfMonth),
        to: getTimeStampByDate(now),
      };
      break;
    }
    case 'this_quarter': {
      timeStamp = {
        from: getTimeStampByDate(firstDayOfQuarter),
        to: getTimeStampByDate(now),
      };
      break;
    }
    case 'this_year': {
      timeStamp = {
        from: getTimeStampByDate(firstDayOfYear),
        to: getTimeStampByDate(now),
      };
      break;
    }

    case 'first_six_months': {
      timeStamp = {
        from: getTimeStampByDate(firstDayOfYear),
        to: getTimeStampByDate(midDateOfYear),
      };
      break;
    }

    case 'six_months_late': {
      timeStamp = {
        from: getTimeStampByDate(midDateOfYear),
        to: getTimeStampByDate(lastDayOfYear),
      };
      break;
    }
  }

  return timeStamp;
};

//Format vni currency
export const formatCurrency = (number, defaultValue = '- -') => {
  return number !== undefined
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
    : defaultValue;
};

//check permissions of each action
export const hasPermission = (allPermissions, checkedPermissions) => {
  return intersection(allPermissions, checkedPermissions).length > 0;
};

//Parse date to moment
export const parseIsoDateStringToMoment = (time) => {
  return time ? moment.utc(time).local() : moment(new Date());
};

//Format display in stock
export const formatInStock = (number) => {
  if (number) {
    return number > 0 ? <div>{number}</div> : <div style={{ color: '#D2434D' }}>{number}</div>;
  } else return '- -';
};
