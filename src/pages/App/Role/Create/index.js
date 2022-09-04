import React, { useEffect, useState } from 'react';
import { Button, Form } from 'antd';
import FormInput from 'components/FormInput';
import { FORM_LAYOUT } from 'config/constants';
import TreeCheckbox from './components/TreeCheckbox';
import { Link } from 'react-router-dom';
import { useCreateRole, useGetRoleDetail, useUpdateRole } from 'hooks/role';
import { notify } from 'utils/helperFuncs';
import { useHistory } from 'react-router-dom';
import { useGetPermissions } from 'hooks/permission';
import { useParams } from 'react-router-dom';
import PageHeader from 'components/PageHeader';
import './index.scss';
import 'styles/custom_component.scss';

// todo move to constant
const PATH_ROLE_LIST = {
  pathname: '/account',
  state: {
    tab: 'role-list',
  },
};

const CreateRole = ({ isDetail }) => {
  const [convertedPermissions, setConvertedPermissions] = useState([]);
  const [form] = Form.useForm();
  const [permissionIds, setPermissionIds] = useState([]);
  const history = useHistory();
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState([]);

  const { id } = useParams();
  const { loading, handleCreateRole } = useCreateRole();
  const { handleUpdateRole } = useUpdateRole();
  const { permissions } = useGetPermissions();
  const { roleDetail } = useGetRoleDetail({
    id: history.location.clonedRoledId || id,
  });

  function convertPermissions(permissions) {
    let convertedPermissions = [];
    if (permissions?.length) {
      permissions?.forEach((item) => {
        if (item?.level === 1) {
          convertedPermissions.push({
            ...item,
            level2s: [],
          });
        }
      });

      for (let item of convertedPermissions) {
        for (let child of permissions) {
          if (item?.id === child?.parentId) {
            item?.level2s?.push({
              ...child,
              level3s: [],
            });
          }
        }
      }

      for (let item of convertedPermissions) {
        for (let level2 of item?.level2s) {
          for (let permission of permissions) {
            if (permission?.parentId === level2?.id) {
              level2?.level3s?.push(permission);
            }
          }
        }
      }
    }
    return convertedPermissions;
  }

  function getPermissionIds(ids, index) {
    setPermissionIds([
      ...permissionIds?.slice(0, index),
      ids,
      ...permissionIds?.slice(index + 1, permissionIds?.length),
    ]);
  }

  async function createRole(values) {
    let permissionIdsUniq = uniqPermissionIds(permissionIds);

    if (permissionIdsUniq && !permissionIdsUniq.length) {
      notify.warning({
        message: 'Vui lòng chọn quyền !',
      });
      return;
    }
    try {
      await handleCreateRole({
        role: {
          ...values,
          permissions: permissionIdsUniq,
        },
      });
      notify.success({
        message: 'Tạo vài trò thành công !',
      });

      history.push(PATH_ROLE_LIST);
    } catch (err) {
      notify.error({
        message: 'Tạo vai trò thất bại !',
        description: err?.message,
      });
    }
  }

  function uniqPermissionIds(ids) {
    return [...new Set(ids.flat())];
  }

  async function updateRole(values) {
    const { code, name, description } = values;
    let permissionIdsUniq = uniqPermissionIds(permissionIds);

    if (permissionIdsUniq && !permissionIdsUniq.length) {
      notify.warning({
        message: 'Vui lòng chọn quyền !',
      });
      return;
    }
    try {
      await handleUpdateRole({
        id,
        role: {
          code,
          name,
          description,
          permissions: permissionIdsUniq,
        },
      });
      notify.success({
        message: 'Cập nhật vai trò thành công !',
      });
      history.push(PATH_ROLE_LIST);
    } catch (err) {
      notify.error({
        message: 'Cập nhật vai trò thất bại !',
        description: err?.message,
      });
    }
  }

  function initForm(role) {
    form.setFieldsValue({
      ...role,
    });
  }

  function getDefaultCheckGroup(permisisons) {
    let result = permisisons?.map((item) => []);
    permisisons?.forEach((item, index) => {
      if (item.isChecked) {
        result[index]?.push(item.id);
      }

      for (let level2 of item?.level2s) {
        if (level2.isChecked) {
          result[index]?.push(level2.id);
        }

        for (let level3 of item?.level3s || []) {
          if (level3.isChecked) {
            result[index]?.push(level3.id);
          }
        }
      }
    });
    return result;
  }

  useEffect(() => {
    setConvertedPermissions(convertPermissions(permissions));
  }, [permissions]);

  useEffect(() => {
    let defaultCheckedGroup = getDefaultCheckGroup(convertPermissions(roleDetail?.fullPermissions));
    let defaultCheckedIds = roleDetail?.fullPermissions
      ?.filter((item) => item?.isChecked)
      ?.map(({ id }) => id);
    initForm(roleDetail);
    setDefaultCheckedKeys(defaultCheckedIds);
    setPermissionIds(defaultCheckedGroup);
  }, [roleDetail]);

  return (
    <div className="create-role-container">
      <PageHeader
        pageTitle={isDetail ? 'Cập nhật vai trò nhân viên' : 'Thêm mới vai trò nhân viên'}
        routes={[
          {
            path: '/setting',
            name: 'Cài đặt hệ thống',
          },
          {
            path: '/account',
            name: 'Quản lý vai trò nhân viên',
          },
          {
            path: '',
            name: isDetail ? 'Cập nhật vai trò nhân viên' : 'Thêm mới vai trò nhân viên',
          },
        ]}
      />

      <div className="role-content">
        <Form form={form} {...FORM_LAYOUT} onFinish={isDetail ? updateRole : createRole}>
          <div className="form">
            <div className="button-group">
              <Link
                to={{
                  pathname: '/account',
                  state: {
                    tab: 'role-list',
                  },
                }}
              >
                <Button className="custom-button cancel-btn">Hủy bỏ</Button>
              </Link>

              <Button loading={loading} htmlType="submit" className="custom-button" type="primary">
                Lưu lại
              </Button>
            </div>

            <div className="form-content">
              <FormInput
                formItemOptions={{
                  label: 'Mã vai trò',
                  name: 'code',
                  rules: [{ required: true, message: 'Vui lòng nhập mã vai trò!' }],
                }}
                inputOptions={{
                  placeHolder: 'Nhập mã vai trò',
                  onChange: (e) =>
                    form.setFieldsValue({
                      code: e.target.value.toUpperCase(),
                    }),
                }}
              />

              <FormInput
                formItemOptions={{
                  label: 'Tên vai trò',
                  name: 'name',
                  rules: [{ required: true, message: 'Vui lòng nhập tên vai trò!' }],
                }}
                inputOptions={{
                  placeHolder: 'Nhập tên vai trò',
                }}
              />

              <div className="description-input">
                <FormInput
                  formItemOptions={{
                    label: 'Mô tả',
                    name: 'description',
                  }}
                  inputOptions={{
                    placeHolder: 'Nhập mô tả',
                  }}
                />
              </div>
            </div>
          </div>
        </Form>

        <div className="permission-list">
          {convertedPermissions?.map((item, index) => (
            <div key={index} className="permission-box">
              <TreeCheckbox
                treeData={[item]?.map((item) => ({
                  title: item?.name,
                  key: item?.id,
                  children: item?.level2s?.map((level2) => ({
                    title: level2?.name,
                    key: level2?.id,
                    children: level2?.level3s?.map((level3) => ({
                      title: level3?.name,
                      key: level3?.id,
                    })),
                  })),
                }))}
                defaultCheckedKeys={defaultCheckedKeys}
                onChange={(ids) => getPermissionIds(ids, index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
