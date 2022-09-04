import { Button, Form, Spin } from 'antd';
import FormInput from 'components/FormInput';
import PageHeader from 'components/PageHeader';
import { FORM_LAYOUT, INPUT_TYPE, REGEX } from 'config/constants';
import { useGetProduct } from 'hooks/product/product';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import UploadImage from './components/UploadImage';
import './index.scss';
import Page403 from 'pages/PageError/403';
import { useGetUserPermissions } from 'hooks/user/user';
import Spinner from 'components/Spinner';
import { useProductPermissions } from 'hooks/product/product';

const ProductDetail = ({ account, type }) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { data, loading } = useGetProduct({ id });
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const { canViewProduct } = useProductPermissions();

  if (data) {
    initForm(data);
  }

  const formFields = [
    {
      formItemOptions: {
        label: 'Mã sản phẩm',
        name: 'code',
        rules: [{ required: true, message: 'Vui lòng nhập mã sản phẩm !' }],
        initialValue: account?.name,
      },
      inputOptions: {
        placeholder: 'Nhập mã sản phẩm',
      },
    },
    {
      formItemOptions: {
        label: 'Tên sản phẩm',
        name: 'name',
        rules: [{ required: true, message: 'Vui lòng nhập tên sản phẩm !' }],
        initialValue: account?.email,
      },
      inputOptions: {
        placeholder: 'Nhập tên sản phẩm',
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Thời gian bảo hành (tháng)',
        name: 'warranty_period',
      },
      inputOptions: {
        placeholder: 'Nhập thời gian bảo hành',
        className: 'number-input',
        min: 0,
        controls: false,
        addonAfter: <span>Tháng</span>,
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Tồn kho tối thiểu',
        name: 'min_inventory',
      },
      inputOptions: {
        placeholder: 'Nhập tồn kho tối thiểu',
        className: 'number-input',
        min: 0,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Phân loại',
        name: 'group',
      },
      inputOptions: {
        placeholder: 'Chọn nhóm sản phẩm',
        options: [
          {
            label: 'SSD',
            value: 'SSD',
          },
          {
            label: 'HDD',
            value: 'HDD',
          },
        ],
      },
    },
    {
      formItemOptions: {
        label: 'Nguồn gốc',
        name: 'origin',
      },
      inputOptions: {
        placeholder: 'Nhập nguồn gốc',
      },
    },
    {
      type: INPUT_TYPE.TEXT_AREA,
      formItemOptions: {
        label: 'Mô tả sản phẩm',
        name: 'description',
        className: 'description-input',
      },
      inputOptions: {
        placeholder: 'Nhập mô tả sản phẩm',
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Giá bán',
        name: 'price',
        rules: [{ required: true, message: 'Vui lòng nhập giá bán !' }],
      },
      inputOptions: {
        placeholder: 'Nhập giá bán',
        className: 'number-input',
        min: 0,
        formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
        parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
        controls: false,
        addonAfter: <span>đ</span>,
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Giá mua gần nhất',
        name: 'latest_price',
        rules: [{ required: true, message: 'Vui lòng nhập giá mua gần nhất !' }],
      },
      inputOptions: {
        placeholder: 'Nhập giá mua gần nhất',
        className: 'number-input',
        min: 0,
        formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
        parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
        controls: false,
        addonAfter: <span>đ</span>,
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Giá mua cố định',
        name: 'permanent_price',
        rules: [{ required: true, message: 'Vui lòng nhập giá mua cố định !' }],
      },
      inputOptions: {
        placeholder: 'Nhập giá mua cố định',
        className: 'number-input',
        min: 0,
        formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
        parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
        controls: false,
        addonAfter: <span>đ</span>,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Kho mặc định',
        name: 'default_inventory',
      },
      inputOptions: {
        placeholder: 'Chọn kho mặc định',
        options: [
          {
            label: 'Kho Hà Nội',
            value: 'Kho Hà Nội',
          },
          {
            label: 'Kho HCM',
            value: 'Kho HCM',
          },
        ],
      },
    },
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Tồn kho',
        name: 'inStock',
      },
      inputOptions: {
        placeholder: 'Nhập tồn kho',
        className: 'number-input',
        min: 0,
      },
    },

    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Giá vốn',
        name: 'base_price',
      },
      inputOptions: {
        placeholder: 'Nhập giá vốn',
        className: 'number-input',
        min: 0,
        formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
        parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
        controls: false,
        addonAfter: <span>đ</span>,
      },
    },
  ];

  function initForm(product) {
    form.setFieldsValue({
      ...product,
    });
  }

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loadUserPermissions} />
      ) : canViewProduct ? (
        <div className="product-detail-container">
          <Spin spinning={loading}>
            <PageHeader
              pageTitle={'Thông tin sản phẩm'}
              routes={[
                {
                  path: '/product',
                  name: 'Danh sách sản phẩm',
                },
                {
                  path: '',
                  name: 'Thông tin sản phẩm',
                },
              ]}
            />

            <Form {...FORM_LAYOUT} form={form}>
              <div className="button-group">
                <Link to="/product">
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
                  <p className="description">Thông tin chung về sản phẩm</p>
                </div>

                <div className="right-col">
                  {formFields.slice(0, 7).map((field, index) => {
                    return <FormInput key={index} {...field} />;
                  })}
                </div>
              </div>

              <div className="price-inventory">
                <div className="left-col">
                  <p className="title">GIÁ VÀ TỒN KHO</p>
                  <p className="description">Cài đặt giá bán, tồn kho và giá vốn sản phẩm</p>
                </div>

                <div className="right-col">
                  {formFields.slice(7, 13).map((field, index) => {
                    return <FormInput key={index} {...field} />;
                  })}
                </div>
              </div>

              <div className="product-images">
                <div className="left-col">
                  <p className="title">HÌNH ẢNH SẢN PHẨM</p>
                  <p className="description">Ảnh minh họa sản phẩm</p>
                </div>

                <div className="right-col">
                  <UploadImage acceptTypes={['image/jpeg', 'image/jpg', 'image/png']} />
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

export default ProductDetail;
