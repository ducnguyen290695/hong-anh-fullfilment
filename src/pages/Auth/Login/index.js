import { Button, Checkbox, Form, Spin } from 'antd';
import FormInput from 'components/FormInput';
import { useAuthToken } from 'hooks/auth/auth';
import { INPUT_TYPE } from 'config/constants';
import { useLogin } from 'hooks/auth/login';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { notify } from 'utils/helperFuncs';
import './index.scss';

const Login = () => {
  const history = useHistory();
  const { setAuthToken } = useAuthToken();
  const { handleLogin, loading } = useLogin();

  const formFields = [
    {
      formItemOptions: {
        label: 'Email',
        name: 'email',
        rules: [{ required: true, message: 'Vui lòng nhập email !' }],
      },
      inputOptions: {
        placeholder: 'Nhập địa chỉ email của bạn',
        autoFocus: true,
      },
    },
    {
      type: INPUT_TYPE.PASSWORD,
      formItemOptions: {
        label: 'Mật khẩu',
        name: 'password',
        rules: [{ required: true, message: 'Vui lòng nhập mật khẩu !' }],
      },
      inputOptions: {
        placeholder: 'Nhập mật khẩu',
      },
    },
  ];

  async function login(values) {
    try {
      const { accessToken } = await handleLogin(values);
      setAuthToken(accessToken);
      notify.success({
        message: 'Đăng nhập thành công !',
      });
      history.push('/product');
    } catch (err) {
      notify.error({
        message: 'Đăng nhập thất bại !',
        description: err?.message,
      });
    }
  }

  return (
    <div className="container">
      <div className="left-col"></div>
      <div className="right-col">
        <Spin spinning={loading}>
          <div className="form">
            <div className="logo"></div>
            <p className="greeting">Xin chào!</p>
            <p className="form-tile">Đăng nhập tài khoản</p>
            <Form layout="vertical" onFinish={(values) => login(values)}>
              {formFields.map((field, index) => {
                return <FormInput key={index} {...field} />;
              })}

              <div className="forgot-password">
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                <Link to="/forgot-password">
                  <a>Quên mật khẩu</a>
                </Link>
              </div>

              <Form.Item>
                <Button className="submit-btn" type="primary" htmlType="submit">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default Login;
