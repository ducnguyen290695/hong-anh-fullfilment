import React from 'react';
import { Tabs } from 'antd';
import { useHistory } from 'react-router-dom';

const { TabPane } = Tabs;

const CustomTabs = ({ listTabPanel, defaultActiveKey }) => {
  const history = useHistory();

  const renderListTabPanel = listTabPanel.map((value) => {
    if (value.permission)
      return (
        <TabPane tab={value.name} key={value.id}>
          {value.component}
        </TabPane>
      );
    else return <></>;
  });

  return (
    <Tabs
      tabBarGutter={40}
      defaultActiveKey={history?.location?.state?.tab || defaultActiveKey}
      tabBarStyle={{
        backgroundColor: '#e7f0ff',
        padding: '12px 24px',
        marginBottom: '20px',
        borderRadius: '8px',
      }}
    >
      {renderListTabPanel}
    </Tabs>
  );
};

export default CustomTabs;
