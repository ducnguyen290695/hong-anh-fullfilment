import { Button, Form, Spin } from 'antd';
import FormInput from 'components/FormInput';
import PageHeader from 'components/PageHeader';
import Spinner from 'components/Spinner';
import { FORM_LAYOUT, FORM_TYPE, INPUT_TYPE } from 'config/constants';
import {
  useCreateDepartment,
  useDepartmentPermissions,
  useGetDepartment,
  useUpdateDepartment,
} from 'hooks/department/department';
import { useGetUserPermissions } from 'hooks/user/user';
import Page403 from 'pages/PageError/403';
import React from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { notify } from 'utils/helperFuncs';
import './index.scss';

export const CreateDepartmentForm = ({ department, type }) => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();

  const { loading, data: departmentData, refetch } = useGetDepartment({ departmentID: id });

  const { handleCreateDepartment, loading: createLoading } = useCreateDepartment();

  const { handleUpdateDepartment, loading: updateLoading } = useUpdateDepartment();

  const formFields = [
    {
      formItemOptions: {
        label: 'Mã phòng ban',
        name: 'code',
        rules: [{ required: true, message: 'Vui lòng nhập mã phòng ban !' }],
        initialValue: department?.name,
      },
      inputOptions: {
        placeholder: 'Nhập mã phòng ban, tối đa 50 ký tự',
        onChange: (e) =>
          form.setFieldsValue({
            code: e.target.value.toUpperCase(),
          }),
      },
    },
    {
      formItemOptions: {
        label: 'Tên phòng ban',
        name: 'name',
        rules: [{ required: true, message: 'Vui lòng nhập tên phòng !' }],
        initialValue: department?.email,
      },
      inputOptions: {
        placeholder: 'Nhập tên phòng ban, tối đa 50 ký tự',
      },
    },
    {
      type: INPUT_TYPE.TEXT_AREA,
      formItemOptions: {
        label: 'Mô tả phòng ban',
        name: 'description',
        className: 'description',
      },
      inputOptions: {
        placeholder: 'Nhập mô tả, tối đa 500 ký tự',
      },
    },
  ];

  function resetForm() {
    form.resetFields();
  }

  const createDepartment = async (values) => {
    try {
      await handleCreateDepartment(values);
      notify.success({
        message: 'Tạo phòng ban thành công !',
      });
      resetForm();
      history.push('/department');
    } catch (err) {
      notify.error({
        message: 'Tạo phòng ban thất bại !',
        description: err?.message,
      });
    }
  };

  const updateDepartment = async (values) => {
    try {
      await handleUpdateDepartment(id, values);
      notify.success({
        message: 'Cập nhật phòng ban thành công !',
      });
      await refetch({
        departmentID: id,
      });
      history.push('/department');
    } catch (e) {
      notify.error({
        message: 'Cập nhật phòng ban thất bại !',
      });
    }
  };

  function initForm(department) {
    form.setFieldsValue({
      ...department,
    });
  }

  if (departmentData) {
    initForm(departmentData);
  }

  return (
    <div className="create-department-container">
      <Spin spinning={loading || createLoading || updateLoading}>
        <PageHeader
          pageTitle={type === FORM_TYPE.DETAIL ? 'Thông tin phòng ban' : 'Tạo phòng ban'}
          routes={[
            {
              path: '/setting',
              name: 'Cài đặt hệ thống',
            },
            {
              path: '/department',
              name: 'Quản lý phòng ban',
            },
            {
              path: '',
              name: type === FORM_TYPE.DETAIL ? 'Thông tin phòng ban' : 'Tạo phòng ban',
            },
          ]}
        />

        <Form
          form={form}
          onFinish={type === FORM_TYPE.DETAIL ? updateDepartment : createDepartment}
          {...FORM_LAYOUT}
        >
          <div className="button-group">
            <Link to="/department">
              <Button className="cancel-btn custom-button">Hủy bỏ</Button>
            </Link>
            <Form.Item>
              <Button
                loading={createLoading || updateLoading}
                className="custom-button"
                type="primary"
                htmlType="submit"
              >
                Lưu lại
              </Button>
            </Form.Item>
          </div>

          <div className="common">
            <div className="left-col">
              <p className="title">THÔNG TIN CHUNG</p>
              <p className="description">Thông tin chung về phòng ban</p>
            </div>

            <div className="right-col">
              {formFields.slice(0, 3).map((field, index) => {
                return <FormInput key={index} {...field} />;
              })}
            </div>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

const CreateDepartment = () => {
  const { canCreate: canCreateDepartment } = useDepartmentPermissions();
  const { loading: loadUserPermissions } = useGetUserPermissions();

  return loadUserPermissions ? (
    <Spinner loading={loadUserPermissions} />
  ) : canCreateDepartment ? (
    <CreateDepartmentForm type={FORM_TYPE.CREATE} />
  ) : (
    <Page403 />
  );
};

export default CreateDepartment;
