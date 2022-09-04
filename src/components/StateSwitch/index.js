import React from 'react';
import { Switch } from 'antd';

const StateSwitch = (props) => {
  return <Switch checkedChildren="ON" unCheckedChildren="OFF" {...props} />;
};

export default StateSwitch;
