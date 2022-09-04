import { Button, Input } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import Img from 'assets/images';
import CustomTable from 'components/CustomTable';
import PageHeader from 'components/PageHeader';
import TableSelection from 'components/TableSelection';
import {
  useDeleteDepartments,
  useDepartmentPermissions,
  useDepartments,
} from 'hooks/department/department';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildQueryString, debounce, formatDatetime, getQuery, notify } from 'utils/helperFuncs';
import 'styles/custom_component.scss';
import './index.scss';

const DepartmentList = () => {
  const { canCreate: canCreateDepartment, canDelete: canDeleteDepartment } =
    useDepartmentPermissions();

  const [params, setParams] = useState({
    limit: 10,
    offset: getQuery()?.offset || 0,
    search: getQuery()?.search || null,
  });
  const [selectedKeys, setSelectedKeys] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedKeys,
  };

  const getFilterParams = () => ({
    pagination: { limit: params.limit, offset: params.offset },
    filters: { query: params.search },
  });

  const { loading, departments, total, refetch } = useDepartments(getFilterParams());

  const { handleDeleteDepartments } = useDeleteDepartments();

  const columns = [
    {
      title: 'MÃ PHÒNG BAN',
      dataIndex: 'code',
      fixed: 'left',
      className: 'departmant-code',
      render: (_, record) => <Link to={`/department/detail/${record?.id}`}>{record?.code}</Link>,
    },
    {
      title: 'TÊN PHÒNG BAN',
      dataIndex: 'name',
    },
    {
      title: 'MÔ TẢ PHÒNG BAN',
      dataIndex: 'description',
    },
    {
      title: 'CẬP NHẤT MỚI NHẤT',
      dataIndex: 'updatedAt',
      render: (_, record) => formatDatetime(record?.updatedAt),
    },
  ];

  const refetchDepartment = async () => {
    await refetch({
      ...getFilterParams(),
    });
  };

  function selectAllDepartment() {
    setSelectedKeys(departments?.map((item) => item?.id));
  }

  function unSelectAllDepartment() {
    setSelectedKeys([]);
  }

  function toggleSelectAllDepartment() {
    if (selectedKeys?.length === departments?.length) {
      unSelectAllDepartment();
      return;
    }
    selectAllDepartment();
  }

  function onTableChange(pagination) {
    const { current, pageSize } = pagination;

    if ((current - 1) * pageSize !== params?.offset) {
      unSelectAllDepartment();
    }
    let newParams = {
      ...params,
      offset: (current - 1) * pageSize,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  //Filter department by code or name
  const searchDepartmentDebounced = debounce(searchDepartment, 450);

  function searchDepartment([text]) {
    if (text[0] === ' ') {
      return;
    }
    let newParams = {
      ...params,
      offset: 0,
      search: text || null,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  const removeDepartments = async () => {
    if (canDeleteDepartment) {
      try {
        await handleDeleteDepartments(selectedKeys);
        notify.success({
          message: 'Xóa phòng ban thành công !',
        });
        await refetchDepartment();
        unSelectAllDepartment();
      } catch {
        notify.error({
          message: 'Xóa phòng ban thất bại !',
        });
      }
    } else {
      notify.error({
        message: 'Bạn không có quyền xóa phòng ban!',
      });
    }
  };

  useEffect(() => {
    refetchDepartment();
  }, [params]);

  return (
    <div className="department-container">
      <PageHeader
        pageTitle="Danh sách phòng ban"
        routes={[
          {
            path: '/setting',
            name: 'Cài đặt hệ thống',
          },
          {
            path: '',
            name: 'Quản lý phòng ban',
          },
        ]}
      />

      {selectedKeys?.length > 0 && (
        <TableSelection
          name="phòng ban"
          selectedNumber={selectedKeys?.length}
          totalSelectedNumber={departments?.length}
          onSelectAll={selectAllDepartment}
          toggleSelectAll={toggleSelectAllDepartment}
          isSelectAll={selectedKeys?.length === departments?.length}
          modalProps={{
            buttonLabel: 'Xóa phòng ban',
            centered: true,
            footer: false,
            message: 'Bạn có chắc muốn xóa phòng ban đã chọn không ?',
            icon: Img.DeleteIcon,
            onOke: removeDepartments,
          }}
        />
      )}

      <div className="filter-box">
        <div className="search-input">
          <Input
            className="custom-input"
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder="Tìm kiếm mã, tên phòng ban"
            onChange={(e) => searchDepartmentDebounced(e.target.value)}
            allowClear={true}
            defaultValue={getQuery()?.search || ''}
          />
        </div>

        {canCreateDepartment && (
          <Link to="/department/create">
            <Button className="create-btn" type="primary">
              Thêm phòng ban
            </Button>
          </Link>
        )}
      </div>

      <CustomTable
        rowKey={(record) => record?.id}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={departments}
        scroll={{ x: 800, y: null }}
        loading={loading}
        pagination={{
          total: total,
          pageSize: params.limit,
          current: params.offset / params.limit + 1,
          showSizeChanger: false,
        }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default DepartmentList;
