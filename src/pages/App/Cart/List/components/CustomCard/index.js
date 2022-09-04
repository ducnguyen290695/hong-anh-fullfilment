import { Card } from 'antd';
import React from 'react';
import './index.scss';

const CustomCard = ({ children, ...rest }) => {
  return (
    <Card size="small" {...rest}>
      {children}
    </Card>
  );
};

export default CustomCard;
