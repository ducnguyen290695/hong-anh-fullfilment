import { Button, Form, Spin } from 'antd';
import FormInput from 'components/FormInput';
import PageHeader from 'components/PageHeader';
import { FORM_LAYOUT, FORM_TYPE, INPUT_TYPE } from 'config/constants';
import { useGetCategory } from 'hooks/category/category';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './index.scss';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';
import { useProductPermissions } from 'hooks/product/product';

const CreateProductGroup = ({ type }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { loading, data } = useGetCategory({ id });
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { canViewProduct } = useProductPermissions();

  if (data) {
    initForm(data);
  }
  const formFields = [
    {
      formItemOptions: {
        label: 'Mã loại sản phẩm',
        name: 'code',
        rules: [{ required: true, message: 'Vui lòng nhập mã loại sản phẩm !' }],
      },
      inputOptions: {
        placeholder: 'Nhập mã loại sản phẩm',
      },
    },
    {
      formItemOptions: {
        label: 'Tên loại sản phẩm',
        name: 'name',
        rules: [{ required: true, message: 'Vui lòng nhập tên loại sản phẩm !' }],
      },
      inputOptions: {
        placeholder: 'Nhập tên loại sản phẩm',
      },
    },

    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Loại sản phẩm cha',
        name: 'parentName',
        className: 'parent-group',
      },
      inputOptions: {
        placeholder: 'Chọn loại sản phẩm cha',
      },
    },
  ];

  function initForm(productGroup) {
    form.setFieldsValue({
      ...productGroup,
      parentName: productGroup?.parent?.name || null,
    });
  }

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loadUserPermissions} />
      ) : canViewProduct ? (
        <div className="create-product-group-container">
          <PageHeader
            pageTitle={type === FORM_TYPE.DETAIL ? 'Thông tin loại sản phẩm' : 'Thêm loại sản phẩm'}
            routes={[
              {
                path: '/product-group',
                name: 'Loại sản phẩm',
              },
              {
                path: '',
                name: type === FORM_TYPE.DETAIL ? 'Thông tin loại sản phẩm' : 'Thêm loại sản phẩm',
              },
            ]}
          />

          <Spin spinning={loading}>
            <Form {...FORM_LAYOUT} form={form}>
              <div className="button-group">
                <Link to="/product-group">
                  <Button className="cancel-btn custom-button">Hủy bỏ</Button>
                </Link>
                <Form.Item>
                  <Button className="custom-button" type="primary" htmlType="submit">
                    Lưu lại
                  </Button>
                </Form.Item>
              </div>

              <div className="common">
                <div className="left-col">
                  <p className="title">THÔNG TIN CHUNG</p>
                  <p className="description">Các thông tin chung về loại sản phẩm</p>
                </div>

                <div className="right-col">
                  {formFields.slice(0, 5).map((field, index) => {
                    return <FormInput key={index} {...field} />;
                  })}
                </div>
              </div>
            </Form>
          </Spin>
        </div>
      ) : (
        <Page403 />
      )}
    </>
  );
};

export default CreateProductGroup;
