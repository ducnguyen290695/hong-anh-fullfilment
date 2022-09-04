import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { FontAwesomeIcon, Icon } from 'assets/icons';
import { buildQueryString, getQuery, debounce } from 'utils/helperFuncs';
import { Link } from 'react-router-dom';
import CustomTable from 'components/CustomTable';
import CustomModal from 'components/CustomModal';
import { useGetRoles, useAssignUsersToRole, useDeleteRole } from 'hooks/role';
import { useGetUsers } from 'hooks/user/user';
import { notify } from 'utils/helperFuncs';
import 'styles/custom_component.scss';
import './index.scss';
import { useCreateRole } from 'hooks/role';
import { useHistory } from 'react-router-dom';
import { useRolePermissions } from 'hooks/role';
import { useStaffPermissions } from 'hooks/user/user';

const RoleList = () => {
  const [params, setParams] = useState({
    offset: 0,
    limit: 10,
    query: null,
  });
  const history = useHistory();

  const [userQueryParams, setUserQueryParams] = useState({
    offset: 0,
    limit: 10,
    query: null,
    hasRoleId: 1,
  });

  const [initUserIds, setInitUserIds] = useState([]);
  const [switchClose, setSwitchClose] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState();
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
  };

  const { canCreate, canUpdate, canDelete } = useRolePermissions();
  const { canAssignRole } = useStaffPermissions();
  const { loading: creating, handleCreateRole } = useCreateRole();
  const {
    loading,
    roles,
    total,
    refetch: refetchRoles,
  } = useGetRoles({
    offset: params.offset,
    query: params.query,
  });

  const {
    users,
    total: totalUser,
    loading: userTableLoading,
    refetch: refetchUsers,
  } = useGetUsers({
    filters: {
      query: userQueryParams.query,
    },
    pagination: {
      offset: userQueryParams.offset,
      limit: 10,
    },
    hasRoleId: userQueryParams.hasRoleId,
  });
  const { handleDeleteRole } = useDeleteRole();
  const { hanldeAssignUsersToRole, loading: adding } = useAssignUsersToRole();

  const userListColumn = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'TÊN NHÂN VIÊN',
      dataIndex: 'fullname',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
    },
    {
      title: 'VAI TRÒ HIỆN TẠI',
      dataIndex: 'role',
      render: (_, record) => {
        return (
          <div>
            {record?.roles?.slice(0, 2)?.map(({ name }) => (
              <span className="role-tag">{name}</span>
            ))}
          </div>
        );
      },
    },
  ];

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
    },
    {
      title: 'MÃ VAI TRÒ',
      dataIndex: 'code',
      render: (_, record) =>
        canUpdate ? (
          <Link to={`/role/detail/${record?.id}`}>
            <a className="role-code">{record?.code}</a>
          </Link>
        ) : (
          <b>{record?.code}</b>
        ),
    },
    {
      title: 'TÊN VAI TRÒ',
      dataIndex: 'name',
    },
    {
      title: 'MÔ TẢ',
      dataIndex: 'description',
    },
    {
      title: 'HÀNH ĐỘNG',
      dataIndex: 'actions',
      align: 'center',
      render: (_, record) => {
        return (
          <div className="actions">
            {canAssignRole && (
              <CustomModal
                title={<span className="user-list-title">Chọn người dùng vào vai trò</span>}
                footer={false}
                customComponent={<a>Chọn người dùng</a>}
                okeButtonLabel="Lưu lại"
                width={'fit-content'}
                onOke={() => assignUsersToRole(record?.id)}
                isBlockCloseOnOke={true}
                switchClose={switchClose}
                onOpen={() => getUserListByRoleId(record.id)}
                onCancel={cancelAssignUser}
              >
                <div className="user-list">
                  <Input
                    allowClear={true}
                    prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
                    placeholder="Tìm kiếm mã/ tên nhân viên"
                    onChange={(e) => filterUserByTextDebounced(e.target.value)}
                    className="search-user-input"
                  />
                  <CustomTable
                    loading={userTableLoading}
                    rowKey={'id'}
                    columns={userListColumn}
                    dataSource={users}
                    scroll={{ x: true, y: null }}
                    rowSelection={rowSelection}
                    pagination={{
                      total: totalUser,
                      pageSize: userQueryParams.limit,
                      current: userQueryParams.offset / userQueryParams.limit + 1,
                      showSizeChanger: false,
                    }}
                    onChange={onUserTableChange}
                  />
                </div>
              </CustomModal>
            )}

            {canCreate && (
              <CustomModal
                title={<span className="user-list-title">Nhân bản vai trò</span>}
                message="Bạn có chắc muốn nhân bản vai trò này không?"
                footer={false}
                centered={true}
                customComponent={<a className="coppy-role">Nhân bản</a>}
                onOke={() => cloneRole(record)}
              />
            )}

            {canDelete && (
              <CustomModal
                icon={<Icon.CustomIcon icon={Icon.faTrash} />}
                message="Bạn có chắc muốn xóa vai trò này không?"
                footer={false}
                centered={true}
                customComponent={<a className="delete-action">Xóa</a>}
                onOke={() => deleteRole(record.id)}
              />
            )}
          </div>
        );
      },
    },
  ];

  function cancelAssignUser() {
    let initIds = users?.filter((item) => item.hasRole)?.map(({ id }) => id);
    setSelectedRowKeys(initIds);
  }

  function getUserListByRoleId(roleId) {
    setUserQueryParams({
      ...userQueryParams,
      hasRoleId: roleId,
    });
    refetchUsers();
  }

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

  function onUserTableChange(pagination, filters, sorter) {
    console.log({ pagination, filters, sorter });
    const { current, pageSize } = pagination;

    let newParams = {
      ...userQueryParams,
      offset: (current - 1) * pageSize,
    };
    setUserQueryParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  //Filter role by text
  const filterRoleByTextDebounced = debounce(filterRoleByText);

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

  async function assignUsersToRole(roleId) {
    if (!selectedRowKeys || !selectedRowKeys.length) {
      notify.warning({
        message: 'Vui lòng chọn người dùng !',
      });
      return;
    }

    try {
      await hanldeAssignUsersToRole({
        roleID: roleId,
        addUserIDs: selectedRowKeys || [],
        removedUserIDs: getRemovedUserIds(selectedRowKeys, initUserIds) || [],
      });
      notify.success({
        message: 'Thêm người dùng vào vai trò thành công !',
      });
      setSelectedRowKeys([]);
      setSwitchClose(!switchClose);
    } catch (err) {
      notify.error({
        message: 'Thêm người dùng vào vai trò thất bại!',
      });
    }
  }

  function getRemovedUserIds(seletedUserIds, initUserIds) {
    return initUserIds?.filter((item) => !seletedUserIds?.includes(item));
  }

  //Filter user by text
  const filterUserByTextDebounced = debounce(filterUserByText);

  function filterUserByText([text]) {
    if (text[0] === ' ') {
      return;
    }
    setUserQueryParams({
      ...userQueryParams,
      query: text,
      offset: 0,
    });
  }

  //Delete role by id
  async function deleteRole(roleID) {
    try {
      await handleDeleteRole({
        roleID,
      });
      notify.success({
        message: 'Xóa vai trò thành công !',
      });
      refetchRoles();
    } catch (err) {
      console.log({ err });
      notify.error({
        message: 'Xóa vai trò thất bại !',
        description: err?.message,
      });
    }
  }

  async function cloneRole({ id }) {
    history.push({
      pathname: '/role/create',
      clonedRoledId: id,
    });
  }

  useEffect(() => {
    refetchRoles();
  }, []);

  useEffect(() => {
    let initIds = users?.filter((item) => item.hasRole)?.map(({ id }) => id);
    setSelectedRowKeys(initIds);
    setInitUserIds(initIds);
    refetchUsers();
  }, [users]);

  return (
    <div className="role-container">
      <div className="filter-box">
        <div className="search-input">
          <Input
            allowClear={true}
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder="Tìm kiếm mã/ tên vai trò"
            onChange={(e) => filterRoleByTextDebounced(e.target.value)}
            defaultValue={getQuery()?.query || ''}
          />
        </div>

        {canCreate && (
          <Link to="/role/create">
            <Button className="create-btn custom-button" type="primary">
              Thêm vai trò
            </Button>
          </Link>
        )}
      </div>

      <CustomTable
        rowKey={'id'}
        loading={loading}
        columns={columns}
        dataSource={roles || []}
        scroll={{ x: 800, y: null }}
        pagination={{
          total,
          pageSize: params.limit,
          current: params.offset / params.limit + 1,
          showSizeChanger: false,
        }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default RoleList;
