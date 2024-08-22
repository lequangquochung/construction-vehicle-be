import _ from 'lodash';
import moment from 'moment';


interface PagingParams {
  pageIndex: number;
  pageSize: number;
  start: number;
  [key: string]: any;
}

export function returnPaging(data: any, totalItems: number, params: any, metadata = {}) {
  return {
    data,
    totalItems,
    paging: true,
    pageIndex: params.pageIndex,
    totalPages: Math.ceil(totalItems / params.pageSize),
    metadata,
  };
}

export function assignPaging(params) {
  params.pageIndex = Number(params.pageIndex) || 1;
  params.pageSize = Number(params.pageSize) || 999;
  params.skip = (params.pageIndex - 1) * params.pageSize;
  return params;
}

/**
 * @param length(option) length of result.
 */
export function randomOTP(length: number = 5): string {
  const digits = '0123456789';
  const digitsLength = digits.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * digitsLength);
    result += digits[index];
  }
  return result;
}

export function checkIsBeforeOneDay(startTime: Date | string) {
  const now = moment(new Date(), 'YYYY-MM-DD hh:mm:ss');
  const bookingStartDate = moment(startTime, 'YYYY-MM-DD hh:mm:ss');
  const minutesDiff = bookingStartDate.subtract(0, 'days').startOf('day').diff(now, 'minutes');
  return minutesDiff < 0;
}

export function checkIsBeforeTwoDay(startTime: Date | string) {
  const now = moment(new Date(), 'YYYY-MM-DD hh:mm:ss');
  const bookingStartDate = moment(startTime, 'YYYY-MM-DD hh:mm:ss');
  const minutesDiff = bookingStartDate.subtract(1, 'days').startOf('day').diff(now, 'minutes');
  return minutesDiff < 0;
}

export function nearestFutureMinutes(interval, someMoment) {
  const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
  return someMoment.clone().minute(roundedMinutes).startOf('seconds');
}

export function convertDataConfig(type, value) {
  switch (type) {
    case 'INT':
      return Number(value);

    case 'JSON':
    case 'BOOLEAN':
      return JSON.parse(value);

    default:
      return value;
  }
}