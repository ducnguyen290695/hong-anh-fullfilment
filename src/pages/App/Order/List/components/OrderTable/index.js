import './index.scss';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import CustomTable from 'components/CustomTable';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetCreatedByWithIds, useGetOrders, useGetWarehousesWithIds } from 'hooks/order';
import { Input } from 'antd';

import FilterMenu from '../FilterMenu';
import useColumnsOrder from '../ColumnsOrder';
import useDebounce from 'hooks/useDebounce';
import { STATUS_ORDER } from 'config/constants';
import TagsList from '../TagsList';
import WaitingApprovalButtons from '../WaitingApprovalButtons';
import WaitingStocksButtons from '../WaitingStocksButtons';
import WaitingPaymentButtons from '../WaitingPaymentButtons';
import WaitingExportingButtons from '../WaitingExportingButtons';
import WaitingShippingButtons from '../WaitingShippingButtons';
import { buildQueryString, getQuery } from 'utils/helperFuncs';
import { useOrder } from 'pages/App/Order/hooks';
import { unset } from 'lodash';

const OrderTable = ({ statusOrder }) => {
  const GET_QUERY = getQuery();
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useTranslation();
  const { orderPriorityOptions, shippingOptions, paymentMethodOptions, statusOptions } = useOrder();
  const [searchTerm, setSearchTerm] = useState('');
  const [checkedList, setCheckedList] = useState([]);
  const [checkedKeyList, setCheckedKeyList] = useState([]);
  const debouncedValue = useDebounce(searchTerm, 500);
  const [params, setParams] = useState({
    filters: {
      statuses: GET_QUERY.statuses || [],
      query: GET_QUERY.query || undefined,
      exportedWarehouseIDs: GET_QUERY.exportedWarehouseIDs || [],
      priorities: GET_QUERY.priorities || [],
      fullStockRequired: GET_QUERY.fullStockRequired || undefined,
      shippingTypes: GET_QUERY.shippingTypes || [],
      vat: GET_QUERY.vat || undefined,
      paymentMethods: GET_QUERY.paymentMethods || [],
      createdByIDs: GET_QUERY.createdByIDs || [],
      stockStatus: GET_QUERY.stockStatus || undefined,
      timeRange: {
        from: GET_QUERY?.from || undefined,
        to: GET_QUERY?.to || undefined,
      },
    },
    pagination: { offset: GET_QUERY.offset || 0, limit: 10 },
    sort: [],
  });
  const { data, loading, paginationData, refetch } = useGetOrders(params);
  const { data: dataWarehousesWithIds, loading: loadingWarehousesWithIds } =
    useGetWarehousesWithIds({
      request: {
        ids: GET_QUERY.exportedWarehouseIDs ? GET_QUERY.exportedWarehouseIDs : undefined,
      },
    });
  const { data: dataCreatedByWithIds, loading: loadingCreatedByWithIds } = useGetCreatedByWithIds({
    ids: GET_QUERY.createdByIDs ? GET_QUERY.createdByIDs : undefined,
  });
  const [filterTags, setFilterTags] = useState({});

  const findFilterTags = (keyQuery, options) => {
    return GET_QUERY?.[`${keyQuery}`]?.map((itemQuery) =>
      options?.find((itemPriority) => itemPriority.value === itemQuery)
    );
  };

  const { renderColumns } = useColumnsOrder(params, setParams, filterTags, setFilterTags);
  const rowSelection = () => {
    switch (statusOrder) {
      case STATUS_ORDER.ALL:
      case STATUS_ORDER.DELIVERING:
      case STATUS_ORDER.COMPLETED:
        return undefined;
      case STATUS_ORDER.WAITING_FOR_APPROVAL:
      case STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK:
      case STATUS_ORDER.WAITING_FOR_PAYMENT:
      case STATUS_ORDER.WAITING_FOR_EXPORTING:
      case STATUS_ORDER.WAITING_FOR_SHIPPING:
      case STATUS_ORDER.CANCELED:
        return {
          type: 'checkbox',
          onChange: (selectedRowKeys, selectedRows) => {
            setCheckedKeyList(selectedRowKeys);
            setCheckedList(selectedRows);
          },
          preserveSelectedRowKeys: true,
          selectedRowKeys: checkedKeyList,
        };
      default:
        break;
    }
  };

  const renderButtonGroup = () => {
    switch (statusOrder) {
      case STATUS_ORDER.WAITING_FOR_APPROVAL:
        return (
          <WaitingApprovalButtons checkedKeyList={checkedKeyList} selectedList={checkedList} />
        );
      case STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK:
        return <WaitingStocksButtons checkedKeyList={checkedKeyList} selectedList={checkedList} />;

      case STATUS_ORDER.WAITING_FOR_PAYMENT:
        return <WaitingPaymentButtons checkedKeyList={checkedKeyList} />;

      case STATUS_ORDER.WAITING_FOR_EXPORTING:
        return (
          <WaitingExportingButtons checkedKeyList={checkedKeyList} selectedList={checkedList} />
        );
      case STATUS_ORDER.WAITING_FOR_SHIPPING:
        return <WaitingShippingButtons checkedKeyList={checkedKeyList} />;
      default:
        return <></>;
    }
  };

  function onTableChange(pagination) {
    const { current, pageSize } = pagination;

    let newParams = {
      ...params,
      pagination: { ...params.pagination, offset: (current - 1) * pageSize },
    };

    setParams(newParams);
    const queryString = {
      ...newParams.filters,
      ...newParams.pagination,
      ...newParams.sort,
      ...newParams.filters.timeRange,
    };
    unset(queryString, 'timeRange');
    buildQueryString({ params: { ...queryString } });
  }

  useEffect(() => {
    setFilterTags({
      exportedWarehouseIDs: dataWarehousesWithIds,
      priorities: findFilterTags('priorities', orderPriorityOptions),
      shippingTypes: findFilterTags('shippingTypes', shippingOptions),
      paymentMethods: findFilterTags('paymentMethods', paymentMethodOptions),
      statuses: findFilterTags('statuses', statusOptions),
      createdByIDs: dataCreatedByWithIds,
      vat: GET_QUERY?.vat,
      fullStockRequired: GET_QUERY.fullStockRequired,
      stockStatus: GET_QUERY.stockStatus,
      timeRange: {
        from: GET_QUERY?.from,
        to: GET_QUERY?.to,
      },
    });
  }, [loadingWarehousesWithIds, loadingCreatedByWithIds, JSON.stringify(GET_QUERY)]);

  useEffect(() => {
    const newParams = {
      ...params,
      filters: { ...params.filters, query: debouncedValue ? debouncedValue : undefined },
    };
    setParams(newParams);
    const queryString = {
      ...newParams.filters,
      ...newParams.pagination,
      ...newParams.sort,
      ...newParams.filters.timeRange,
    };
    unset(queryString, 'timeRange');
    buildQueryString({ params: { ...queryString } });
  }, [debouncedValue]);

  useEffect(() => {
    if (isMounted) {
      const newParams = {
        filters: { statuses: GET_QUERY.statuses ? GET_QUERY.statuses : [] },
        pagination: { offset: GET_QUERY.offset ? GET_QUERY.offset : 0, limit: 10 },
        sort: [],
      };
      setFilterTags({});
      setParams(newParams);
    } else {
      const newParams = {
        filters: { ...params.filters, statuses: GET_QUERY.statuses ? GET_QUERY.statuses : [] },
        pagination: { offset: GET_QUERY.offset ? GET_QUERY.offset : 0, limit: 10 },
        sort: [],
      };
      setParams(newParams);
      setIsMounted(true);
    }
  }, [statusOrder]);

  useEffect(async () => {
    const newParams = { ...params };
    const queryString = {
      ...newParams.filters,
      ...newParams.pagination,
      ...newParams.sort,
      ...newParams.filters.timeRange,
    };
    unset(queryString, 'timeRange');
    buildQueryString({ params: { ...queryString } });
    await refetch(newParams);
  }, [params]);

  return (
    <div className="order-container">
      <div className="filter-box">
        <div className="search-input">
          <FilterMenu
            params={params}
            setParams={setParams}
            filterTags={filterTags}
            setFilterTags={setFilterTags}
          />
          <Input
            className="custom-input"
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder={t('order.orderList.placeholderInputSearch')}
            allowClear={true}
            defaultValue={params.filters.query}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {renderButtonGroup()}
      </div>
      <TagsList
        params={params}
        setParams={setParams}
        statusOrder={statusOrder}
        filterTags={filterTags}
        setFilterTags={setFilterTags}
      />
      <CustomTable
        columns={renderColumns(statusOrder)}
        pagination={{
          total: paginationData?.total,
          pageSize: paginationData?.limit,
          current: paginationData?.offset / paginationData?.limit + 1,
          showSizeChanger: false,
        }}
        dataSource={data}
        scroll={{ x: 1500, y: null }}
        loading={loading}
        onChange={onTableChange}
        rowSelection={rowSelection()}
        rowKey={(obj) => obj.id}
      />
    </div>
  );
};

export default OrderTable;
