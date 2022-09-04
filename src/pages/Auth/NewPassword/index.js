import { Button, Form } from 'antd';
import FormInput from 'components/FormInput';
import { INPUT_TYPE } from 'config/constants';
import { useChangePassword, useConfirmForgetPassword, useLogout } from 'hooks/auth/auth';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getQuery, notify, validator } from 'utils/helperFuncs';
import './index.scss';

const NewPassword = (props) => {
  const history = useHistory();
  const { loading, handleChangePassword } = useChangePassword();
  const { loading: confirmLoading, handleConfirmForgetPassword } = useConfirmForgetPassword();
  const { logout } = useLogout();

  const formFields = [
    {
      type: INPUT_TYPE.PASSWORD,
      formItemOptions: {
        label: 'Mật khẩu mới',
        name: 'newRawPassword',
        rules: [
          { required: true, message: 'Vui lòng nhập mật khẩu mới !' },
          validator({ type: 'password' }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập mật khẩu mới',
        autoFocus: true,
      },
    },

    {
      type: INPUT_TYPE.PASSWORD,
      formItemOptions: {
        label: 'Xác nhận mật khẩu',
        name: 'confirmPassword',
        rules: [
          { required: true, message: 'Vui lòng nhập lại mật khẩu mới !' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newRawPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu không trùng khớp !'));
            },
          }),
          validator({ type: 'password' }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập lại mật khẩu mới',
      },
    },
  ];

  const changePassword = async (values) => {
    try {
      const { newRawPassword } = values;
      const oldPassword = props?.location?.state?.oldRawPassword;
      await handleChangePassword({ oldPassword: oldPassword, newPassword: newRawPassword });
      notify.success({
        message: 'Đổi mật khẩu thành công !',
      });
      await logout();
      history.push({
        pathname: '/login',
      });
    } catch (e) {
      notify.error({
        message: 'Đổi mật khẩu thất bại !',
      });
    }
  };

  const changeForgetPassword = async (values) => {
    const { newRawPassword } = values;
    try {
      const params = {
        newPassword: newRawPassword,
        secretToken: getQuery().secret,
      };
      await handleConfirmForgetPassword(params);
      notify.success({
        message: 'Đổi mật khẩu thành công !',
      });
      history.push({
        pathname: '/login',
      });
    } catch (err) {
      notify.error({
        message: 'Đổi mật khẩu thất bại !',
      });
    }
  };

  return (
    <div className="new-container">
      <div className="left-col"></div>
      <div className="right-col">
        <div className="form">
          <div className="logo"></div>
          <Link
            to={{
              pathname: '/change-password',
              state: {
                oldRawPassword: props?.location?.state?.oldRawPassword,
              },
            }}
          >
            <a className="back">{'< Quay lại'}</a>
          </Link>
          <p className="form-tile">Thay đổi mật khẩu</p>
          <p className="notify">Vui lòng nhập mật khẩu mới bao gồm:</p>
          <ul className="password-rule">
            <li>Chữ hoa, chữ thường, số và ký tự đặc biệt</li>
            <li>Tối thiểu 8 ký tự</li>
          </ul>
          <Form
            onFinish={getQuery().secret ? changeForgetPassword : changePassword}
            layout="vertical"
          >
            {formFields.map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}

            <Form.Item>
              <Button
                className="submit-btn"
                type="primary"
                htmlType="submit"
                loading={loading || confirmLoading}
              >
                Thay đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
