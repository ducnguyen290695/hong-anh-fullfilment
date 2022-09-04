import React, { useState } from 'react';
import PageHeader from 'components/PageHeader';
import CustomTable from 'components/CustomTable';
import CustomModal from 'components/CustomModal';
import Img from 'assets/images';
import { Link } from 'react-router-dom';
import { Button, Input, Select, Switch, Dropdown } from 'antd';
import { Icon, FontAwesomeIcon } from 'assets/icons';
import { useGetSeller, useSellerPermissions } from 'hooks/seller';
import { buildQueryString, getQuery, notify, debounce, getTimeStamp } from 'utils/helperFuncs';
import { useUpdateSellerStatus } from 'hooks/seller';
import FilterBox from './components/FilterBox';
import { Tag } from 'antd';

import './index.scss';
import Page403 from 'pages/PageError/403';
import Spinner from 'components/Spinner';
import { useGetUserPermissions } from 'hooks/user/user';

const SellerList = () => {
  const { canCreate, canDeactivate, canView } = useSellerPermissions();
  const { loading: loadUserPermissions } = useGetUserPermissions();

  const [selectedSeller, setSelectedSeller] = useState({
    id: null,
    isActive: null,
  });

  const [params, setParams] = useState({
    offset: 0,
    query: getQuery().query || null,
    limit: 10,
    timeRange: getTimeStamp('this_month'),
    exportedWarehouseID: null,
    isActive: null,
    sellerLevelID: null,
  });

  const { hanldeUpdateSellerStatus } = useUpdateSellerStatus(selectedSeller);

  const { loading, data, total, refetch } = useGetSeller({
    filters: {
      timeRange: params.timeRange,
      query: params.query,
      exportedWarehouseID: params.exportedWarehouseID,
      isActive: params.isActive,
      sellerLevelID: params.sellerLevelID,
    },
    pagination: {
      offset: params.offset,
      limit: params.limit,
    },
  });

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

  const columns = [
    {
      title: 'MÃ ĐẠI LÝ',
      dataIndex: 'code',
      render: (_, record) => (
        <Link to={`/seller/detail/${record?.id}`} className="agent-code">
          {record.code}
        </Link>
      ),
    },
    {
      title: 'TÊN ĐẠI LÝ',
      dataIndex: 'shortName',
    },
    {
      title: 'ĐỊA CHỈ',
      dataIndex: 'address',
    },
    {
      title: 'CẤP ĐỘ',
      dataIndex: 'level',
      render: (_, record) => record?.sellerLevel?.name,
    },
    {
      title: 'HẠN MỨC CÔNG NỢ',
      dataIndex: 'debtLimit',
    },
    {
      title: 'TUỔI NỢ (THÁNG)',
      dataIndex: 'debtAge',
    },
    {
      title: 'KHO XUẤT HÀNG',
      dataIndex: 'warehouse',
      render: (_, record) => {
        return record?.warehouses?.slice(0, 3)?.map(({ name }) => <Tag>{name}</Tag>);
      },
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (_, record) =>
        canDeactivate ? (
          <CustomModal
            message={
              <p className="user-name">{`Bạn có chắc muốn ${
                selectedSeller.isActive ? 'mở khóa' : 'khóa'
              } tài khoản đã chọn không ?`}</p>
            }
            centered={true}
            footer={false}
            onOke={changeSellerStatus}
            icon={record.isActive === true ? Img.LockedIcon : Img.UnlockedIcon}
            customComponent={
              <Switch
                onChange={(value) => onChangeStatus(record, value)}
                checkedChildren="ON"
                unCheckedChildren="OFF"
                checked={record.isActive === true}
              />
            }
          />
        ) : (
          <></>
        ),
    },
  ];

  function onChangeStatus(record, value) {
    console.log({ record, value });
    setSelectedSeller({
      id: record?.id,
      isActive: value,
    });
  }

  async function changeSellerStatus() {
    const { isActive } = selectedSeller;
    try {
      await hanldeUpdateSellerStatus();
      notify.success({
        message: isActive ? 'Mở khóa tài khoản thành công !' : 'Khóa tài khoản thành công !',
      });
      refetch();
    } catch (err) {
      console.log(err);
      notify.error({
        message: isActive ? 'Mở khóa tài khoản thất bại !' : 'Khóa tài khoản thất bại !',
      });
    }
  }

  //Filter role by text
  const filterRoleByTextDebounced = debounce(filterRoleByText, 400);

  function filterRoleByText([text]) {
    if (text[0] === ' ') {
      return;
    }

    let newParams = {
      ...params,
      offset: 0,
      query: text.length > 0 ? text : null,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  function onTableChange(pagination, filters, sorter) {
    console.log({ pagination, filters, sorter });
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

  function filterSellerByTimeRange(value) {
    setParams({
      ...params,
      timeRange: getTimeStamp(value),
    });
  }

  function filterSellerExtra(values) {
    setParams({
      ...params,
      ...values,
      offset: 0,
    });
  }

  return loadUserPermissions ? (
    <Spinner loading={loadUserPermissions} />
  ) : canView ? (
    <div className="agent-container">
      <PageHeader
        pageTitle="Danh sách tài khoản đại lý"
        routes={[
          {
            path: '/setting',
            name: 'Cài đặt hệ thống',
          },
          {
            path: '',
            name: 'Quản lý tài khoản đại lý',
          },
        ]}
      />

      <div className="filter-box">
        <div className="search-input">
          <Input
            className="custom-input"
            allowClear={true}
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder="Tìm kiếm mã hoặc tên đại lý"
            onChange={(e) => filterRoleByTextDebounced(e.target.value)}
            defaultValue={getQuery().query || ''}
          />
        </div>

        <div className="period-filter">
          <span className="filter-label">Kỳ</span>
          <Select
            onChange={filterSellerByTimeRange}
            defaultValue={'this_month'}
            className="filter custom-select"
            options={periodOptions}
          />
        </div>

        <Dropdown
          overlayClassName="dropdown-overlay"
          trigger="hover"
          overlay={<FilterBox onFilter={filterSellerExtra} />}
          placement="bottomRight"
        >
          <Button
            icon={<FontAwesomeIcon icon={Icon.faFilter} className="filter-icon" />}
            className="filter-btn"
          >
            Bộ lọc
          </Button>
        </Dropdown>

        {canCreate && (
          <Link to="/seller/create">
            <Button className="create-btn" type="primary">
              Thêm đại lý
            </Button>
          </Link>
        )}
      </div>

      <CustomTable
        rowKey={(record) => record?.id}
        columns={columns}
        dataSource={data}
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
  ) : (
    <Page403 />
  );
};

export default SellerList;
