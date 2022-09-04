import { UserOutlined } from '@ant-design/icons';
import { Avatar, Checkbox, Form, Select, Tooltip, Button, InputNumber, Divider, Space } from 'antd';
import { SvgIcon } from 'assets/icons';
import CustomTable from 'components/CustomTable';
import FormInput from 'components/FormInput';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomCard from '../CustomCard';
import './index.scss';
import {
  useGetCart,
  useUpdateCart,
  useCartItems,
  useRemovedItemIDs,
  useGetShippingProvider,
} from 'hooks/cart';
import { useWarehouse } from 'hooks/warehouse';
import Spinner from 'components/Spinner';
import { formatCurrency, notify, formatInStock } from 'utils/helperFuncs';
import CustomFormDeliveryMethod from '../CustomFormMethod';
import ProductTable from '../ProductTable';
import CustomModalChangeAddress from '../CustomModalChangeAddress';
import InputCounter from 'pages/App/Cart/List/components/InputCounter';
import CustomModal from 'components/CustomModal';
import {
  SHIPPING_TYPE,
  PRIORITY_LEVEL,
  DATE_FORMAT,
  TIME_FORMAT,
  PAYMENT_METHOD,
  EXPORT_FILE_ACTION,
  REGEX,
} from 'config/constants';
import CustomModalChangeSeller from '../CustomModalChangeSeller';
import { getTimestampByDate } from 'utils/dateTime';
import { unset } from 'lodash';
import moment from 'moment';
import { useContacts } from 'hooks/contact';
import CustomModalCreateOrder from '../CustomModalCreateOrder';
import CloneCartButton from '../CloneCartButton';
import { useOrderPermissions } from 'hooks/order';
import ExportFileButton from 'components/ExportFileButton';

