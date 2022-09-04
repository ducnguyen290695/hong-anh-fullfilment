import React from 'react';
import { Link } from 'react-router-dom';
import './index.scss';

const PageHeader = ({ pageTitle, routes }) => {
  return (
    <div className="page-header">
      <p className="page-title">{pageTitle}</p>
      <div className="bread-crumb">
        {routes?.map((item, index) => {
          if (index !== routes.length - 1) {
            return (
              <Link to={item?.path}>
                {item?.name} <span>/ </span>
              </Link>
            );
          }
          return <span>{item?.name}</span>;
        })}
      </div>
    </div>
  );
};

export default PageHeader;
