import React from 'react';
import PageHeader from 'components/PageHeader';
import AccountList from './components/AccountList';
import RoleList from '../../Role/List';
import { Tabs } from 'antd';
import { useHistory } from 'react-router-dom';
import './index.scss';
import { useRolePermissions } from 'hooks/role';
import { useGetUserPermissions, useStaffPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';
import Page403 from 'pages/PageError/403';

const { TabPane } = Tabs;

const Account = () => {
  const history = useHistory();
  const { canView: canViewRole } = useRolePermissions();
  const { canView: canViewStaff } = useStaffPermissions();
  const { loading: loadUserPermissions } = useGetUserPermissions();

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loadUserPermissions} />
      ) : (canViewRole || canViewStaff) === true ? (
        <div className="account-container">
          <PageHeader
            pageTitle="Danh sách tài khoản"
            routes={[
              {
                path: '/setting',
                name: 'Cài đặt hệ thống',
              },
              {
                path: '',
                name: 'Quản lý tài khoản',
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
            {canViewStaff && (
              <TabPane tab="Nhân viên" key="account-list">
                <AccountList />
              </TabPane>
            )}

            {canViewRole && (
              <TabPane tab="Vai trò" key="role-list">
                <RoleList />
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

export default Account;
