import React from 'react';
import PageHeader from 'components/PageHeader';
import './index.scss';
import SellerList from './components/SellerList';
import WarehouseAccountantList from './components/WarehouseAccountantList/index';
import CustomTabs from 'components/CustomTabs/index';
import { useTranslation } from 'react-i18next';
import { useAccountantPermissions } from 'hooks/user/user';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';

const defaultActiveKey = 'transaction-history';

const TransactionHistory = () => {
  const { t } = useTranslation();
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { displayAccountantTxHistory, displaySellerTxHistory } = useAccountantPermissions();

  const listTabPanel = [
    {
      id: '1',
      name: 'Tài khoản Đại lý',
      component: <SellerList />,
      permission: displaySellerTxHistory,
    },
    {
      id: '2',
      name: 'Tài khoản Kế toán kho',
      component: <WarehouseAccountantList />,
      permission: displayAccountantTxHistory,
    },
  ];

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loadUserPermissions} />
      ) : (displayAccountantTxHistory || displaySellerTxHistory) === true ? (
        <div className="history-container">
          <PageHeader
            pageTitle={t('accountant.transactionHistory')}
            routes={[
              {
                path: '/setting',
                name: 'Kế toán',
              },
              {
                path: '/history',
                name: t('accountant.transactionHistory'),
              },
            ]}
          />
          <CustomTabs listTabPanel={listTabPanel} defaultActiveKey={defaultActiveKey} />
        </div>
      ) : (
        <Page403 />
      )}
    </>
  );
};

export default TransactionHistory;
