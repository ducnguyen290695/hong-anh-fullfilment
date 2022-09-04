import { Button, Dropdown, Form, Input, Tooltip } from 'antd';
import { FontAwesomeIcon, Icon, SvgIcon } from 'assets/icons';
import CustomModal from 'components/CustomModal';
import CustomTable from 'components/CustomTable';
import FormInput from 'components/FormInput';
import StateSwitch from 'components/StateSwitch';
import UploadDocument from 'components/UploadDocument';
import { INPUT_TYPE, REGEX } from 'config/constants';
import { useTransferMoney } from 'hooks/money-transfer';
import { useGetSellerWithWallet } from 'hooks/seller/index';
import { useAccountantPermissions, useCurrentUser } from 'hooks/user/user';
import useSearchTextDebounce from 'hooks/useSearchTextDebounce';
import React, { useEffect, useState } from 'react';
import { buildQueryString, formatCurrency, getQuery, notify } from 'utils/helperFuncs';
import FilterMenu from './components/FilterMenu/index';
import './index.scss';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CHARGE_LIMIT = 5000000000;
export const WALLET_TYPE = {
  WAREHOUSE_ACCOUNTANT: 'WAREHOUSE_ACCOUNTANT',
  BANK_ACCOUNT: 'BANK_ACCOUNT',
};

const WALLET_STATUS = (number) => {
  switch (number < 0) {
    case true:
      return <div className="wallet-status">{formatCurrency(number)}</div>;
    case false:
      return <div>{formatCurrency(number)}</div>;
    default:
      return <div>0 đ</div>;
  }
};

