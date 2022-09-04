import { Button, Input, Spin, Switch } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import CustomTable from 'components/CustomTable';
import PageHeader from 'components/PageHeader';
import { useGetCategories } from 'hooks/category/category';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'styles/custom_component.scss';
import { buildQueryString, debounce, getQuery } from 'utils/helperFuncs';
import './index.scss';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';
import { useProductPermissions } from 'hooks/product/product';

const ProductGroupList = () => {
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { canViewProduct } = useProductPermissions();
  const [params, setParams] = useState({
    offset: getQuery().offset || 0,
    limit: 10,
    fullTextSearch: getQuery().fullTextSearch || null,
  });

  const getParams = () => ({
    filters: {
      query: params.fullTextSearch,
    },
    pagination: {
      limit: params.limit,
      offset: params.offset,
    },
  });

  const { data, loading, refetch } = useGetCategories(getParams());

  const columns = [
    {
      title: 'MÃ LOẠI',
      dataIndex: 'code',
      fixed: 'left',
      className: 'product-group-code-column',
      render: (_, record) => (
        <Link to={`/product-group/detail/${record?.id}`} className="product-group-code">
          {record.code}
        </Link>
      ),
    },
    {
      title: 'TÊN LOẠI',
      dataIndex: 'name',
    },

    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (_, record) => (
        <Switch
          disabled
          checkedChildren="On"
          unCheckedChildren="Off"
          defaultChecked={record?.isActive}
        />
      ),
    },
  ];

  function filterByText([text]) {
    if (text[0] === ' ') {
      return;
    }
    let newParams = {
      ...params,
      offset: 0,
      fullTextSearch: text.length > 0 ? text : null,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  //Filter user by text
  const filterByTextDebounced = debounce(filterByText, 500);

  function onTableChange(pagination, filters, sorter) {
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

  const fetchProductGroup = async () => {
    await refetch(getParams);
  };

  useEffect(() => {
    fetchProductGroup();
  }, [params]);

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loadUserPermissions} />
      ) : canViewProduct ? (
        <div className="product-group-container">
          <PageHeader pageTitle="Danh sách loại sản phẩm" />

          <div className="filter-box">
            <div className="search-input">
              <Input
                prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
                placeholder="Tìm kiếm loại sản phẩm theo mã, tên loại"
                onChange={(e) => filterByTextDebounced(e.target.value)}
                allowClear
                defaultValue={getQuery().fullTextSearch || ''}
              />
            </div>

            <Link to="/product-group/create">
              <Button className="create-btn" type="primary">
                Thêm loại sản phẩm
              </Button>
            </Link>
          </div>
          <Spin spinning={loading}>
            <CustomTable
              columns={columns}
              dataSource={data?.categories}
              scroll={{ x: 800, y: null }}
              onChange={onTableChange}
              pagination={{
                total: data?.paginationData?.total,
                pageSize: params.limit,
                current: params.offset / params.limit + 1,
                showSizeChanger: false,
              }}
              loading={loading}
            />
          </Spin>
        </div>
      ) : (
        <Page403 />
      )}
    </>
  );
};

export default ProductGroupList;
