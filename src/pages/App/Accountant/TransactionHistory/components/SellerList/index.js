import React, { useState, useEffect } from 'react';
import CustomTable from 'components/CustomTable';
import { useGetWalletTransaction } from 'hooks/walletTransaction';
import { getTimeStamp } from 'utils/helperFuncs';
import { Button, Input, Select, Dropdown } from 'antd';
import { Icon, FontAwesomeIcon, SvgIcon } from 'assets/icons';
import { getQuery, buildQueryString } from 'utils/helperFuncs';
import moment from 'moment';
import { DATE_TIME_FORMAT } from 'config/constants';
import FilterBox from '../FilterBox';
import useSearchTextDebounce from 'hooks/useSearchTextDebounce/index';
import { formatCurrency } from 'utils/helperFuncs';
import './index.scss';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useDownloadFiles from 'hooks/useDownloadFiles/index';

const periodOptions = [
  {
    label: 'Đầu tháng đến hiện tại',
    value: 'this_month',
  },
  {
    label: 'Đầu quý đến hiện tại',
    value: 'this_quarter',
  },
  {
    label: 'Đầu năm đến hiện tại',
    value: 'this_year',
  },
  {
    label: '6 tháng đầu năm',
    value: 'first_six_months',
  },
  {
    label: '6 tháng cuối năm',
    value: 'six_months_late',
  },
];

const SellerList = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { onChangeFile } = useDownloadFiles();
  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    type: [],
    source: [],
    walletType: [],
    sellerTransactionOnly: true,
    sellerTransactionSearch: getQuery().sellerTransactionSearch || null,
    timeRange: getTimeStamp('this_month'),
  });

  const getParams = () => ({
    filters: {
      type: params.type,
      source: params.source,
      walletType: params.walletType,
      sellerTransactionOnly: params.sellerTransactionOnly,
      timeRange: params.timeRange,
      query: location?.state?.query || params.sellerTransactionSearch,
    },
    pagination: {
      offset: params.offset,
      limit: params.limit,
    },
  });

  const { loading, transactions, total, refetch } = useGetWalletTransaction(getParams());

  const columns = [
    {
      title: 'THỜI GIAN',
      dataIndex: 'createdAt',
      render: (_, record) => moment(record?.createdAt).format(DATE_TIME_FORMAT),
    },
    {
      title: 'MÃ ĐẠI LÝ',
      dataIndex: 'sellerCode',
      render: (_, record) => (
        <Link to={`/seller/detail/${record.sellerId}`}>{record?.sellerCode}</Link>
      ),
    },
    {
      title: 'TÊN ĐẠI LÝ',
      dataIndex: 'sellerName',
      render: (_, record) => record?.sellerName,
    },
    {
      title: 'MÃ GIAO DỊCH',
      dataIndex: 'billId',
      render: (_, record) => <b>{record.billId}</b>,
    },
    {
      title: 'NGUỒN TIỀN NẠP',
      dataIndex: 'sourceWallet',
      render: (_, record) => {
        if (record.amount >= 0) {
          return record.sourceWallet === 'BANK_ACCOUNT' ? 'TK ngân hàng' : 'Ví tiền ảo';
        } else {
          return '';
        }
      },
    },
    {
      title: 'LOẠI GIAO DỊCH',
      dataIndex: 'bankTransferType',
      render: (_, record) => <div>{t(record.bankTransferType)}</div>,
    },
    {
      title: 'SỐ TIỀN',
      dataIndex: 'amount',
      render: (_, record) =>
        record.amount >= 0 ? (
          <div className="amount-increase">+{formatCurrency(record.amount)}</div>
        ) : (
          <div className="amount-decrease">{formatCurrency(record.amount)}</div>
        ),
    },
    {
      title: 'NGƯỜI THỰC HIỆN',
      dataIndex: 'createdBy',
      render: (_, record) => (record.amount >= 0 ? record?.createdBy : 'system'),
    },
    {
      title: 'MÃ ĐƠN HÀNG',
      dataIndex: 'orderID',
      render: (_, record) => (record.orderID ? <Link>{record.orderID}</Link> : ''),
    },
    {
      title: 'GHI CHÚ',
      dataIndex: 'description',
      render: (_, record) =>
        record.amount >= 0 ? record.description : `Thanh toán đơn hàng ${record.orderID}`,
    },
    {
      title: 'FILE',
      dataIndex: 'fileURLs',
      render: (_, record) =>
        record?.fileURLs?.length ? (
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
    refetchParams();
  }, [params]);

  const refetchParams = async () => {
    await refetch(getParams());
  };

  const search = useSearchTextDebounce(params, setParams, 'sellerTransactionSearch');

  function filterByTimeRange(value) {
    setParams({
      ...params,
      timeRange: getTimeStamp(value),
    });
  }

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
            placeholder="Tìm kiếm mã hoặc tên đại lý"
            defaultValue={getQuery().sellerTransactionSearch || ''}
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
        columns={columns}
        dataSource={transactions}
        scroll={{ x: 800, y: null }}
        loading={loading}
        onChange={onTableChange}
        pagination={{
          total,
          pageSize: params.limit,
          current: params.offset / params.limit + 1,
          showSizeChanger: false,
        }}
      />
    </div>
  );
};

export default SellerList;