const SellerList = () => {
  const history = useHistory();
  const [params, setParams] = useState({
    offset: getQuery().offset || 0,
    limit: 10,
    fullTextSearch: getQuery().fullTextSearch || null,
  });
  const [fileUrls, setFileUrls] = useState([]);
  const [form] = Form.useForm();
  const { handleTransferMoney } = useTransferMoney();
  const [switchClose, setSwitchClose] = useState(false);
  const [switchClear, setSwitchClear] = useState(false);
  const search = useSearchTextDebounce(params, setParams);
  const { currentUser: userInfo } = useCurrentUser();
  const { t } = useTranslation();
  const { canRechargeFromBank, canRechargeFromVirtualWallet, displaySellerTxHistory } =
    useAccountantPermissions();

  const transactionOptions = [
    {
      label: t('accountant.transactionType.companyToCompany'),
      value: 'COMPANY_TO_COMPANY',
    },
    {
      label: t('accountant.transactionType.personalToCompany'),
      value: 'PERSONAL_TO_COMPANY',
    },
    {
      label: t('accountant.transactionType.companyToPersonal'),
      value: 'COMPANY_TO_PERSONAL',
    },
    {
      label: t('accountant.transactionType.personalToPersonal'),
      value: 'PERSONAL_TO_PERSONAL',
    },
  ];

  const getParams = () => ({
    filters: {
      query: params.fullTextSearch,
      exportedWarehouseID: params.exportedWarehouseID,
      exportedWarehouseIDs: params.exportedWarehouseIDs,
      isActive: params.isActive,
      sellerLevelID: params.sellerLevelID,
    },
    pagination: {
      limit: params.limit,
      offset: params.offset,
    },
  });

  const { loading, data, total, refetch } = useGetSellerWithWallet(getParams());

  const formFields = [
    {
      type: INPUT_TYPE.RADIO_GROUP,
      formItemOptions: {
        label: 'Nguồn nạp tiền',
        name: 'source',
        initialValue: getWalletOptions().initialValue,
      },
      inputOptions: {
        options: getWalletOptions().options,
      },
    },
    {
      type: INPUT_TYPE.RADIO_GROUP,
      formItemOptions: {
        label: 'Nạp vào tài khoản',
        name: 'target',
        initialValue: 'companyWallet',
      },
      inputOptions: {
        options: [
          {
            label: t('accountant.sellerVirtualWallet'),
            value: 'companyWallet',
          },
        ],
      },
    },
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
      type: INPUT_TYPE.SELECT,
      formItemOptions: {
        label: t('accountant.transferType'),
        name: 'transferType',
      },
      inputOptions: {
        placeholder: t('accountant.selectTransferType'),
        options: transactionOptions,
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

  const fetchSellerList = async () => {
    await refetch(getParams);
  };

  const columns = [
    {
      title: 'MÃ ĐẠI LÝ',
      dataIndex: 'code',
      render: (_, record) => <div className="agent-code">{record.code}</div>,
    },
    {
      title: 'TÊN ĐẠI LÝ',
      dataIndex: 'shortName',
    },
    {
      align: 'center',
      title: 'CẤP ĐỘ',
      dataIndex: ['sellerLevel', 'level'],
    },
    {
      align: 'right',
      title: 'VÍ CÔNG TY',
      dataIndex: ['companyWallet', 'balance'],
      render: (_, record) => WALLET_STATUS(record.companyWallet?.balance),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'isActive',
      render: (_, record) => {
        return <StateSwitch disabled checked={record.isActive} />;
      },
    },
    {
      align: 'center',
      title: 'THAO TÁC',
      dataIndex: 'actions',
      render: (_, record) => {
        const sellerName = `${record.shortName} - ${record.fullName}`;

        return (
          <div className="actions">
            {canRechargeFromBank || canRechargeFromVirtualWallet ? (
              <CustomModal
                onOke={() => transferMoney(record)}
                okeButtonLabel={'Lưu lại'}
                centered={true}
                title={
                  <div className="recharge-title">
                    <p>Nạp tiền vào tài khoản Đại lý</p>
                    <p className="seller-name">{sellerName}</p>
                  </div>
                }
                footer={false}
                switchClose={switchClose}
                isBlockCloseOnOke
                customComponent={
                  <Tooltip title="Nạp tiền">
                    <SvgIcon.RechargeIcon />
                  </Tooltip>
                }
                className="transfer-popup"
              >
                <Form form={form} labelCol={{ span: 6 }}>
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
                        (File hỗ trợ: *.png, *.jpeg, *.jpg, *pdf, *.doc, *.docx, *.xls, *.xlsx,
                        *.csv - tối đa 5Mb)
                      </p>
                    </Form.Item>

                    <p className="note">
                      * Ghi chú: Không nên nạp tiền từ tài khoản công ty vào tài khoản cá nhân và
                      ngược lại
                    </p>
                  </div>
                </Form>
              </CustomModal>
            ) : (
              <></>
            )}

            {displaySellerTxHistory && (
              <Tooltip title="Xem lịch sử">
                <SvgIcon.TransactionHistory
                  onClick={() => {
                    history.push({
                      pathname: 'transaction-history',
                      state: { tab: '1', query: record.code.toString() },
                    });
                  }}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  function getWalletOptions() {
    let initialValue = WALLET_TYPE.WAREHOUSE_ACCOUNTANT;
    let options = [];
    const { wallets = [] } = userInfo || {};
    options = wallets?.map((wallet) => {
      if (wallet.type === WALLET_TYPE.WAREHOUSE_ACCOUNTANT) {
        return {
          label: 'Ví tiền ảo' + ` (Số dư hiện tại: ${formatCurrency(wallet?.balance)})`,
          value: WALLET_TYPE.WAREHOUSE_ACCOUNTANT,
        };
      }

      if (wallet.type === WALLET_TYPE.BANK_ACCOUNT) {
        return {
          label: ' Tài khoản ngân hàng',
          value: WALLET_TYPE.BANK_ACCOUNT,
        };
      }
    });

    let isOnlyBankAccount =
      options?.filter((item) => item?.value === WALLET_TYPE.BANK_ACCOUNT)?.length === 1;
    if (isOnlyBankAccount) {
      initialValue = WALLET_TYPE.BANK_ACCOUNT;
    }

    return { options, initialValue };
  }

  function filterSellerExtra(values) {
    setParams({
      ...params,
      ...values,
      offset: 0,
    });
  }

  function handleUploadSuccess(urls) {
    setFileUrls(urls);
  }

  function resetFields() {
    form.resetFields();
    setSwitchClear(!switchClear);
  }

  async function transferMoney({ personalWallet, companyWallet }) {
    const { amount, description, target, source, transferType } = await form.validateFields();
    if (amount > userInfo?.wallet?.balance) {
      notify.error({
        message: 'Nạp tiền thất bại',
        description: 'Vui lòng nhập số tiền không vượt quá số dư hiện tại trong Ví tiền ảo của bạn',
      });
      return;
    }
    try {
      await handleTransferMoney({
        source: source === WALLET_TYPE.WAREHOUSE_ACCOUNTANT ? userInfo?.wallet.id : null,
        target: target === 'personalWallet' ? personalWallet?.id : companyWallet?.id,
        amount,
        description,
        fileUrls,
        transferType,
      });
      notify.success({
        message: 'Nạp tiền thành công !',
      });
      setSwitchClose(!switchClose);
      resetFields();
      fetchSellerList();
    } catch (err) {
      notify.error({
        message: 'Nạp tiền thất bại !',
        description: err?.message,
      });
    }
  }

  useEffect(() => {
    fetchSellerList();
  }, [params]);
  return (
    <div className="seller-list">
      <div className="filter-box">
        <div className="search-input">
          <Input
            className="custom-input"
            allowClear={true}
            placeholder="Tìm kiếm mã hoặc tên đại lý"
            defaultValue={getQuery().fullTextSearch || ''}
            {...search}
          />
        </div>

        <Dropdown
          overlayClassName="dropdown-overlay"
          trigger="hover"
          overlay={<FilterMenu onFilter={filterSellerExtra} />}
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
        loading={loading}
        pagination={{
          total: total,
          pageSize: params.limit,
          current: params.offset / params.limit + 1,
          showSizeChanger: false,
        }}
        onChange={onTableChange}
        columns={columns}
        dataSource={data}
        scroll={{ x: 800, y: null }}
      />
    </div>
  );
};

export default SellerList;
