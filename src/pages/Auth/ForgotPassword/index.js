import { Button, Form } from 'antd';
import FormInput from 'components/FormInput';
import { useRequestForgetPassword } from 'hooks/auth/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { notify, validator } from 'utils/helperFuncs';
import './index.scss';

const ForgotPassword = () => {
  const [showMessage, setShowMessage] = useState(false);
  const { loading, handleRequestForgetPassword } = useRequestForgetPassword();

  const formFields = [
    {
      formItemOptions: {
        label: 'Email',
        name: 'email',
        rules: [{ required: true, message: 'Vui lòng nhập email !' }, validator({ type: 'email' })],
      },
      inputOptions: {
        placeholder: 'Nhập địa chỉ email của bạn',
      },
    },
  ];

  async function requestEmailChangePassword(values) {
    const { email } = values;
    const params = {
      email,
      prefixURL: `${window?.location?.host}/new-password`,
    };
    try {
      await handleRequestForgetPassword(params);
      setShowMessage(true);
      notify.success({
        message: 'Gửi thành công !',
      });
    } catch (e) {
      notify.error({
        message: 'Gửi thất bại !',
        description: 'Email không tồn tại hoặc tài khoản đã bị khóa !',
      });
    }
  }

  return (
    <div className="forgot-container">
      <div className="left-col"></div>
      <div className="right-col">
        <div className="form">
          <div className="logo"></div>
          <Link to="/login">
            <a className="back">{'< Quay lại'}</a>
          </Link>
          <p className="form-tile">Quên mật khẩu</p>
          <p className="notify">Vui lòng nhập email để nhận đường link xác thực</p>
          <Form layout="vertical" onFinish={requestEmailChangePassword}>
            {formFields.map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}

            <Form.Item>
              <Button
                disabled={showMessage}
                loading={loading}
                className="submit-btn"
                type="primary"
                htmlType="submit"
              >
                Lấy lại mật khẩu
              </Button>
            </Form.Item>

            {showMessage && (
              <React.Fragment>
                <p className="confirm-notify">
                  Link xác nhận đã được gửi tới email của bạn.
                  <br /> Vui lòng kiểm tra email (bao gồm cả hòm thư spam).
                </p>

                <p className="confirm-notify">
                  Bạn không nhận được email xác thực?{' '}
                  <Form.Item>
                    <button className="try-btn" disabled={loading} htmlType="submit">
                      Gửi lại ngay
                    </button>
                  </Form.Item>
                </p>
              </React.Fragment>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
