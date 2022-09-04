import React from 'react';
import './index.scss';

const Spinner = ({ loading }) => {
  return (
    <div>
      <div className={`mask-loading ${loading === true ? 'show-mask' : 'hide-mask'}`}>
        <div className="loading"></div>
      </div>
    </div>
  );
};

export default Spinner;
