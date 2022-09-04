import React, { useState } from 'react';
import CustomTable from 'components/CustomTable';
import { Switch, Tooltip, Input, Dropdown, Button, Form } from 'antd';
import { SvgIcon, FontAwesomeIcon, Icon } from 'assets/icons';
import { Link } from 'react-router-dom';
import CustomModal from 'components/CustomModal';
import FormInput from 'components/FormInput';
import { INPUT_TYPE, REGEX } from 'config/constants';
import { formatCurrency, buildQueryString, notify } from 'utils/helperFuncs';
import useSearchTextDebounce from 'hooks/useSearchTextDebounce';
import { useAccountantPermissions, useGetWarehouseAccountants } from 'hooks/user/user';
import FilterBox from './components/FilterBox';
import { useTransferMoney } from 'hooks/money-transfer';
import UploadDocument from 'components/UploadDocument';
import './index.scss';
import { useHistory } from 'react-router-dom';

const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
};
const CHARGE_LIMIT = 5000000000;

const WAREHOUSE_ACCOUNTANT = 'WAREHOUSE_ACCOUNTANT';

const WarehouseAccountantList = () => {
  const history = useHistory();

  const { displayAccountantTxHistory, canRechargeWarehouseAccountant } = useAccountantPermissions();

  const [params, setParams] = useState({
    offset: 0,
    fullTextSearch: null,
    status: null,
  });

  const { warehouseAccountants, total, loading, refetch } = useGetWarehouseAccountants({
    filters: {
      permission: WAREHOUSE_ACCOUNTANT,
      query: params.fullTextSearch,
      status: params.status,
    },
    pagination: {
      offset: params.offset,
      limit: 10,
    },
  });

  const { onChange } = useSearchTextDebounce(params, setParams);
  const [fileUrls, setFileUrls] = useState([]);
  const { handleTransferMoney, loading: transfering } = useTransferMoney();
  const [form] = Form.useForm();
  const [switchClose, setSwitchClose] = useState(false);
  const [switchClear, setSwitchClear] = useState(false);

  const formFields = [
    {
      type: INPUT_TYPE.NUMBER,
      formItemOptions: {
        label: 'Số tiền',
        name: 'amount',
        rules: [
          {
            required: true,
            message: 'Vui lòng nhập số tiền',
          },
          () => ({
            validator(_, value) {
              if (value <= CHARGE_LIMIT) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(`Bạn không được nạp số tiền vượt quá ${formatCurrency(CHARGE_LIMIT)} !`)
              );
            },
          }),
        ],
      },
      inputOptions: {
        placeholder: 'Nhập số tiền',
        addonAfter: 'đ',
        formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
        parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
        min: 0,
        controls: false,
        maxLength: 12,
      },
    },
    {
      type: INPUT_TYPE.TEXT_AREA,
      formItemOptions: {
        label: 'Ghi chú',
        name: 'description',
      },
      inputOptions: {
        placeholder: 'Nhập ghi chú',
        maxLength: 255,
        showCount: true,
      },
    },
  ];

  const columns = [
    {
      title: 'MÃ TÀI KHOẢN',
      dataIndex: 'id',
      render: (_, record) => <Link to={`/account/detail/${record.id}`}>{record?.id}</Link>,
    },
    {
      title: 'TÊN KẾ TOÁN KHO',
      dataIndex: 'fullname',
    },
    {
      title: 'SỐ DƯ VÍ ẢO',
      dataIndex: 'balance',
      render: (_, record) =>
        record?.wallet?.balance ? formatCurrency(record?.wallet?.balance) : '',
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (_, record) => {
        return (
          <Switch
            disabled
            checkedChildren="ON"
            unCheckedChildren="OFF"
            checked={record.status === ACCOUNT_STATUS.ACTIVE}
          />
        );
      },
    },
    {
      align: 'center',
      title: 'THAO TÁC',
      dataIndex: 'actions',
      render: (_, record) => (
        <div className="actions">
          {canRechargeWarehouseAccountant && (
            <CustomModal
              className="transfer-popup"
              onOke={() => transferMoney(record?.wallet?.id)}
              centered={true}
              title={
                <div className="recharge-title">
                  <p>Nạp tiền vào tài khoản Kế toán kho</p>

                  <p className="seller-name">
                    {record.fullname} - {record.id}
                  </p>
                </div>
              }
              footer={false}
              customComponent={
                <Tooltip title="Nạp tiền">
                  <SvgIcon.RechargeIcon />
                </Tooltip>
              }
              isBlockCloseOnOke={true}
              switchClose={switchClose}
              buttonLoading={transfering}
            >
              <Form form={form} labelCol={{ span: 2 }}>
                <div className="recharge-form">
                  {formFields.map((field, index) => {
                    return <FormInput key={index} {...field} />;
                  })}

                  <Form.Item label="Đính kèm" wrapperCol={{ span: 16 }}>
                    <UploadDocument
                      onUploadSuccess={handleUploadSuccess}
                      switchClear={switchClear}
                    />
                    <p className="files-support">
                      (File hỗ trợ: *.png, *.jpeg, *.jpg, *pdf, *.doc, *.docx, *.xls, *.xlsx, *.csv
                      - tối đa 5Mb)
                    </p>
                  </Form.Item>
                </div>
              </Form>
            </CustomModal>
          )}

          {displayAccountantTxHistory && (
            <Tooltip title="Xem lịch sử">
              <SvgIcon.TransactionHistory />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  function filterUserByStatus({ status }) {
    let newParams = {
      ...params,
      status,
    };
    setParams(newParams);
  }

  function onTableChange(pagination) {
    const { current, pageSize } = pagination;
    let newParams = {
      ...params,
      offset: (current - 1) * pageSize,
    };

    setParams(newParams);
    buildQueryString({
      params: newParams,
    });
  }

  function handleUploadSuccess(urls) {
    setFileUrls(urls);
  }

  function resetFields() {
    form.resetFields();
    setSwitchClear(!switchClear);
  }

  async function transferMoney(walletId) {
    const { amount, description } = await form.validateFields();
    try {
      await handleTransferMoney({
        source: null,
        target: walletId,
        amount,
        description,
        fileUrls,
      });
      notify.success({
        message: 'Nạp tiền thành công !',
      });
      setSwitchClose(!switchClose);
      refetch();
      resetFields();
    } catch (err) {
      notify.error({
        message: 'Nạp tiền thất bại !',
        description: err?.message,
      });
    }
  }

  return (
    <div className="warehouse-accountant-list">
      <div className="filter-box">
        <div className="search-input">
          <Input
            onChange={onChange}
            className="custom-input"
            allowClear={true}
            placeholder="Tìm kiếm mã hoặc tên kế toán kho"
          />
        </div>

        <Dropdown
          overlayClassName="dropdown-overlay"
          trigger="hover"
          overlay={<FilterBox onFilter={filterUserByStatus} />}
          placement="bottomRight"
        >
          <Button
            icon={<FontAwesomeIcon icon={Icon.faFilter} className="filter-icon" />}
            className="filter-btn"
          >
            Bộ lọc
          </Button>
        </Dropdown>
      </div>

      <CustomTable
        pagination={{
          total: total,
          pageSize: 10,
          current: params.offset / 10 + 1,
          showSizeChanger: false,
        }}
        columns={columns}
        dataSource={warehouseAccountants}
        scroll={{ x: 800, y: null }}
        onChange={onTableChange}
        loading={loading}
      />
    </div>
  );
};

export default WarehouseAccountantList;
