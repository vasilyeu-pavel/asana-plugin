import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Preloader.scss';

const Preloader = () => (
  <div className="Preloader">
    <div className="spinner-border text-success" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

export default Preloader;