const CustomTabPane = ({ id }) => {
  const { t } = useTranslation();
  const { handleRemovedItemIDs } = useRemovedItemIDs();
  const { handleCartItems } = useCartItems();
  const [changeSellerModalVisible, setChangeSellerModalVisible] = useState(false);
  const [changeCreateOrderModalVisible, setChangeCreateOrderModalVisible] = useState(false);
  const [shippingProviderQuery, setShippingProviderQuery] = useState(undefined);
  const [switchClose, setSwitchClose] = useState(false);
  const [globalForm] = Form.useForm();
  const [maxDaysOfDebt, setMaxDaysOfDebt] = useState(0);
  const { loading, data, refetch } = useGetCart({ id: id });
  const { data: sellers } = useContacts({ sellerID: data?.sellerID });
  const { data: shippingProvider } = useGetShippingProvider(shippingProviderQuery);
  const [isEditServiceFee, setIsEditServiceFee] = useState(false);
  const [isEditDiscount, setIsEditDiscount] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { canCreateOrder } = useOrderPermissions();

  const priorityLevel = [
    {
      value: PRIORITY_LEVEL.HIGH,
      label: t('cart.list.deliveryMethods.priorityLevel.high'),
    },
    {
      value: PRIORITY_LEVEL.MEDIUM,
      label: t('cart.list.deliveryMethods.priorityLevel.medium'),
    },
    {
      value: PRIORITY_LEVEL.LOW,
      label: t('cart.list.deliveryMethods.priorityLevel.low'),
    },
  ];

  const deliveryMethods = [
    {
      value: SHIPPING_TYPE.BUS,
      label: t('cart.list.deliveryMethods.methods.bus'),
    },
    {
      value: SHIPPING_TYPE.DELIVER_3PARTY,
      label: t('cart.list.deliveryMethods.methods.deliver3Party'),
    },
    {
      value: SHIPPING_TYPE.PICK_UP_COUNTER,
      label: t('cart.list.deliveryMethods.methods.pickUpCount'),
    },
    {
      value: SHIPPING_TYPE.URBAN_COD,
      label: t('cart.list.deliveryMethods.methods.urbanNotCOD'),
    },
  ];

  const paymentMethod = [
    {
      value: PAYMENT_METHOD.Cash,
      label: t('cart.list.paymentMethods.cash'),
    },
    {
      value: PAYMENT_METHOD.CashAndDebt,
      label: t('cart.list.paymentMethods.cashAndDebit'),
    },
    {
      value: PAYMENT_METHOD.COD,
      label: t('cart.list.paymentMethods.COD'),
    },
    {
      value: PAYMENT_METHOD.Debt,
      label: t('cart.list.paymentMethods.debit'),
    },
  ];

  const columns = [
    {
      title: t('cart.productTitle.numberOrder'),
      render: (text, record, index) => index + 1,
    },
    {
      title: t('cart.productTitle.code'),
      dataIndex: ['product', 'code'],
    },
    {
      title: t('cart.productTitle.name'),
      dataIndex: ['product', 'name'],
    },
    {
      title: t('cart.productTitle.units'),
      render: () => <>Cái</>,
    },
    {
      title: t('cart.productTitle.warranty'),
      dataIndex: ['product', 'warranty'],
    },
    {
      title: t('cart.productTitle.exportedVAT'),
      dataIndex: 'vat',
      align: 'center',
      render: (_, record) => (
        <Checkbox
          defaultChecked={record?.vat}
          disabled={!record?.product?.vat}
          onChange={(e) => changeVatCartItems(e, record)}
        />
      ),
    },
    {
      title: t('cart.productTitle.debtByDay'),
      align: 'center',
      dataIndex: 'maxDaysOfDebt',
      render: (_, record) => (
        <InputNumber
          controls={false}
          min={0}
          max={99}
          defaultValue={record.maxDaysOfDebt}
          onChange={(value) => setMaxDaysOfDebt(value)}
          onBlur={() => {
            handleChangeMaxDebtCartItems(maxDaysOfDebt, record);
          }}
          onPressEnter={() => {
            handleChangeMaxDebtCartItems(maxDaysOfDebt, record);
          }}
        />
      ),
    },
    {
      title: t('cart.productTitle.inStock'),
      align: 'center',
      dataIndex: 'inStock',
      render: (_, record) => formatInStock(record.inStock),
    },
    {
      title: t('cart.productTitle.quantity'),
      dataIndex: 'quantity',
      render: (_, record) => <InputCounter record={record} cartID={id} refetch={refetch} />,
    },
    {
      title: t('cart.productTitle.unitPrice'),
      dataIndex: 'price',
      render: (_, record) => formatCurrency(record.price),
    },
    {
      title: t('cart.productTitle.total'),
      dataIndex: 'total',
      render: (_, record) => formatCurrency(record.total),
    },
    {
      title: '',
      render: (_, record) => {
        return (
          <CustomModal
            onOke={() => removedItemIDs(record?.id)}
            okeButtonLabel={t('common.confirm')}
            centered={true}
            title={t('cart.removedItemInCart')}
            footer={false}
            switchClose={switchClose}
            isBlockCloseOnOke
            customComponent={
              <Tooltip title={t('cart.removedItemInCart')}>
                <SvgIcon.TrashFullCartIcon />
              </Tooltip>
            }
          ></CustomModal>
        );
      },
    },
  ];

  const { handleUpdateCart } = useUpdateCart();

  const { warehouses } = useWarehouse();

  function handleAddProductToCartSuccess() {
    refetch();
  }

  const initCartInput = {
    note: data?.note,
    internalNote: data?.internalNote,
    promisedDeliverTime: data?.promisedDeliverTime,
    promisedDeliverDate: data?.promisedDeliverDate,
    fullStockRequired: data?.fullStockRequired,
    vatAllOrder: data?.vatAllOrder,
    shippingConfig: data?.shippingConfig,
    vatTaxIDNumber: data?.vatTaxIDNumber,
    vatCompanyName: data?.vatCompanyName,
    vatEmail: data?.vatEmail,
    vatAddress: data?.vatAddress,
    shippingFee: data?.shippingFee,
    serviceFee: data?.serviceFee,
    senderName: data?.sender?.fullName,
    senderPhone: data?.sender?.telephone,
    senderAddress: data?.sender?.address,
    exportedWarehouseID: data?.exportedWarehouse,
    shippingContactID: data?.shippingContact?.id,
    paymentMethod: data?.paymentMethod,
    shippingType: data?.shippingType,
    orderPriority: data?.orderPriority,
    discountAmount: data?.discountAmount,
    vat: data?.vat,
  };

  const changeVatCartItems = async (e, record) => {
    try {
      await handleCartItems(id, {
        id: record.id,
        quantity: record.quantity,
        vat: e.target.checked,
      });
      refetch();
    } catch (e) {
      notify.error({
        message: t('cart.changeVatCartItemsError'),
        description: e?.message,
      });
    }
  };

  const handleChangeMaxDebtCartItems = async (value, record) => {
    try {
      await handleCartItems(id, {
        id: record.id,
        quantity: record.quantity,
        vat: record.vat,
        maxDaysOfDebt: +value,
      });
      notify.success({
        message: t('cart.changeMaxDayOfDebtSuccess'),
      });
      refetch();
    } catch (e) {
      notify.error({
        message: t('cart.changeMaxDayOfDebtError'),
        description: e?.message,
      });
    }
  };

  const removedItemIDs = async (idItem) => {
    try {
      await handleRemovedItemIDs(id, idItem);
      notify.success({
        message: t('cart.removedItemInCartSuccess'),
      });
      setSwitchClose(!switchClose);
      refetch();
    } catch (e) {
      notify.error({
        message: t('cart.removedItemInCartError'),
        description: e?.message,
      });
    }
  };

  const onChangeSellerSuccess = () => {
    refetch();
    setChangeSellerModalVisible(false);
  };

  function toggleChangeSellerModalVisible() {
    setChangeSellerModalVisible(!changeSellerModalVisible);
  }

  async function handleCreateOrder() {
    setSubmitted(true);
    await globalForm.validateFields();
    handleToggleCreateOrderValidate();
  }

  // try to get form values, if submitted then validate all fields
  async function forceGetFormValues(form) {
    let values = null;
    if (submitted) {
      try {
        values = { ...(await form.validateFields()) };
      } catch (error) {
        setSubmitted(false);
      }
    }

    return values || { ...(await form.getFieldsValue(true)) };
  }

  async function handleUpdateCartOnFormChange() {
    const values = { ...(await forceGetFormValues(globalForm)) };
    const { shippingFee } = values;
    const promisedDeliverTime = getTimestampByDate(
      moment(values.promisedDeliverDate).format(DATE_FORMAT) +
        '' +
        moment(values.promisedDeliverTime).format(TIME_FORMAT)
    );

    unset(values, 'vat');
    unset(values, 'promisedDeliverDate');
    const findShippingConfig = shippingProvider.filter(
      (item) => item?.id === values?.shippingConfig?.deliver3PartyConfig?.id
    );

    unset(values, ['shippingConfig', 'deliver3PartyConfig', 'id']);
    try {
      await handleUpdateCart(id, {
        ...values,
        shippingFee: shippingFee ? +shippingFee : 0,
        orderPriority: values?.orderPriority || data?.orderPriority,
        promisedDeliverTime,
        senderName: data?.sender?.fullName,
        senderPhone: data?.sender?.telephone,
        senderAddress: data?.sender?.address,
        exportedWarehouseID: values.exportedWarehouseID,
        vatAllOrder: values?.vatAllOrder,
        shippingConfig: values.shippingConfig
          ? {
              ...values.shippingConfig,
              busConfig: {
                ...values.shippingConfig.busConfig,
                fee: values.shippingConfig?.busConfig?.fee || null,
              },
              urbanCODConfig: {
                fee: values.shippingConfig?.urbanCODConfig?.fee || null,
              },
              deliver3PartyConfig: {
                ...values.deliver3PartyConfig,
                name: findShippingConfig[0]?.name,
                weight: values.shippingConfig.deliver3PartyConfig?.weight || null,
                length: values.shippingConfig.deliver3PartyConfig?.length || null,
                width: values.shippingConfig.deliver3PartyConfig?.width || null,
                height: values.shippingConfig.deliver3PartyConfig?.height || null,
                serviceCode: findShippingConfig[0]?.serviceCode,
                fee: findShippingConfig[0]?.fee,
                customFeeEnabled: values.shippingConfig.deliver3PartyConfig.customFeeEnabled,
                customFee: values.shippingConfig.deliver3PartyConfig.customFee
                  ? values.shippingConfig.deliver3PartyConfig.customFee
                  : 0,
                providerID: findShippingConfig[0]?.providerID,
              },
            }
          : null,
        discountAmount: values?.discountAmount || data?.discountAmount,
        serviceFee: values?.serviceFee || data?.serviceFee,
      });
      refetch();
    } catch (err) {
      notify.error({
        message: t('cart.list.productTable.addProductFail'),
        description: err.message,
      });
    }
  }

  const createOrderMessage = (walletBalance, total, listProducts) => {
    let msg = {};
    if (walletBalance < total) {
      msg.overbalance = true;
    } else {
      msg.overbalance = false;
    }
    if (
      listProducts?.some(
        (product) => product.quantity > product.inStock || product.inStock === null
      )
    ) {
      msg.outOfStock = true;
    } else {
      msg.outOfStock = false;
    }
    if (listProducts) {
      msg.notHasProduct = false;
    } else {
      msg.notHasProduct = true;
    }
    return msg;
  };

  const validateMessage = createOrderMessage(
    data?.seller?.companyWalletBalance,
    data?.total,
    data?.listProducts
  );

  const handleToggleCreateOrderValidate = () => {
    setChangeCreateOrderModalVisible(!changeCreateOrderModalVisible);
  };

  const onCancelCreateOrder = () => {
    setChangeCreateOrderModalVisible(false);
  };

  const handleDisabledShippingUnit = () => {
    const deliver3PartyConfig = data?.shippingConfig.deliver3PartyConfig;
    if (
      deliver3PartyConfig?.weight &&
      deliver3PartyConfig?.length &&
      deliver3PartyConfig?.width &&
      deliver3PartyConfig?.height
    ) {
      return false;
    } else return true;
  };

  function initForm() {
    globalForm.setFieldsValue({
      ...initCartInput,
    });
  }

  const renderAlertPayment = () => {
    if (
      data?.paymentMethod === PAYMENT_METHOD.Cash &&
      data?.total > data?.seller?.companyWalletBalance
    ) {
      return { alert: t('cart.list.paymentMethods.cashAlert'), isAlert: false };
    }

    if (
      data?.paymentMethod === PAYMENT_METHOD.CashAndDebt &&
      data?.total > data?.seller?.companyWalletBalance + data?.seller?.debtLimit
    ) {
      return { alert: t('cart.list.paymentMethods.cashAndDebitAlert'), isAlert: false };
    }

    if (data?.paymentMethod === PAYMENT_METHOD.Debt && data?.seller?.companyWalletBalance > 0) {
      return { alert: t('cart.list.paymentMethods.debitAlert'), isAlert: false };
    }

    return { isAlert: true };
  };

  useEffect(() => {
    initForm();
  }, [JSON.stringify(data)]);

  useEffect(() => {
    const deliver3PartyConfig = data?.shippingConfig.deliver3PartyConfig;
    const shippingContact = data?.shippingContact;
    const sendingAddress = data?.sendingAddress;
    if (!handleDisabledShippingUnit()) {
      setShippingProviderQuery({
        height: deliver3PartyConfig?.height,
        length: deliver3PartyConfig?.length,
        width: deliver3PartyConfig?.width,
        weight: deliver3PartyConfig?.weight,
        fromCityId: sendingAddress?.cityID,
        fromDistrictId: sendingAddress?.districtID,
        fromWardId: sendingAddress?.wardID,
        toCityId: shippingContact.cityID,
        toDistrictId: shippingContact.districtID,
        toWardId: shippingContact?.wardID,
      });
    }
  }, [
    data?.shippingConfig?.deliver3PartyConfig?.weight,
    data?.shippingConfig?.deliver3PartyConfig?.length,
    data?.shippingConfig?.deliver3PartyConfig?.width,
    data?.shippingConfig?.deliver3PartyConfig?.height,
    handleDisabledShippingUnit(),
  ]);

  const isDisableInputVat = () => (!data?.vat ? true : false);

  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div>
          <div className="tools">
            <div>
              <CloneCartButton cartID={id} />

              <ExportFileButton id={id} action={EXPORT_FILE_ACTION.CART} />
            </div>

            <div>
              <SvgIcon.HelpCircleIcon />
              <b>{t('cart.list.tools.help')}</b>
            </div>
          </div>
          <div className="info-seller">
            <CustomCard>
              <div>
                <p>
                  <b>{data?.seller.fullName}</b> | {data?.seller.telephone}
                </p>
                <Tooltip title={t('cart.create.tooltipTitle')}>
                  <SvgIcon.EditCartIcon onClick={() => toggleChangeSellerModalVisible()} />
                </Tooltip>
                {changeSellerModalVisible && (
                  <CustomModalChangeSeller
                    action="changeSeller"
                    cartID={id}
                    defaultSeller={data?.seller}
                    onSubmitSuccess={onChangeSellerSuccess}
                    onCancel={() => {
                      setChangeSellerModalVisible(false);
                    }}
                  />
                )}
              </div>
              <p className="address">{data?.seller.address}</p>
            </CustomCard>
            <Form form={globalForm}>
              <FormInput
                type="SELECT"
                formItemOptions={{
                  label: `${t('cart.list.infoSeller.depot')}`,
                  name: 'exportedWarehouseID',
                }}
                inputOptions={{
                  onChange: handleUpdateCartOnFormChange,
                }}
                inputChildren={warehouses?.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    Kho {item.name}
                  </Select.Option>
                ))}
              />
            </Form>
          </div>
          <div className="info-product">
            <CustomCard title={t('cart.list.infoProduct.title')}>
              <CustomTable
                columns={columns}
                dataSource={data.listProducts}
                rowKey={(obj) => obj.id}
              />

              <div className="add-product-btn">
                <ProductTable
                  disableProductIDs={data?.listProducts?.map((item) => item?.product?.id)}
                  cartID={id}
                  onAddProductToCartSuccess={handleAddProductToCartSuccess}
                  warehouseID={data?.exportedWarehouse}
                  sellerID={data?.sellerID}
                />
              </div>

              <div className="total-order">
                <b className="title">{t('cart.list.infoProduct.totalOrder.title')}</b>
                <b className="quantity">{data?.totalProduct}</b>
                <b className="price">{formatCurrency(data?.temporaryTotal)}</b>
              </div>
            </CustomCard>
          </div>
          <div className="info-order">
            <CustomCard
              title={
                <>
                  {t('cart.list.infoOrder.title.infoSender')}
                  <CustomModalChangeAddress
                    cartID={id}
                    data={data?.allSenders}
                    id={data?.sender?.id}
                    initCartInput={initCartInput}
                    refetch={refetch}
                    type="SENDERS"
                  />
                </>
              }
            >
              <div>
                <Avatar size="large" icon={<UserOutlined />} />
              </div>
              <div>
                <p className="info-user">
                  <b>{data?.sender?.fullName}</b> | {data?.sender?.telephone}
                </p>
                <p className="address">{data?.sender.address}</p>
              </div>
            </CustomCard>
            <CustomCard
              title={
                <>
                  {t('cart.list.infoOrder.title.infoRecieve')}
                  <CustomModalChangeAddress
                    cartID={id}
                    data={sellers}
                    id={data?.shippingContact?.id}
                    initCartInput={initCartInput}
                    refetch={refetch}
                    type="SELLERS"
                  />
                </>
              }
            >
              <div>
                <Avatar size="large" icon={<UserOutlined />} />
              </div>
              <div>
                <p className="info-user">
                  <b>{data?.shippingContact?.fullName}</b> | {data?.shippingContact?.telephone}
                </p>
                <p className="address">{data?.shippingContact?.address}</p>
              </div>
            </CustomCard>
          </div>

          <Form form={globalForm}>
            <div className="description">
              <CustomCard title={t('cart.list.description.title')}>
                <div className="description-content">
                  <FormInput
                    formItemOptions={{
                      label: `${t('cart.list.description.form.internalNotes.label')}`,
                      name: 'internalNote',
                    }}
                    inputOptions={{
                      placeholder: t('cart.list.description.form.internalNotes.placeholder'),
                      onBlur: handleUpdateCartOnFormChange,
                    }}
                    type="TEXT_AREA"
                  />
                  <FormInput
                    formItemOptions={{
                      label: `${t('cart.list.description.form.orderNotes.label')}`,
                      name: 'note',
                    }}
                    inputOptions={{
                      placeholder: t('cart.list.description.form.orderNotes.placeholder'),
                      onBlur: handleUpdateCartOnFormChange,
                    }}
                    type="TEXT_AREA"
                  />
                </div>
              </CustomCard>
            </div>

            <div className="delivery-methods">
              <CustomCard title={t('cart.list.deliveryMethods.title')}>
                <FormInput
                  type="RADIO_GROUP"
                  formItemOptions={{
                    name: 'shippingType',
                  }}
                  inputOptions={{
                    options: deliveryMethods,
                    onChange: handleUpdateCartOnFormChange,
                  }}
                />
                <CustomFormDeliveryMethod
                  method={data?.shippingType}
                  onFormChange={handleUpdateCartOnFormChange}
                  isDisabledShippingUnit={handleDisabledShippingUnit()}
                  shippingProvider={shippingProvider}
                  isEditShippingFee={data?.shippingConfig?.deliver3PartyConfig?.customFeeEnabled}
                  fee={data?.shippingConfig?.deliver3PartyConfig?.fee}
                  customFee={data?.shippingConfig?.deliver3PartyConfig?.customFee}
                />
              </CustomCard>

              <div className="setting-other-payment-methods">
                <CustomCard title={t('cart.list.settingOther.title')} className="setting-other">
                  <div className="priority-level">
                    <p>{t('cart.list.deliveryMethods.priorityLevel.title')}</p>
                    <FormInput
                      type="RADIO_GROUP"
                      formItemOptions={{
                        name: 'orderPriority',
                      }}
                      inputOptions={{
                        options: priorityLevel,
                        onChange: handleUpdateCartOnFormChange,
                      }}
                    />
                  </div>
                  <div className="form-vertical delivery-deadline">
                    <div>{t('cart.list.deliveryMethods.deliveryDeadline.title')}</div>
                    <FormInput
                      formItemOptions={{
                        name: 'promisedDeliverTime',
                      }}
                      inputOptions={{
                        placeholder: t(
                          'cart.list.deliveryMethods.deliveryDeadline.form.hour.placeholder'
                        ),
                        onOk: handleUpdateCartOnFormChange,
                        format: 'HH:mm',
                        // defaultValue: moment('10:10:24', TIME_FORMAT),
                      }}
                      type="TIME_PICKER"
                    />
                    <FormInput
                      formItemOptions={{
                        name: 'promisedDeliverDate',
                      }}
                      inputOptions={{
                        placeholder: t(
                          'cart.list.deliveryMethods.deliveryDeadline.form.day.placeholder'
                        ),
                        onChange: handleUpdateCartOnFormChange,
                        format: DATE_FORMAT,
                      }}
                      type="DATE_PICKER"
                    />
                  </div>
                  <div className="switch">
                    <FormInput
                      type="SWITCH"
                      formItemOptions={{
                        label: t('cart.list.deliveryMethods.switch.label'),
                        name: 'fullStockRequired',
                        valuePropName: 'checked',
                        initialValue: data?.fullStockRequired,
                      }}
                      inputOptions={{
                        onChange: handleUpdateCartOnFormChange,
                      }}
                    />
                    <Tooltip
                      title={t('cart.list.deliveryMethods.deliveryDeadline.tooltip.title')}
                      color="#5B6673"
                      placement="bottom"
                    >
                      <SvgIcon.InfoCircleIcon />
                    </Tooltip>
                  </div>
                </CustomCard>

                <CustomCard title={t('cart.list.paymentMethods.title')} className="payment-methods">
                  <FormInput
                    type="RADIO_GROUP"
                    formItemOptions={{
                      name: 'paymentMethod',
                    }}
                    inputOptions={{
                      options: paymentMethod,
                      onChange: handleUpdateCartOnFormChange,
                    }}
                  />
                  <div className="wallet">
                    <p>{t('cart.wallet')}</p>
                    <p className="money">{formatCurrency(data?.seller?.companyWalletBalance)}</p>
                  </div>
                  <div className="debt-limit">
                    <p>{t('cart.debtLimit')}</p>
                    <p className="money">{formatCurrency(data?.seller?.debtLimit)}</p>
                  </div>
                  {renderAlertPayment().isAlert ? (
                    <></>
                  ) : (
                    <p className="alert">{renderAlertPayment().alert}</p>
                  )}
                </CustomCard>
              </div>
            </div>

            <div className="vat-bill">
              <CustomCard title={t('cart.list.vatBill.vat.title')} className="vat">
                <div className="export-vat">
                  <FormInput
                    type="SWITCH"
                    formItemOptions={{
                      label: t('cart.list.vatBill.vat.exportVat.form.exportVat.label'),
                      name: 'vat',
                      valuePropName: 'checked',
                      initialValue: data?.fullStockRequired,
                    }}
                    inputOptions={{
                      disabled: true,
                    }}
                  />
                  <FormInput
                    type="CHECK_BOX"
                    formItemOptions={{
                      label: t('cart.list.vatBill.vat.exportVat.form.exportVatAll.label'),
                      name: 'vatAllOrder',
                      valuePropName: 'checked',
                    }}
                    inputOptions={{
                      onChange: handleUpdateCartOnFormChange,
                    }}
                  />
                </div>
                <div className="description-vat">
                  <FormInput
                    formItemOptions={{
                      label: `${t('cart.list.vatBill.vat.descriptionVat.form.taxCode.label')}`,
                      name: 'vatTaxIDNumber',
                    }}
                    inputOptions={{
                      placeholder: t(
                        'cart.list.vatBill.vat.descriptionVat.form.taxCode.placeholder'
                      ),
                      onBlur: handleUpdateCartOnFormChange,
                      disabled: isDisableInputVat(),
                    }}
                  />
                  <FormInput
                    formItemOptions={{
                      label: `${t('cart.list.vatBill.vat.descriptionVat.form.nameCompany.label')}`,
                      name: 'vatCompanyName',
                    }}
                    inputOptions={{
                      placeholder: t(
                        'cart.list.vatBill.vat.descriptionVat.form.nameCompany.placeholder'
                      ),
                      onBlur: handleUpdateCartOnFormChange,
                      disabled: isDisableInputVat(),
                    }}
                  />
                  <FormInput
                    formItemOptions={{
                      label: `${t('cart.list.vatBill.vat.descriptionVat.form.email.label')}`,
                      name: 'vatEmail',
                    }}
                    inputOptions={{
                      placeholder: t(
                        'cart.list.vatBill.vat.descriptionVat.form.nameCompany.placeholder'
                      ),
                      onBlur: handleUpdateCartOnFormChange,
                      disabled: isDisableInputVat(),
                    }}
                  />

                  <FormInput
                    formItemOptions={{
                      label: `${t('cart.list.vatBill.vat.descriptionVat.form.address.label')}`,
                      name: 'vatAddress',
                    }}
                    inputOptions={{
                      placeholder: t(
                        'cart.list.vatBill.vat.descriptionVat.form.nameCompany.placeholder'
                      ),
                      onBlur: handleUpdateCartOnFormChange,
                      disabled: isDisableInputVat(),
                    }}
                  />
                </div>
              </CustomCard>

              <CustomCard title={t('cart.list.vatBill.bill.title')} className="bill">
                <div className="title">
                  <p>{t('cart.list.vatBill.bill.field.totalAmount')}</p>

                  <p>{t('cart.list.vatBill.bill.field.transportFee')}</p>
                  <p>{t('cart.list.vatBill.bill.field.serviceCharge')}</p>
                  <p>{t('cart.list.vatBill.bill.field.discount')}</p>
                  <p>{t('cart.list.vatBill.bill.field.totalPayment')}</p>
                  <Divider />
                  <p>{t('cart.list.vatBill.bill.field.paymentByCash')}</p>
                  <p>{t('cart.list.vatBill.bill.field.paymentByDebit')}</p>
                </div>
                <div className="price">
                  <p>{formatCurrency(data?.temporaryTotal)}</p>
                  <p>{formatCurrency(data?.shippingFee)}</p>
                  {isEditServiceFee ? (
                    <div className="form-control">
                      <FormInput
                        type="NUMBER"
                        formItemOptions={{
                          name: 'serviceFee',
                        }}
                        inputOptions={{
                          controls: false,
                          maxLength: 50,
                          formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
                          parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
                        }}
                      />
                      <Space>
                        <SvgIcon.SuccessIcon
                          onClick={() => {
                            handleUpdateCartOnFormChange().then(() => {
                              setIsEditServiceFee(false);
                            });
                          }}
                        />
                        <SvgIcon.CloseIcon onClick={() => setIsEditServiceFee(false)} />
                      </Space>
                    </div>
                  ) : (
                    <p>
                      {formatCurrency(data?.serviceFee)}
                      <SvgIcon.EditCartIcon onClick={() => setIsEditServiceFee(true)} />
                    </p>
                  )}
                  {isEditDiscount ? (
                    <div className="form-control">
                      <FormInput
                        type="NUMBER"
                        formItemOptions={{
                          name: 'discountAmount',
                        }}
                        inputOptions={{
                          controls: false,
                          maxLength: 50,
                          formatter: (value) => value.replace(REGEX.CURRENCY, '.'),
                          parser: (value) => value.replace(REGEX.CURRENCY_PARSER, ''),
                        }}
                      />
                      <Space>
                        <SvgIcon.SuccessIcon
                          onClick={() => {
                            handleUpdateCartOnFormChange().then(() => {
                              setIsEditDiscount(false);
                            });
                          }}
                        />
                        <SvgIcon.CloseIcon onClick={() => setIsEditDiscount(false)} />
                      </Space>
                    </div>
                  ) : (
                    <p>
                      {formatCurrency(data?.discountAmount)}
                      <SvgIcon.EditCartIcon onClick={() => setIsEditDiscount(true)} />
                    </p>
                  )}

                  <p className="total">{formatCurrency(data?.total)}</p>
                  <Divider />
                  <p>{formatCurrency(data?.paymentByCash)}</p>
                  <p>{formatCurrency(data?.paymentByDebit)}</p>
                </div>
              </CustomCard>
            </div>
          </Form>
          {canCreateOrder && (
            <div className="create-order">
              <Button className="btn-create-order" onClick={handleCreateOrder}>
                {t('cart.createOrder')}
              </Button>
              {changeCreateOrderModalVisible && (
                <CustomModalCreateOrder
                  cartID={id}
                  visible={changeCreateOrderModalVisible}
                  onCancelCreateOrder={onCancelCreateOrder}
                  cartValidations={validateMessage}
                />
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default CustomTabPane;
