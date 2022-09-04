import React, { useState } from 'react';
import CustomTable from 'components/CustomTable';
import { Button, Input, Form } from 'antd';
import { Icon, FontAwesomeIcon } from 'assets/icons';
import CustomModal from 'components/CustomModal';
import FormInput from 'components/FormInput';
import { FORM_LAYOUT, INPUT_TYPE } from 'config/constants';
import {
  useGetSellerContact,
  useCreateSellerContact,
  useUpdateSellerContact,
  useDeleteSellerContact,
  useSellerPermissions,
} from 'hooks/seller';
import { useParams } from 'react-router-dom';
import { useCities, useDistricts, useWards } from 'hooks/common';
import Img from 'assets/images';
import { notify } from 'utils/helperFuncs';
import { debounce, validator } from 'utils/helperFuncs';
import './index.scss';

const AddressList = () => {
  const { id } = useParams();
  const [location, setLocation] = useState({
    cityId: null,
    districtId: null,
  });
  const [switchClose, setSwitchClose] = useState(true);

  const [query, setQuery] = useState(null);

  const {
    sellerContacts,
    refetch,
    loading: fetching,
  } = useGetSellerContact({ sellerID: id, query });
  const { handleCreateContact, loading: creating } = useCreateSellerContact();
  const { handleUpdateContact } = useUpdateSellerContact();
  const { handleDeleteContact } = useDeleteSellerContact();
  const { canUpdateContact, canDeleteContact } = useSellerPermissions();

  const { cities } = useCities([1, 2]);
  const { districts } = useDistricts(location?.cityId);
  const { wards } = useWards(location?.districtId);

  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();

  const formInitialValues = {
    isDefault: false,
  };

  const formFields = [
    {
      formItemOptions: {
        label: 'Họ tên',
        name: 'fullName',
        rules: [{ required: true, message: 'Vui lòng nhập họ tên !' }],
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
          { required: true, message: 'Vui lòng nhập Email !' },
          validator({
            type: 'email',
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập địa chỉ email để đăng nhập',
        maxLength: 50,
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
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: 'Tỉnh/Thành',
        name: 'cityID',
        rules: [{ required: true, message: 'Vui lòng chọn Tỉnh/Thành !' }],
      },
      inputOptions: {
        placeholder: 'Chọn Tỉnh/Thành',
        maxLength: 50,
        options: cities?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
        onChange: (cityId) =>
          setLocation({
            ...location,
            cityId,
          }),
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
        maxLength: 50,
        options: districts?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
        onChange: (districtId) =>
          setLocation({
            ...location,
            districtId,
          }),
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
        maxLength: 50,
        options: wards?.map(({ id, name }) => ({
          label: name,
          value: id,
        })),
      },
    },
  ];

  const columns = [
    {
      title: 'STT',
      dataIndex: 'no',
    },
    {
      title: 'HỌ TÊN',
      dataIndex: 'fullName',
    },
    {
      title: 'ĐỊA CHỈ',
      dataIndex: 'address',
    },
    {
      title: 'SĐT',
      dataIndex: 'telephone',
    },
    {
      title: 'HÀNH ĐỘNG',
      dataIndex: 'actions',
      align: 'center',
      render: (_, record) => {
        return (
          <div className="actions">
            {!record?.isDefault && (
              <CustomModal
                {...{
                  onOke: () => setAsDefaultContact(record),
                  okeButtonLabel: 'Xác nhận',
                  customComponent: <a>Đặt làm mặc định</a>,
                  title: <span className="add-address-title">Đặt làm địa chỉ mặc định</span>,
                  centered: true,
                  footer: false,
                  switchClose,
                  afterClose: refetch,
                  message: 'Bạn có chắc muốn đặt địa chỉ này làm mặc định không ?',
                }}
              />
            )}

            {canUpdateContact && (
              <CustomModal
                {...{
                  onOke: () => updateContact(record?.id),
                  okeButtonLabel: 'Lưu lại',
                  customComponent: <a>Sửa</a>,
                  title: <span className="add-address-title">Sửa địa chỉ</span>,
                  centered: true,
                  footer: false,
                  width: 'fit-content',
                  switchClose,
                  afterClose: refetch,
                  onOpen: () => initDetailForm(record),
                }}
              >
                <Form initialValues={formInitialValues} form={updateForm} {...FORM_LAYOUT}>
                  <div className="add-address-form">
                    {formFields.map((field, index) => {
                      return <FormInput key={index} {...field} />;
                    })}

                    <div className="address-input">
                      <FormInput
                        {...{
                          formItemOptions: {
                            label: 'Địa chỉ',
                            name: 'address',
                          },
                          inputOptions: {
                            placeholder: 'Nhập địa chỉ',
                            maxLength: 50,
                          },
                        }}
                      />

                      <Form.Item>
                        <FormInput
                          {...{
                            type: INPUT_TYPE.CHECK_BOX,
                            formItemOptions: {
                              name: 'isDefault',
                              valuePropName: 'checked',
                            },
                            inputChildren: 'Đặt làm mặc định',
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </CustomModal>
            )}

            {!record?.isDefault && canDeleteContact && (
              <CustomModal
                {...{
                  message: 'Bạn có chắc chắn muốn xóa địa chỉ này không ?',
                  onOke: () => deleteContact(record?.id),
                  okeButtonLabel: 'Lưu lại',
                  customComponent: <a className="delete-action">Xóa</a>,
                  centered: true,
                  footer: false,
                  width: 'fit-content',
                  switchClose,
                  afterClose: refetch,
                  onOpen: () => initDetailForm(record),
                  icon: Img.DeleteIcon,
                  closeOnOke: true,
                }}
              ></CustomModal>
            )}
          </div>
        );
      },
    },
  ];

  async function deleteContact(addressId) {
    try {
      await handleDeleteContact({
        id: addressId,
      });
      notify.success({
        message: 'Xóa địa chỉ thành công !',
      });
    } catch (err) {
      console.log({ err });
      notify.error({
        message: 'Xóa địa chỉ thất bại !',
        description: err?.message,
      });
    }
  }

  function initDetailForm(record) {
    const { cityID, districtID } = record;
    setLocation({
      cityId: cityID,
      districtId: districtID,
    });
    updateForm.setFieldsValue({
      ...record,
    });
  }

  async function updateContact(contactId) {
    const values = await updateForm.validateFields();
    try {
      await handleUpdateContact({
        id: contactId,
        contact: {
          ...values,
          sellerID: id,
        },
      });

      notify.success({
        message: 'Cập nhật địa chỉ thành công !',
      });
      setSwitchClose(!switchClose);
      updateForm.resetFields();
      refetch();
    } catch (err) {
      console.log(err);
      notify.error({
        message: 'Cập nhật địa chỉ thất bại !',
      });
    }
  }

  async function createContact() {
    const values = await createForm.validateFields();
    console.log({ values });
    try {
      await handleCreateContact({
        contact: {
          ...values,
          sellerID: id,
        },
      });
      notify.success({
        message: 'Tạo địa chỉ thành công !',
      });
      setSwitchClose(!switchClose);
      createForm.resetFields();
    } catch (err) {
      notify.error({
        message: 'Tạo địa chỉ thất bại !',
      });
    }
  }

  //Filter role by text
  const filterAddressByTextDebounced = debounce(filterAddressByText, 400);

  function filterAddressByText([text]) {
    if (text[0] === ' ') {
      return;
    }
    setQuery(text);
  }

  async function setAsDefaultContact(record) {
    const { address, cityID, districtID, fullName, telephone, wardID } = record;
    try {
      await handleUpdateContact({
        id: record?.id,
        contact: {
          address,
          cityID,
          districtID,
          fullName,
          telephone,
          wardID,
          isDefault: true,
          sellerID: id,
        },
      });
      notify.success({
        message: 'Đặt địa chỉ mặc định thành công !',
      });
      refetch();
    } catch (err) {
      notify.error({
        message: 'Đặt địa chỉ mặc định thất bại !',
      });
    }
  }

  return (
    <div className="address-list-container">
      <div className="filter-box">
        <div className="search-input">
          <Input
            className="custom-input"
            allowClear={true}
            prefix={<FontAwesomeIcon icon={Icon.faSearch} />}
            placeholder="Tìm kiếm địa chỉ"
            onChange={(e) => filterAddressByTextDebounced(e.target.value)}
            // defaultValue={getQuery().fullTextSearch || ""}
          />
        </div>

        <CustomModal
          {...{
            onOke: createContact,
            okeButtonLabel: 'Lưu lại',
            customComponent: (
              <Button className="create-btn" type="primary">
                Thêm địa chỉ
              </Button>
            ),
            title: <span className="add-address-title">Thêm địa chỉ mới</span>,
            centered: true,
            footer: false,
            width: 'fit-content',
            buttonLoading: creating,
            switchClose,
            afterClose: refetch,
            isBlockCloseOnOke: true,
          }}
        >
          <Form initialValues={formInitialValues} form={createForm} {...FORM_LAYOUT}>
            <div className="add-address-form">
              {formFields.map((field, index) => {
                return <FormInput key={index} {...field} />;
              })}

              <div className="address-input">
                <FormInput
                  {...{
                    formItemOptions: {
                      label: 'Địa chỉ',
                      name: 'address',
                    },
                    inputOptions: {
                      placeholder: 'Nhập địa chỉ',
                      maxLength: 50,
                    },
                  }}
                />

                <Form.Item>
                  <FormInput
                    {...{
                      type: INPUT_TYPE.CHECK_BOX,
                      formItemOptions: {
                        name: 'isDefault',
                        valuePropName: 'checked',
                      },
                      inputChildren: 'Đặt làm mặc định',
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </CustomModal>
      </div>

      <CustomTable
        rowKey={(record) => record?.id}
        columns={columns}
        dataSource={sellerContacts?.map((item, index) => ({
          ...item,
          no: index + 1,
        }))}
        scroll={{ x: 800, y: null }}
        loading={fetching}
      />
    </div>
  );
};

export default AddressList;
