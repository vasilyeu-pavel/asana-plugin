import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'shards-react';

const Error = ({ error }) => {
  const [open, handleOpen] = useState(true);

  return (
    <Alert
      theme="danger"
      open={open}
      dismissible={() => handleOpen(!open)}
    >
      <p className="alert-link">
        {error}
      </p>
    </Alert>
  );
};

Error.propTypes = {
  error: PropTypes.string.isRequired,
};

export default Error;
