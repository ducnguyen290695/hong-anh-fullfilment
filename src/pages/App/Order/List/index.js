import React, { useState, useEffect } from 'react';
import PageHeader from 'components/PageHeader';
import StatusTabs from './components/StatusTabs';
import OrderTable from './components/OrderTable';
import { useTranslation } from 'react-i18next';
import { STATUS_ORDER } from 'config/constants';
import { buildQueryString, getQuery } from 'utils/helperFuncs';
import { useGetOrders, useOrderPermissions } from 'hooks/order';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';

const OrderList = () => {
  const GET_QUERY = getQuery();

  const { t } = useTranslation();
  const [statusOrder, setStatusOrder] = useState(
    GET_QUERY.statuses && GET_QUERY.statuses.length === 1 ? GET_QUERY.statuses[0] : STATUS_ORDER.ALL
  );

  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { canViewOrder } = useOrderPermissions();
  const { loading } = useGetOrders();

  useEffect(() => {
    const statuses =
      GET_QUERY.statuses && GET_QUERY.statuses.length === 1
        ? GET_QUERY.statuses[0]
        : STATUS_ORDER.ALL;
    setStatusOrder(statuses);
  }, [GET_QUERY.statuses]);

  const handleChange = (data) => {
    setStatusOrder(data.value);
    buildQueryString({
      params: {
        offset: 0,
        limit: 10,
        statuses: data.value !== STATUS_ORDER.ALL ? [data.value] : [],
      },
    });
  };

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loading} />
      ) : canViewOrder ? (
        <div>
          <PageHeader pageTitle={t('order.orderList.pageTitle')} />
          <StatusTabs statusOrder={statusOrder} onChange={handleChange} />
          <OrderTable statusOrder={statusOrder} />
        </div>
      ) : (
        <Page403 />
      )}
    </>
  );
};

export default OrderList;
