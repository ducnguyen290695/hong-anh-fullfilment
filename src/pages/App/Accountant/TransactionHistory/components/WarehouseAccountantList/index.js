import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Dropdown, Input, Select } from 'antd';
import { Icon, SvgIcon } from 'assets/icons';
import CustomTable from 'components/CustomTable';
import React, { useState, useEffect } from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import { formatCurrency, getQuery, getTimeStamp, buildQueryString } from 'utils/helperFuncs';
import useSearchTextDebounce from 'hooks/useSearchTextDebounce/index';
import { useGetWalletWarehouseAccountantTransaction } from 'hooks/walletTransaction';
import { DATE_TIME_FORMAT } from 'config/constants';
import moment from 'moment';
import FilterBox from '../FilterBox';
import useDownloadFiles from 'hooks/useDownloadFiles/index';
import { useTranslation } from 'react-i18next';

const periodOptions = [
  { label: 'Đầu tháng đến hiện tại', value: 'this_month' },
  { label: 'Đầu quý đến hiện tại', value: 'this_quarter' },
  { label: 'Đầu năm đến hiện tại', value: 'this_year' },
  { label: '6 tháng đầu năm', value: 'first_six_months' },
  { label: '6 tháng cuối năm', value: 'six_months_late' },
];

const AMOUNT_STATUS = (number) =>
  number > 0 ? (
    <div className="amount-increase">{formatCurrency(number)}</div>
  ) : (
    <div className="amount-decrease">{formatCurrency(number)}</div>
  );

const HYPER_LINK_STATUS = (isSeller, id) => {
  if (isSeller) {
    return `/seller/detail/${id}`;
  } else {
    return `/account/detail/${id}`;
  }
};
const CODE_STATUS = (isSeller, id, code) => {
  if (isSeller) {
    return code;
  } else {
    return id;
  }
};

const WarehouseAccountant = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    type: [],
    source: [],
    walletType: [],
    sellerTransactionOnly: false,
    timeRange: getTimeStamp('this_month'),
    warehouseTransactionSearch: getQuery().warehouseTransactionSearch || null,
  });

  const getParams = () => ({
    filters: {
      type: params.type,
      source: params.source,
      walletType: params.walletType,
      sellerTransactionOnly: params.sellerTransactionOnly,
      timeRange: params.timeRange,
      query: params.warehouseTransactionSearch,
    },
    pagination: {
      offset: params.offset,
      limit: params.limit,
    },
  });

  const search = useSearchTextDebounce(params, setParams, 'warehouseTransactionSearch');

  const { onChangeFile } = useDownloadFiles();

  const { loading, transactions, total, refetch } = useGetWalletWarehouseAccountantTransaction(
    getParams()
  );

  const WALLET_STATUS = (amount, targetWallet, idAgent, isSeller, sellerCode) => {
    if (amount > 0) {
      return 'Ví tiền ảo';
    } else {
      return (
        <>
          <p>Ví ảo đại lý</p>
          <Link to={HYPER_LINK_STATUS(isSeller, idAgent)}>
            Mã {CODE_STATUS(isSeller, idAgent, sellerCode)}
          </Link>
        </>
      );
    }
  };

  const columns = [
    {
      title: 'THỜI GIAN',
      dataIndex: 'createdAt',
      render: (_, record) => moment(record?.createdAt).format(DATE_TIME_FORMAT),
    },
    {
      title: 'MÃ TÀI KHOẢN',
      dataIndex: 'idAgent',
      render: (_, record) => (
        <Link to={HYPER_LINK_STATUS(record.isSeller, record.idAgent)}>
          {CODE_STATUS(record.isSeller, record.idAgent, record.sellerCode)}
        </Link>
      ),
    },
    {
      title: 'TÊN KẾ TOÁN KHO',
      dataIndex: 'nameAccountantWarehouse',
    },
    {
      title: 'MÃ GIAO DỊCH',
      dataIndex: 'id',
      render: (_, record) => <b>{record.id}</b>,
    },
    {
      title: 'NGUỒN TIỀN',
      dataIndex: 'sourceType',
      render: (_, record) => <p>{t(record.sourceType)}</p>,
    },
    {
      title: 'VÍ GIAO DỊCH',
      render: (_, record) =>
        WALLET_STATUS(
          record.amount,
          record.targetWallet,
          record.idAgent,
          record.isSeller,
          record.sellerCode
        ),
    },
    {
      align: 'right',
      title: 'SỐ TIỀN',
      dataIndex: 'amount',
      render: (_, record) => AMOUNT_STATUS(record.amount),
    },
    {
      title: 'NGƯỜI THỰC HIỆN',
      dataIndex: 'executor',
    },
    {
      title: 'GHI CHÚ',
      dataIndex: 'description',
    },
    {
      align: 'center',
      title: 'FILE',
      dataIndex: 'fileURLs',
      render: (_, record) =>
        record.fileURLs.length > 0 ? (
          <SvgIcon.CloudDownloadIcon
            style={{ cursor: 'pointer' }}
            onClick={() => onChangeFile(record.fileURLs)}
          />
        ) : (
          ''
        ),
    },
  ];

  useEffect(() => {
    fetchWalletWarehouseAccountantTransaction();
  }, [params]);

  function filterByTimeRange(value) {
    setParams({
      ...params,
      timeRange: getTimeStamp(value),
    });
  }

  const fetchWalletWarehouseAccountantTransaction = async () => {
    await refetch(getParams);
  };

  function onTableChange(pagination) {
    const { current, pageSize } = pagination;
    let newParams = {
      ...params,
      offset: (current - 1) * pageSize,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  function filterExtra(values) {
    setParams({
      ...params,
      ...values,
      offset: 0,
    });
  }

  return (
    <div className="history-container">
      <div className="filter-box">
        <div className="search-input">
          <Input
            className="custom-input"
            allowClear={true}
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder="Tìm kiếm mã hoặc tên kế toán kho"
            defaultValue={getQuery().warehouseTransactionSearch || ''}
            {...search}
          />
        </div>

        <div className="period-filter">
          <span className="filter-label">Kỳ</span>
          <Select
            onChange={filterByTimeRange}
            defaultValue={'this_month'}
            className="filter custom-select"
            options={periodOptions}
          />
        </div>

        <Dropdown
          overlayClassName="dropdown-overlay"
          trigger="hover"
          overlay={<FilterBox onFilter={filterExtra} />}
          placement="bottomRight"
        >
          <Button
            icon={<FontAwesomeIcon icon={Icon.faFilter} className="filter-icon" />}
            className="filter-btn"
          >
            Bộ lọc
          </Button>
        </Dropdown>
      </div>
      <CustomTable
        loading={loading}
        pagination={{
          total: total,
          pageSize: params.limit,
          current: params.offset / params.limit + 1,
          showSizeChanger: false,
        }}
        onChange={onTableChange}
        columns={columns}
        dataSource={transactions}
        scroll={{ x: 800, y: null }}
        rowKey={(obj) => obj.id}
      />
    </div>
  );
};

export default WarehouseAccountant;
