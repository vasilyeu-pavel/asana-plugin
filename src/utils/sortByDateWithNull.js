/**
 * sort by date, if !date then that element send to last
 * @param arr
 * @param ascending
 * @return {*}
 */
const sortByDateWithNull = (arr, ascending) => {
  // default to ascending
  if (typeof (ascending) === 'undefined') { ascending = true; }

  const multi = ascending ? 1 : -1;

  const sorter = (a, b) => {
    if (a.due_on === b.due_on) // identical? return 0
    { return 0; } if (a.due_on === null) // a is null? last
    { return 1; } if (b.due_on === null) // b is null? last
    { return -1; }

    return a.due_on.localeCompare(b.due_on) * multi;
  };

  return arr.sort(sorter);
};

export default sortByDateWithNull;
