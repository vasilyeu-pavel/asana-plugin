export const formatDate = (dateString) => {
  const date = new Date(dateString);

  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;

  const yy = date.getFullYear();

  return `${yy}-${mm}-${dd}`;
};
