import React, { useEffect } from 'react';
import { Button, Form, Upload } from 'antd';
import FormInput from 'components/FormInput';
import { FORM_LAYOUT, INPUT_TYPE, ACCEPT_IMG_TYPES } from 'config/constants';
import { notify, validator, readFile, dummyRequest } from 'utils/helperFuncs';
import { useState } from 'react';
import './index.scss';
import { useGetSellerDetail, useGetSellerLevels } from 'hooks/seller';
import { useUpload } from 'hooks/upload';
import Img from 'assets/images';
import { useCities, useDistricts, useWards, useBanks } from 'hooks/common';
import { useWarehouse } from 'hooks/warehouse';
import { useParams } from 'react-router-dom';

const CommonInfo = ({
  isSellerDetail,
  form,
  getLogoUrl,
  defaultLogoUrl,
  location,
  setLocation,
}) => {
  const [logo, setLogo] = useState('');
  const [uploading, setUploading] = useState(false);

  const { handleUpload } = useUpload();
  const { id } = useParams();

  const { cities } = useCities([1, 2]);
  const { districts } = useDistricts(location?.cityId);
  const { wards } = useWards(location?.districtId);
  const { warehouses } = useWarehouse();
  const { banks } = useBanks();
  const { sellerLevels } = useGetSellerLevels();

  const formFields = [
    {
      formItemOptions: {
        label: 'Họ tên',
        name: 'fullName',
        rules: [{ required: true, message: 'Vui lòng họ tên !' }],
      },
      inputOptions: {
        placeholder: 'Nhập họ tên đầy đủ',
        maxLength: 50,
      },
    },
    {
      formItemOptions: {
        label: 'Email',
        name: 'email',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập email !',
          },
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
          { required: true, message: 'Vui lòng nhập số điện thoại !' },
          validator({
            type: 'phone',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập số điện thoại',
        maxLength: 10,
      },
    },

    {
      formItemOptions: {
        label: 'Căn cước công dân',
        name: 'idNumber',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số căn cước công dân !',
          },
          validator({
            type: 'number',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập số căn cước công dân',
        maxLength: 12,
      },
    },

    {
      formItemOptions: {
        label: 'Tên viết tắt công ty',
        name: 'shortName',
        rules: [{ required: true, message: 'Vui lòng nhập tên viết tắt công ty !' }],
      },
      inputOptions: {
        placeholder: 'Nhập tên viết tắt công ty',
        maxLength: 10,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Tỉnh/Thành',
        name: 'cityID',
        rules: [{ required: true, message: 'Vui lòng chọn Tỉnh/Thành !' }],
      },
      inputOptions: {
        placeholder: 'Chọn Tỉnh/Thành',
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
        rules: [{ required: true, message: 'Vui lòng chọn Quận/Huyện !' }],
      },
      inputOptions: {
        placeholder: 'Chọn Quận/Huyện',
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
        rules: [{ required: true, message: 'Vui lòng chọn Phường/Xã !' }],
      },
      inputOptions: {
        placeholder: 'Chọn Phường/Xã',
        options: wards?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      },
    },
    {
      formItemOptions: {
        label: 'Địa chỉ',
        name: 'address',
      },
      inputOptions: {
        placeholder: 'Nhập địa chỉ',
        maxLength: 255,
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Kho xuất hàng',
        name: 'warehouseIDs',
        rules: [{ required: true, message: 'Vui lòng chọn kho xuất hàng !' }],
      },
      inputOptions: {
        placeholder: 'Chọn kho xuất hàng',
        options: warehouses?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
        mode: 'multiple',
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Cấp độ',
        name: 'sellerLevelID',
        rules: [{ required: true, message: 'Vui lòng chọn cấp độ !' }],
      },
      inputOptions: {
        placeholder: 'Chọn cấp độ',
        options: sellerLevels?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      },
    },
    {
      formItemOptions: {
        label: 'Hạn mức',
        name: 'debtLimit',
        rules: [
          { required: true, message: 'Vui lòng chọn hạn mức !' },
          validator({
            type: 'number',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập hạn mức',
        maxLength: 10,
      },
    },
    {
      formItemOptions: {
        label: 'Tuổi nợ (tháng)',
        name: 'debtAge',
        rules: [
          { required: true, message: 'Vui lòng nhập tuổi nợ !' },
          validator({
            type: 'number',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập tuổi nợ',
        maxLength: 2,
      },
    },
    {
      formItemOptions: {
        label: 'Tên công ty (hiển thị trên hóa đơn)',
        name: 'businessName',
      },
      inputOptions: {
        placeholder: 'Nhập tên công ty',
      },
    },
    {
      formItemOptions: {
        label: 'Người đại diện pháp luật',
        name: 'representative',
      },
      inputOptions: {
        placeholder: 'Nhập tên người đại diện pháp luật',
      },
    },
    {
      formItemOptions: {
        label: 'Số điện thoại',
        name: 'legal_representative_phone',
        rules: [
          validator({
            type: 'phone',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập số điện thoại',
        maxLength: 10,
      },
    },
    {
      formItemOptions: {
        label: 'Địa chỉ',
        name: 'company_address',
      },
      inputOptions: {
        placeholder: 'Nhập địa chỉ',
      },
    },
    {
      formItemOptions: {
        label: 'Mã số thuế',
        name: 'taxIDNumber',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập mã số thuế !',
          },
        ],
      },
      inputOptions: {
        placeholder: 'Nhập mã số thuế',
        maxLength: 13,
      },
    },
    {
      formItemOptions: {
        label: 'Email',
        name: 'company_email',
        rules: [
          validator({
            type: 'email',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập địa chỉ email',
      },
    },
    {
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Ngân hàng',
        name: 'bankID',
      },
      inputOptions: {
        placeholder: 'Chọn ngân hàng',
        options: banks?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      },
    },
    {
      formItemOptions: {
        label: 'Số tài khoản',
        name: 'bankAccountNumber',
        rules: [
          validator({
            type: 'number',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập số tài khoản',
        maxLength: 30,
      },
    },
    {
      formItemOptions: {
        label: 'Chi nhánh',
        name: 'bankBranch',
      },
      inputOptions: {
        placeholder: 'Nhập tên chi nhánh',
        maxLength: 255,
      },
    },
  ];

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
          const logoUrl = await handleUpload({ file: info?.file?.originFileObj });
          getLogoUrl && getLogoUrl(logoUrl);
          setLogo(result);
        },
        type: 'Base64String',
        file: info?.file?.originFileObj,
      });
    } else if (info.file.status === 'error') {
    }
  }

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

  return (
    <div className="common-info-container">
      <Form form={form} {...FORM_LAYOUT}>
        <div className="seller-class">
          <label className="seller-class-label">Phân loại đại lý:</label>
          <FormInput
            type={INPUT_TYPE.RADIO_GROUP}
            formItemOptions={{
              name: 'type',
            }}
            inputOptions={{
              defaultValue: 'COMPANY',
              options: [
                {
                  label: 'Công ty',
                  value: 'COMPANY',
                },
                {
                  label: 'Cá nhân',
                  value: 'PERSONAL',
                },
              ],
            }}
          />
        </div>

        <div className="form-content">
          <p className="title">THÔNG TIN CHUNG</p>

          <div className="form">
            <div className="logo">
              <p>Logo</p>

              <div className="logo-content">
                <div className="avatar">
                  <img src={logo || defaultLogoUrl || Img.AvatarPlaceHolder} />
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
            </div>

            {formFields.slice(0, 13).map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}
          </div>
        </div>

        <div className="form-content">
          <p className="title">THÔNG TIN VAT</p>
          <div className="form">
            {formFields.slice(13, 22).map((field, index) => {
              return <FormInput key={index} {...field} />;
            })}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CommonInfo;
