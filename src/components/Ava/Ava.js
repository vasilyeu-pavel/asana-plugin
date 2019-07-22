import React from 'react';
import PropTypes from 'prop-types';
import './Ava.scss';

const Ava = src => (
  <img
    id="main-logo"
    className="d-inline-block align-top mr-1 avatar"
    src={
      src && src.photo ? src.photo.image_36x36
        : 'https://storage.googleapis.com/growity-163319.appspot.com/growity-landing/team/growity-icon_green.svg'
    }
    alt="Assigned"
  />
);

Ava.propTypes = {
  src: PropTypes.object,
};

Ava.defaultProps = {
  src: {},
};

export default Ava;
