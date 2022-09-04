import React, { useEffect } from 'react';
import { Button, Form } from 'antd';
import FormInput from 'components/FormInput';
import { INPUT_TYPE } from 'config/constants';
import { useHistory } from 'react-router-dom';
import './index.scss';

const ChangePassword = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const formFields = [
    {
      type: INPUT_TYPE.PASSWORD,
      formItemOptions: {
        label: 'Mật khẩu cũ',
        name: 'oldRawPassword',
        rules: [{ required: true, message: 'Vui lòng nhập mật khẩu cũ !' }],
        initialValue: props.location?.state?.oldRawPassword,
      },
      inputOptions: {
        placeholder: 'Nhập mật khẩu cũ',
        autoFocus: true,
      },
    },
  ];

  function submitOldPassword(values) {
    const { oldRawPassword } = values;
    console.log({ values });
    history.push({
      pathname: '/new-password',
      state: {
        oldRawPassword,
      },
    });
  }

  function initForm() {
    form.setFieldsValue({
      oldRawPassword: props.location?.state?.oldRawPassword,
    });
  }

  function back() {
    history.push('/login');
  }

  useEffect(() => {
    initForm();
  }, []);

  return (
    <div className="change-container">
      <div className="left-col"></div>
      <div className="right-col">
        <div className="form">
          <div className="logo"></div>

          <a className="back" onClick={back}>
            {'< Quay lại'}
          </a>

          <p className="form-tile">Thay đổi mật khẩu</p>

          <Form form={form} layout="vertical" onFinish={(values) => submitOldPassword(values)}>
            {formFields.map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}

            <Form.Item>
              <Button className="submit-btn" type="primary" htmlType="submit">
                Tiếp tục
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
