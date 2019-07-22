export default (hash) => {
  const params = {};
  hash.substring(1).split('&').map((key) => {
    const temp = key.split('=');
    params[temp[0]] = temp[1];
  });

  return params;
};
