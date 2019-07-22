export const getDayInMonth = (year, month) => 32 - new Date(year, month, 32).getDate();

export const getId = () => {
  const chars = '0123456789'.split('');

  let str = '';
  for (let i = 0; i < 8; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }

  return str;
};

export const getMonth = (year = new Date().getFullYear(), month = new Date().getMonth()) => {
  const dayInMonth = getDayInMonth(year, month);
  const days = [];

  for (let i = 0; i < dayInMonth; i++) {
    days.push({
      id: getId(10),
      open: false,
      day: new Date(`${year} ${month + 1} ${i + 1}`),
    });
  }

  return days;
};

export const getDayName = day => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][day.getDay()];

export const getMonthName = (month = (new Date().getMonth())) => [
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
  'December'][month];
