import React from 'react';
import PageHeader from 'components/PageHeader';
import { Tabs } from 'antd';
import { useHistory } from 'react-router-dom';
import WarehouseAccountantList from './components/WarehouseAccountantList';
import './index.scss';
import SellerList from './components/SellerList';
import { useAccountantPermissions } from 'hooks/user/user';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';

const { TabPane } = Tabs;
const AccountantList = () => {
  const history = useHistory();
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { displayAccountantList, displaySellerList } = useAccountantPermissions();

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loadUserPermissions} />
      ) : (displayAccountantList || displaySellerList) === true ? (
        <div className="accountant-container">
          <PageHeader
            pageTitle="Danh sách tài khoản"
            routes={[
              {
                path: '/setting',
                name: 'Kế toán',
              },
              {
                path: '',
                name: 'Danh sách tài khoản',
              },
            ]}
          />

          <Tabs
            tabBarGutter={40}
            defaultActiveKey={history?.location?.state?.tab || 'account-list'}
            tabBarStyle={{
              backgroundColor: '#e7f0ff',
              padding: '12px 24px',
              marginBottom: '20px',
              borderRadius: '8px',
            }}
          >
            {displaySellerList && (
              <TabPane tab="Tài khoản Đại lý" key="seller-list">
                <SellerList />
              </TabPane>
            )}
            {displayAccountantList && (
              <TabPane tab="Tài khoản Kế toán kho" key="warehouse-accountant-list">
                <WarehouseAccountantList />
              </TabPane>
            )}
          </Tabs>
        </div>
      ) : (
        <Page403 />
      )}
    </>
  );
};

export default AccountantList;
