import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Error from '../Error/Error';
import parseHash from '../../utils/parseHash';

const setAccessToken = async ({ hash, setError }) => {
  try {
    const cookies = new Cookies();
    if (hash.length) {
      const params = parseHash(hash);
      cookies.set('access_token', params.access_token);
    }
  } catch (e) {
    setError({ error: e });
  }
};

const Auth = (props) => {
  const [error, setError] = useState({});

  useEffect(() => {
    setAccessToken({ hash: props.location.hash, setError });
  }, []);

  if (Object.keys(error).length) return (<Error error={error.message} />);

  return <Redirect to="/" />;
};

Auth.propTypes = {
  location: PropTypes.object.isRequired,
};

Auth.defaultProps = {
  location: {},
};

export default Auth;
