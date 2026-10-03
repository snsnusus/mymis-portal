import moment from 'moment';
import range from 'lodash/range';

export const getCurrentYear = (): number => moment(new Date()).year() + 1;

export const getYears = (): number[] => range(1990, getCurrentYear(), 1);

export const getMonths = (): string[] => [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getMonth = (date: Date): string => getMonths()[date.getMonth()];

export const getYear = (date: Date): number => moment(date).year();
