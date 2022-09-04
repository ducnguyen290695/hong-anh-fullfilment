import { DATE_TIME_FORMAT } from 'config/constants';
import moment from 'moment';

export function parseMomentDate(dateStr) {
  if (dateStr) return moment(dateStr);
  return null;
}

export const getTimestampByDate = (date) => {
  return moment(date, DATE_TIME_FORMAT).toISOString();
};

export const decimalTimeToTimeString = (decimalTimeString) => {
  let decimalTime = parseFloat(Math.abs(decimalTimeString));
  let day = Math.floor(decimalTime / 24);
  decimalTime = decimalTime * 60 * 60;
  let hours = Math.floor(decimalTime / (60 * 60));
  decimalTime = decimalTime - hours * 60 * 60;
  let minutes = Math.floor(decimalTime / 60);
  decimalTime = decimalTime - minutes * 60;
  let seconds = Math.round(decimalTime);
  if (day >= 1) {
    return `${day} d`;
  } else {
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return `${hours}:${minutes}:${seconds}`;
  }
};

export const formatDateTime = (date, format = DATE_TIME_FORMAT) => {
  return moment(date).format(format);
};
