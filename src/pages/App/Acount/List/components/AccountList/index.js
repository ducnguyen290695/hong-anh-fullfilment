import React, { useState } from 'react';
import { Button, Input, Select, Switch, Tag } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import { buildQueryString, getQuery, notify, debounce } from 'utils/helperFuncs';
import { Link } from 'react-router-dom';
import Img from 'assets/images';
import TableSelection from 'components/TableSelection';
import CustomModal from 'components/CustomModal';
import CustomTable from 'components/CustomTable';
import { useGetUsers, useUpdateUserStatus } from 'hooks/user/user';
import { useGetRoles } from 'hooks/role';
import 'styles/custom_component.scss';
import './index.scss';
import { useStaffPermissions } from 'hooks/user/user';

const AcountList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [currentUser, setCurrentUser] = useState({
    id: '',
    status: '',
  });
  const [params, setParams] = useState({
    limit: 10,
    offset: getQuery().offset || 0,
    status: getQuery().status || null,
    departmentId: getQuery().departmentId || null,
    query: getQuery().query || null,
    roleIDs: getQuery()?.roleIDs || null,
  });

  const { users, total, loading, refetch } = useGetUsers({
    filters: {
      query: params?.query,
      status: params?.status,
      roleIDs: params.roleIDs,
    },
    pagination: {
      offset: params?.offset,
      limit: params?.limit,
    },
    hasRoleId: 1,
  });

  const { roles } = useGetRoles({
    offset: null,
    query: null,
  });

  const { canCreate, canUpdate, canDeactivateStaff } = useStaffPermissions();
  const { hanldeUpdateUserStatus } = useUpdateUserStatus();

  const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    DISABLED: 'DISABLED',
    DELETED: 'DELETED',
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log({ selectedRowKeys, selectedRows });
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
  };

  const statusOptions = [
    {
      label: 'Tất cả trạng thái',
      value: null,
    },
    {
      label: 'Đang làm việc',
      value: USER_STATUS.ACTIVE,
    },
    {
      label: 'Đã nghỉ việc',
      value: USER_STATUS.DISABLED,
    },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 50,
      render: (_, record) =>
        canUpdate ? (
          <Link to={`/account/detail/${record?.id}`} className="account-id">
            {record.id}
          </Link>
        ) : (
          <b>{record.id}</b>
        ),
    },
    {
      title: 'HỌ VÀ TÊN',
      dataIndex: 'fullname',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (_, record) => {
        if (record?.status === USER_STATUS.ACTIVE) {
          return <span className="status-on">Đang làm việc</span>;
        }
        return <span className="status-off">Đã nghỉ việc</span>;
      },
    },
    {
      title: 'PHÒNG BAN',
      dataIndex: 'departmentId',
      render: (_, record) => {
        return <span>{record.department.name}</span>;
      },
    },
    {
      title: 'VAI TRÒ',
      dataIndex: 'roleId',
      render: (_, record) => {
        return (
          <div>
            {record?.roles?.slice(0, 2)?.map(({ name }) => (
              <Tag>{name}</Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: 'HÀNH ĐỘNG',
      dataIndex: 'action',
      render: (_, record) =>
        canDeactivateStaff ? (
          <CustomModal
            message={
              <p className="user-name">
                Bạn có chắc chắn muốn {record.status === USER_STATUS.ACTIVE ? 'khóa' : 'mở khóa'}{' '}
                tài khoản <span className="user-name">{record?.fullName}</span> không ?
              </p>
            }
            centered={true}
            footer={false}
            onOke={changeUserStatus}
            icon={record.status === USER_STATUS.ACTIVE ? Img.LockedIcon : Img.UnlockedIcon}
            customComponent={
              <Switch
                onChange={(value) => onUserStatusChange(record, value)}
                checkedChildren="ON"
                unCheckedChildren="OFF"
                checked={record?.status === USER_STATUS.ACTIVE}
              />
            }
          />
        ) : (
          <></>
        ),
    },
  ];

  function onUserStatusChange({ id }, value) {
    setCurrentUser({
      id,
      status: value ? USER_STATUS.ACTIVE : USER_STATUS.DISABLED,
    });
  }

  async function changeUserStatus() {
    const { status } = currentUser;
    try {
      await hanldeUpdateUserStatus(currentUser);
      notify.success({
        message: `${status === USER_STATUS.ACTIVE ? 'Mở khóa' : 'Khóa'} tài khoản thành công !`,
      });
      refetch();
    } catch (err) {
      notify.error({
        message: `${status === USER_STATUS.ACTIVE ? 'Mở khóa' : 'Khóa'} tài khoản thất bại !`,
      });
    }
  }

  async function removeUsers() {
    try {
      await Promise.all(
        selectedRowKeys?.map((id) =>
          hanldeUpdateUserStatus({
            id,
            status: USER_STATUS.DELETED,
          })
        )
      );
      notify.error({
        message: 'Xóa tài khoản thành công !',
      });
      unSelectAllUser();
      refetch();
    } catch (err) {
      notify.success({
        message: 'Xóa tài khoản thất bại !',
      });
    }
  }

  function selectAllUser() {
    setSelectedRowKeys(users?.map((item) => item?.id));
  }

  function toggleSeclectAllUser() {
    if (selectedRowKeys?.length !== users?.length) {
      selectAllUser();
      return;
    }
    unSelectAllUser();
  }

  function unSelectAllUser() {
    setSelectedRowKeys([]);
  }

  function filterUserByStatus(status) {
    let newParams = {
      ...params,
      offset: 0,
      status,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  function filterUserByRole(roleId) {
    let newParams = {
      ...params,
      offset: 0,
      roleIDs: roleId ? [roleId] : null,
    };
    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  //Filter user by text
  const filterUserByTextDebounced = debounce(filterUserByText, 500);

  function filterUserByText([text]) {
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
    const { current, pageSize } = pagination;

    if ((current - 1) * pageSize !== params?.offset) {
      unSelectAllUser();
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

  return (
    <div className="account-container">
      <div className="filter-box">
        <div className="search-input">
          <Input
            className="custom-input"
            allowClear={true}
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder="Tìm kiếm tài khoản theo ID, họ tên hoặc email"
            onChange={(e) => filterUserByTextDebounced(e.target.value)}
            defaultValue={getQuery()?.query || ''}
          />
        </div>

        <div className="status-filter">
          <span className="filter-label">Trạng thái tài khoản</span>
          <Select
            defaultValue={getQuery().status || null}
            className="filter custom-select"
            options={statusOptions}
            onChange={filterUserByStatus}
          />
        </div>

        <div className="department-filter">
          <span className="filter-label">Vai trò</span>
          <Select
            // mode="multiple"
            defaultValue={parseInt(getQuery().roleIDs) || null}
            className="filter custom-select"
            options={[
              {
                name: 'Tất cả vai trò',
                id: null,
              },
            ]
              .concat(roles || [])
              ?.map(({ id, name }) => ({
                label: name,
                value: id,
              }))}
            onChange={filterUserByRole}
          />
        </div>

        {canCreate && (
          <Link to="/account/create">
            <Button className="create-btn" type="primary">
              Tạo tài khoản
            </Button>
          </Link>
        )}
      </div>

      {selectedRowKeys?.length > 0 && (
        <TableSelection
          name="tài khoản"
          selectedNumber={selectedRowKeys?.length}
          totalSelectedNumber={users?.length}
          onSelectAll={selectAllUser}
          toggleSelectAll={toggleSeclectAllUser}
          isSelectAll={selectedRowKeys?.length === users?.length}
          modalProps={{
            buttonLabel: 'Xóa tài khoản',
            centered: true,
            footer: false,
            message: 'Bạn có chắc muốn xóa tài khoản đã chọn không ?',
            icon: Img.DeleteIcon,
            onOke: removeUsers,
          }}
        />
      )}

      <CustomTable
        rowKey={(record) => record?.id}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users}
        scroll={{ x: 800, y: null }}
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

export default AcountList;
