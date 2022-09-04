import React, { useEffect, useState } from 'react';
import { Button, Form, Upload } from 'antd';
import FormInput from 'components/FormInput';
import PageHeader from 'components/PageHeader';
import { FORM_LAYOUT, FORM_TYPE, INPUT_TYPE, ACCEPT_IMG_TYPES } from 'config/constants';
import { Link, useHistory, useParams } from 'react-router-dom';
import { notify, passwordGenerator, validator, dummyRequest, readFile } from 'utils/helperFuncs';
import Img from 'assets/images';
import { useUpload } from 'hooks/upload';
import { useCities, useDistricts, useWards } from 'hooks/common';
import { useCreateUser, useGetUser, useStaffPermissions, useUpdateUser } from 'hooks/user/user';
import { useGetRoles } from 'hooks/role';
import { useDepartments } from 'hooks/department/department';
import './index.scss';
import { omit } from 'utils/object';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';

const ACCOUNT_LIST_PATH = '/account';
const MEDIUM_INPUT_LENGTH = 255; // todo move to constant

export const CreateAccountForm = ({ type = FORM_TYPE.CREATE }) => {
  const [avatar, setAvatar] = useState({
    base64String: '',
    src: '',
  });
  const [location, setLocation] = useState({
    cityId: null,
    districtId: null,
  });
  const [uploading, setUploading] = useState(false);

  const [form] = Form.useForm();

  const { handleUpload } = useUpload();
  const history = useHistory();

  const { cities } = useCities([1, 2]);
  const { districts, refetch: refetchDistricts } = useDistricts(location?.cityId);
  const { wards, refetch: refetchWards } = useWards(location?.districtId);
  const { roles } = useGetRoles({
    offset: 0,
    query: null,
  });

  const { handleCreateUser } = useCreateUser();
  const { handleUpdateUser } = useUpdateUser();

  const { departments } = useDepartments({
    filters: null,
    pagination: {
      offset: null,
      limit: 0,
    },
  });

  const { id } = useParams();
  const { user } = useGetUser({ id });
  const password = type === FORM_TYPE.CREATE ? passwordGenerator(8) : '********';
  const formFields = [
    {
      formItemOptions: {
        label: 'Họ tên',
        name: 'fullname',
        rules: [{ required: true, message: 'Vui lòng nhập họ tên !' }],
      },
      inputOptions: {
        placeholder: 'Nhập họ tên đầy đủ, tối đa 50 ký tự',
        maxLength: 50,
      },
    },
    {
      formItemOptions: {
        label: 'Email',
        name: 'email',
        rules: [
          { required: true, message: 'Vui lòng nhập email !' },
          validator({
            type: 'email',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập địa chỉ email để đăng nhập',
      },
    },
    {
      formItemOptions: {
        label: 'Số điện thoại',
        name: 'telephone',
        rules: [
          { required: false, message: 'Vui lòng nhập số điện thoại!' },
          validator({
            type: 'phone',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập tối đa 10 chữ số, bắt đầu bằng 0',
        maxLength: 10,
      },
    },
    {
      formItemOptions: {
        label: 'Mật khẩu',
        name: 'raw_password',
        initialValue: password,
        rules: [
          { required: false, message: 'Vui lòng nhập mật khẩu !' },
          type === FORM_TYPE.CREATE &&
            validator({
              type: 'password',
            }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập mật khẩu',
        maxLength: 50,
        disabled: type === FORM_TYPE.DETAIL,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Tỉnh/Thành',
        name: 'cityID',
      },
      inputOptions: {
        placeholder: 'Vui lòng chọn Tỉnh/Thành',
        options: cities?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
        onChange: handleChangeCity,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Quận/Huyện',
        name: 'districtID',
      },
      inputOptions: {
        placeholder: 'Vui lòng chọn Quận/Huyện',
        options: districts?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
        onChange: handleChangeDistrict,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Phường/Xã',
        name: 'wardID',
      },
      inputOptions: {
        placeholder: 'Vui lòng chọn Phường/Xã',
        options: wards?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      },
    },
    {
      type: INPUT_TYPE.TEXT_AREA,
      formItemOptions: {
        label: 'Địa chỉ',
        name: 'address',
        className: 'address',
      },
      inputOptions: {
        placeholder: `Nhập địa chỉ, tối đa ${MEDIUM_INPUT_LENGTH} ký tự`,
        maxLength: MEDIUM_INPUT_LENGTH,
        showCount: true,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Phòng ban',
        name: 'departmentID',
        rules: [{ required: true, message: 'Vui lòng nhập địa chỉ !' }],
      },
      inputOptions: {
        placeholder: 'Chọn phòng ban',
        options: departments?.map((item) => ({
          label: item?.name,
          value: item?.id,
        })),
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Vai trò',
        name: 'roleIDs',
        rules: [{ required: true, message: 'Vui lòng chọn vai trò !' }],
      },
      inputOptions: {
        placeholder: 'Chọn vai trò',
        mode: 'multiple',
        options: roles?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      },
    },
  ];

  function handleChangeCity(cityId) {
    form.setFieldsValue({
      districtID: null,
      wardID: null,
    });
    setLocation({
      ...location,
      cityId,
      districtId: null,
    });
  }

  function handleChangeDistrict(districtId) {
    form.setFieldsValue({
      wardID: null,
    });
    setLocation({
      ...location,
      districtId,
    });
  }

  function onUploadChange(info) {
    if (info.file.status === 'uploading') {
      setUploading(true);
    }
    if (info.file.status === 'done') {
      if (!ACCEPT_IMG_TYPES.includes(info?.file?.type)) {
        notify.error({
          message: 'Chỉ chấp nhận định dạng PNG, JPG, JPEG !',
        });
        setUploading(false);
        return;
      }
      setUploading(false);
      readFile({
        getResult: async (result) => {
          const uploadUrl = await handleUpload({ file: info?.file?.originFileObj });
          setAvatar({
            base64String: result,
            src: uploadUrl,
          });
        },
        type: 'Base64String',
        file: info?.file?.originFileObj,
      });
    } else if (info.file.status === 'error') {
    }
  }

  async function createUser(values) {
    try {
      await handleCreateUser({
        request: {
          avatarURL: avatar?.src,
          ...values,
        },
      });
      notify.success({
        message: 'Tạo tài khoản thành công !',
      });
      history.push({
        pathname: ACCOUNT_LIST_PATH,
      });
    } catch (err) {
      notify.error({
        message: 'Tạo tài khoản thất bại !',
        description: err.message,
      });
    }
  }

  function initForm() {
    form.setFieldsValue({
      ...(user || {}),
      roleIDs: user?.roles?.map(({ id }) => id),
    });
  }

  async function updateUser(values) {
    try {
      // does not support update password
      values = omit(values, 'raw_password');
      await handleUpdateUser({
        request: {
          id,
          avatarURL: avatar.src,
          ...values,
        },
      });
      notify.success({
        message: 'Cập nhật tài khoản thành công !',
      });
      history.push({
        pathname: ACCOUNT_LIST_PATH,
      });
    } catch (err) {
      notify.error({
        message: 'Cập nhật tài khoản thất bại !',
        description: err.message,
      });
    }
  }

  useEffect(() => {
    type === FORM_TYPE.DETAIL && initForm();
    setLocation({
      cityId: user?.cityID,
      districtId: user?.districtID,
    });
    // set avatar url
    setAvatar({
      src: user?.avatarURL,
    });
  }, [user]);

  useEffect(() => {
    if (location?.cityId) {
      refetchDistricts(location?.cityId);
    }
    if (location?.districtId) {
      refetchWards(location?.districtId);
    }
  }, [location]);

  return (
    <div className="create-account-container">
      <PageHeader
        pageTitle={type === FORM_TYPE.DETAIL ? 'Thông tin tài khoản' : 'Tạo tài khoản'}
        routes={[
          {
            path: '/setting',
            name: 'Cài đặt hệ thống',
          },
          {
            path: '/account',
            name: 'Quản lý tài khoản',
          },
          {
            path: '',
            name: type === FORM_TYPE.DETAIL ? 'Thông tin tài khoản' : 'Tạo tài khoản',
          },
        ]}
      />

      <Form
        onFinish={type === FORM_TYPE.DETAIL ? updateUser : createUser}
        form={form}
        {...FORM_LAYOUT}
      >
        <div className="button-group">
          <Link
            to={{
              pathname: '/account',
              state: {
                tab: 'account-list',
              },
            }}
          >
            <Button className="cancel-btn custom-button">Hủy bỏ</Button>
          </Link>
          <Form.Item>
            <Button
              // loading={userCreating || false}
              className="custom-button"
              type="primary"
              htmlType="submit"
            >
              Lưu lại
            </Button>
          </Form.Item>
        </div>

        <div className="form-content">
          <div className="avatar-upload">
            <p className="title">Ảnh đại diện</p>
            <div className="avatar">
              <img src={avatar?.base64String || avatar?.src || Img.AvatarPlaceHolder} />
            </div>

            <div className="upload">
              <Upload
                showUploadList={false}
                onChange={onUploadChange}
                customRequest={({ file, onSuccess }) => dummyRequest(file, onSuccess)}
              >
                <Button loading={uploading} className="upload-btn">
                  Tải ảnh lên
                </Button>
              </Upload>
              <p>Chọn ảnh tối đa 5 Mb, định dạng PNG, JPG, JPEG</p>
            </div>
          </div>

          <div className="common-info">
            {formFields.map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}
          </div>
        </div>
      </Form>
    </div>
  );
};

const CreateAccount = () => {
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { canCreate } = useStaffPermissions();

  return loadUserPermissions ? (
    <Spinner loading={loadUserPermissions} />
  ) : canCreate ? (
    <CreateAccountForm type={FORM_TYPE.CREATE} />
  ) : (
    <Page403 />
  );
};

export default CreateAccount;
