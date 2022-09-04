import { Button, Avatar, Table, Checkbox, Image } from 'antd';
import React, { useState } from 'react';
import OrderStatus from './components/OrderStatus';
import { UserOutlined, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import './index.scss';
import CustomTable from 'components/CustomTable';
import { useTranslation } from 'react-i18next';
import {
  useApproveStock,
  useConfirmExportOrder,
  useConfirmPayment,
  useDenyStock,
  useGetOrderDetail,
  useOrderPermissions,
  useWaitingStock,
} from 'hooks/order';
import { STOCK_STATUS, SHIPPING_TYPE, EXPORT_FILE_ACTION } from 'config/constants';
import { formatDateTime } from 'utils/dateTime';
import useColumnsOrder from '../List/components/ColumnsOrder';
import { formatCurrency, notify, formatInStock } from 'utils/helperFuncs';
import { useOrder } from '../hooks';
import { SvgIcon } from 'assets/icons';
import Spinner from 'components/Spinner';
import { useParams } from 'react-router-dom';
import CustomModalWarning from '../List/components/CustomModalWarning';
import { STATUS_ORDER } from 'config/constants';
import CustomModalCancelOrder from '../List/components/CustomModalCancelOrder';
import CustomModalDeliverySuccess from '../List/components/CustomModalDeliverySuccess';
import CustomModalSelectShipper from '../List/components/CustomModalSelectShipper';
import { useGetUserPermissions } from 'hooks/user/user';
import Page403 from 'pages/PageError/403';
import { WARNING_MODAL_ACTION } from '../conts';
import ExportFileButton from 'components/ExportFileButton';

const TableSummary = ({ quantity, total }) => {
  const { Cell, Row } = Table.Summary;
  const { t } = useTranslation();
  return (
    <>
      <Row
        style={{
          backgroundColor: '#E7F0FF',
        }}
      >
        <Cell />
        <Cell>
          <b>{t('order.orderDetail.provisionalTotal')}</b>
        </Cell>
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell />
        <Cell>
          <b>{quantity}</b>
        </Cell>
        <Cell />
        <Cell>
          <b
            style={{
              color: '#2246DC',
            }}
          >
            {total}
          </b>
        </Cell>
      </Row>
    </>
  );
};

const OrderDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const { order, loading } = useGetOrderDetail({ id });
  const { renderShippingMethod, renderOrderPriority, renderPaymentMethod } = useColumnsOrder();
  const { convertOrderStatus, convertOrderPriority } = useOrder();
  const [openModalWarning, setOpenModalWarning] = useState(false);
  const [openModalCancelOrder, setOpenModalCancelOrder] = useState(false);
  const [openModalDeliverySuccess, setOpenModalDeliverySuccess] = useState(false);
  const [openModalWarningWaitingStock, setOpenModalWarningWaitingStock] = useState(false);

  const { handleApproveStock } = useApproveStock();
  const { handleConfirmPayment } = useConfirmPayment();
  const { handleConfirmExportOrder } = useConfirmExportOrder();
  const { handleWaitingStock } = useWaitingStock();
  const { handleDenyStock } = useDenyStock();
  const { loading: loadUserPermissions } = useGetUserPermissions();
  const {
    canViewOrder,
    canApproveStock,
    canWaitStock,
    canDenyStock,
    canConfirmPayment,
    canAssignShipper,
    canCancelOrder,
    canCompleteOrder,
    canExportStock,
  } = useOrderPermissions();

  const orderDetail = {
    orderCode: '#' + (order?.number || ''),
    orderStatus: convertOrderStatus(order?.status)?.title,
    sellerName: t('seller.seller') + ' ' + (order?.seller?.shortName || ''),
    sellerPhone: order?.seller?.telephone,
    sellerAddress: order?.seller?.address,
    senderName: order?.senderName,
    senderPhone: order?.senderPhone,
    senderAddress: order?.senderAddress,
    note: order?.note,
    internalNote: order?.internalNote,
    receiverName: order?.receiverContactName,
    receiverPhone: order?.receiverContactPhone,
    receiverAddress: order?.receiverContactAddress,
    processingPriority: renderOrderPriority(order?.orderPriority),
    deliveryDeadline: formatDateTime(order?.promisedDeliverTime),
    allowToOrder: order?.fullStockRequired,
    shippingMethod: renderShippingMethod(order?.shippingType),
    busName: order?.shippingConfiguration?.busConfig?.busName,
    busPhone: order?.shippingConfiguration?.busConfig?.telephone,
    parkedAt: order?.shippingConfiguration?.busConfig?.location,
    busStation: order?.shippingConfiguration?.busConfig?.busStation,
    providerName: order?.shippingConfiguration?.deliver3PartyConfig?.name,
    paymentByVirtualWallet: formatCurrency(order?.cashPayment),
    virtualWalletBalance: formatCurrency(order?.seller?.companyWallet?.balance),
    paymentByDebt: formatCurrency(order?.debtPayment),
    debtLimit: formatCurrency(order?.seller?.debtLimit),
    availabilityLimit: formatCurrency(order?.seller?.availabilityLimit),
    exportVat: order?.vat,
    exportVatForAllOrders: order?.vatAllOrder,
    vatTaxIDNumber: order?.vatTaxIDNumber,
    vatCompanyName: order?.vatCompanyName,
    vatEmail: order?.vatEmail,
    vatAddress: order?.vatAddress,
    taxCode: order?.seller?.vatInfo?.taxIDNumber,
    companyName: order?.seller?.vatInfo?.businessName,
    companyEmail: order?.seller?.vatInfo?.email,
    companyAddress: order?.seller?.vatInfo?.address,
    subTotal: formatCurrency(order?.subTotal),
    shippingFee: formatCurrency(order?.shippingFee),
    serviceFee: formatCurrency(order?.serviceFee),
    discount: formatCurrency(order?.discount),
    totalPayment: formatCurrency(order?.total),
    paymentByCashOrBankTransfer: formatCurrency(order?.cashPayment),
    totalPaymentByDebt: formatCurrency(order?.debtPayment),
    paymentMethod: renderPaymentMethod(order?.paymentMethod),
    fileURLs: order?.fileURLs || [],
  };

  const columns = [
    {
      title: t('common.index'),
      dataIndex: 'id',
    },
    {
      title: t('order.orderDetail.productCode'),
      dataIndex: 'productCode',
    },
    {
      title: t('order.orderDetail.parameter'),
      dataIndex: 'productName',
    },
    {
      title: t('order.orderDetail.unit'),
      dataIndex: ['product', 'uom', 'name'],
    },
    {
      title: t('order.orderDetail.warranty'),
      dataIndex: 'productWarranty',
      render: (_, record) => record?.productWarranty || '- -',
    },
    {
      title: t('order.orderDetail.vatExport'),
      dataIndex: '6',
      render: (_, record) => (record.vat ? <SvgIcon.SuccessIcon /> : <SvgIcon.ErrorIcon />),
    },
    {
      title: t('order.orderDetail.inDebt'),
      dataIndex: 'maxDaysOfDebt',
      render: (_, record) => record?.maxDaysOfDebt || '- -',
    },
    {
      title: t('order.orderDetail.inventory'),
      dataIndex: 'inStock',
      render: (_, record) => formatInStock(record?.inStock),
    },
    {
      title: t('order.orderDetail.quantity'),
      dataIndex: 'quantity',
    },
    {
      title: t('order.orderDetail.unitPrice'),
      dataIndex: 'price',
      render: (_, record) => formatCurrency(record?.price),
    },
    {
      title: t('order.orderDetail.intoMoney'),
      dataIndex: 'total',
      render: (_, record) => formatCurrency(record?.total),
    },
  ];

  const handleApproval = async () => {
    const orderIDs = order ? [order.id] : [];
    if (order.stockStatus !== STOCK_STATUS.FULL) {
      setOpenModalWarning(true);
    } else {
      await handleApproveStock({
        orderIDs: orderIDs,
      })
        .then(() => {
          notify.success({
            message: t('order.orderList.approvedEnoughStockSuccess'),
          });
        })
        .catch((error) => {
          notify.error({
            message: t('order.orderList.approvedEnoughStockError'),
            description: error.message,
          });
        });
    }
  };

  const handlePaymentApproval = async () => {
    const orderIDs = order ? [order.id] : [];
    await handleConfirmPayment({
      orderIDs: orderIDs,
    })
      .then(() => {
        notify.success({
          message: t('order.orderDetail.paymentApprovalSuccess'),
        });
      })
      .catch((error) => {
        notify.error({
          message: t('order.orderDetail.paymentApprovalError'),
          description: error.message,
        });
      });
  };

  const handleToggleCancelOrderModal = () => {
    setOpenModalCancelOrder(!openModalCancelOrder);
  };

  const handleToggleModalDeliverySuccess = () => {
    setOpenModalDeliverySuccess(!openModalDeliverySuccess);
  };

  const handleExportConfirm = async () => {
    const checkedKeyList = order ? [order.id] : [];
    if (checkedKeyList?.length === 0) {
      notify.error({
        message: t('order.orderList.selectOrderValidate'),
      });
    } else {
      await handleConfirmExportOrder({
        orderIDs: checkedKeyList,
      }).then(() => {
        notify.success({
          message: t('order.orderList.exportingSuccess'),
        });
      });
    }
  };

  const handleWaitingForStock = async () => {
    const orderIDs = order ? [order.id] : [];
    if (order.stockStatus === STOCK_STATUS.FULL) {
      setOpenModalWarningWaitingStock(true);
    } else {
      await handleWaitingStock({
        orderIDs: orderIDs,
      })
        .then(() => {
          notify.success({
            message: t('order.orderList.waitingForStockSuccess'),
          });
        })
        .catch((error) => {
          notify.error({
            message: t('order.orderList.waitingForStockError'),
            description: error.message,
          });
        });
    }
  };

  const handleDenyOrder = async () => {
    const orderIDs = order ? [order.id] : [];
    if (order.stockStatus === STOCK_STATUS.FULL) {
      setOpenModalWarningWaitingStock(true);
    } else {
      await handleDenyStock({
        orderIDs: orderIDs,
      })
        .then(() => {
          notify.success({
            message: t('order.orderList.denyStockSuccess'),
          });
        })
        .catch((error) => {
          notify.error({
            message: t('order.orderList.denyStockError'),
            description: error.message,
          });
        });
    }
  };

  const handleConfirmStock = async () => {
    const orderIDs = order ? [order.id] : [];
    if (order.stockStatus !== STOCK_STATUS.FULL) {
      setOpenModalWarning(true);
    } else {
      await handleApproveStock({
        orderIDs: orderIDs,
      })
        .then(() => {
          notify.success({
            message: t('order.orderList.confirmStockSuccess'),
          });
        })
        .catch((error) => {
          notify.error({
            message: t('order.orderList.confirmStockError'),
            description: error.message,
          });
        });
    }
  };

  const renderButtons = () => {
    switch (order?.status) {
      case STATUS_ORDER.WAITING_FOR_APPROVAL:
        return (
          <>
            {canCancelOrder && (
              <>
                <Button onClick={handleToggleCancelOrderModal}>
                  {t('order.orderDetail.cancelBtn')}
                </Button>
                {openModalCancelOrder && (
                  <CustomModalCancelOrder
                    setOpenModalCancelOrder={setOpenModalCancelOrder}
                    orderIDs={order ? [order.id] : []}
                  />
                )}
              </>
            )}
            {canWaitStock && (
              <>
                <Button onClick={handleWaitingForStock}>
                  {t('order.orderDetail.waitingForEnoughStock')}
                </Button>
                {openModalWarningWaitingStock && (
                  <CustomModalWarning
                    openModalWarning={openModalWarningWaitingStock}
                    setOpenModalWarning={setOpenModalWarningWaitingStock}
                    orderIDs={order ? [order.id] : []}
                    action={WARNING_MODAL_ACTION.WAITING_STOCK_DETAIL}
                  />
                )}
              </>
            )}
            {canApproveStock && (
              <>
                <Button type="primary" onClick={handleApproval}>
                  {t('order.orderDetail.approveBtn')}
                </Button>
                {openModalWarning && (
                  <CustomModalWarning
                    openModalWarning={openModalWarning}
                    setOpenModalWarning={setOpenModalWarning}
                    orderIDs={order ? [order.id] : []}
                    action={WARNING_MODAL_ACTION.APPROVAL_STOCK_DETAIL}
                  />
                )}
              </>
            )}
          </>
        );
      case STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK:
        return (
          <>
            {canDenyStock && (
              <>
                <Button onClick={handleDenyOrder}>{t('order.orderDetail.unableToImport')}</Button>
                {openModalWarningWaitingStock && (
                  <CustomModalWarning
                    openModalWarning={openModalWarningWaitingStock}
                    setOpenModalWarning={setOpenModalWarningWaitingStock}
                    orderIDs={order ? [order.id] : []}
                    action={WARNING_MODAL_ACTION.DENY_STOCK_DETAIL}
                  />
                )}
              </>
            )}
            {canApproveStock && (
              <>
                <Button type="primary" onClick={handleConfirmStock}>
                  {t('order.orderDetail.sufficientConfirmation')}
                </Button>
                {openModalWarning && (
                  <CustomModalWarning
                    openModalWarning={openModalWarning}
                    setOpenModalWarning={setOpenModalWarning}
                    orderIDs={order ? [order.id] : []}
                    action={WARNING_MODAL_ACTION.CONFIRM_STOCK_DETAIL}
                  />
                )}
              </>
            )}
          </>
        );
      case STATUS_ORDER.WAITING_FOR_PAYMENT:
        return (
          <>
            {canCancelOrder && (
              <>
                <Button onClick={handleToggleCancelOrderModal}>
                  {t('order.orderDetail.cancelBtn')}
                </Button>
                {openModalCancelOrder && (
                  <CustomModalCancelOrder
                    setOpenModalCancelOrder={setOpenModalCancelOrder}
                    orderIDs={order ? [order.id] : []}
                  />
                )}
              </>
            )}
            {canConfirmPayment && (
              <Button type="primary" onClick={handlePaymentApproval}>
                {t('order.orderDetail.approvedPayment')}
              </Button>
            )}
          </>
        );
      case STATUS_ORDER.WAITING_FOR_EXPORTING:
        return (
          <>
            {canExportStock && (
              <Button type="primary" onClick={handleExportConfirm}>
                {t('order.orderDetail.exportConfirmation')}
              </Button>
            )}
          </>
        );
      case STATUS_ORDER.WAITING_FOR_SHIPPING:
        return (
          <>
            {canAssignShipper && (
              <>
                <Button>{t('order.orderDetail.unitDelivery')}</Button>
                <CustomModalSelectShipper
                  buttonLabel={t('order.orderDetail.HongAnhDelivery')}
                  checkedKeyList={order.id}
                />
              </>
            )}
          </>
        );
      case STATUS_ORDER.DELIVERING:
        return (
          <>
            {canCompleteOrder && (
              <>
                <Button type="primary" onClick={handleToggleModalDeliverySuccess}>
                  {t('order.orderDetail.successfulDelivery')}
                </Button>
                {openModalDeliverySuccess && (
                  <CustomModalDeliverySuccess
                    setOpenModalDeliverySuccess={setOpenModalDeliverySuccess}
                    orderID={order.id}
                  />
                )}
              </>
            )}
          </>
        );
      case STATUS_ORDER.COMPLETED:
        return (
          <>
            <Button type="primary">{t('order.orderDetail.recreateCart')}</Button>
          </>
        );
      case STATUS_ORDER.CANCELED:
        return (
          <>
            <Button type="primary">{t('order.orderDetail.recreateCart')}</Button>
          </>
        );
    }
  };

  return (
    <>
      {loadUserPermissions ? (
        <Spinner loading={loading} />
      ) : canViewOrder ? (
        <div className="order-detail-container">
          <Spinner loading={loading} />
          <div className="tools">
            <div>
              <ExportFileButton id={order?.id} action={EXPORT_FILE_ACTION.ORDER} />
              <div>
                <SvgIcon.PrinterIcon />
                <b>{t('order.orderDetail.printOrder')}</b>
              </div>
            </div>

            <div>
              <SvgIcon.HelpCircleIcon />
              <b>{t('common.help')}</b>
            </div>
          </div>
          <OrderStatus
            events={order?.fullEvents?.map((item) => ({
              ...item,
              createdAt: item?.createdAt ? formatDateTime(item?.createdAt) : '',
              createdBy: item?.createdBy?.fullname,
            }))}
          />
          <div className="btn-group">
            <div className="order-info">
              <p className="order-info-label">{t('order.orderDetail.orderCode')}</p>
              <p className="order-info-value">{orderDetail.orderCode}</p>
              <p className="order-info-label">{t('order.orderDetail.orderStatus')}</p>
              <p className="order-info-value">{orderDetail.orderStatus}</p>
            </div>

            <div className="seller-info">
              <p className="seller-name">
                {orderDetail.sellerName} | {orderDetail.sellerPhone}
              </p>
              <p>{orderDetail.sellerAddress || '- -'}</p>
            </div>

            <div className="buttons">{renderButtons()}</div>
          </div>

          <div className="product-table">
            <p className="card-title">{t('order.orderDetail.productInfo')}</p>
            <CustomTable
              dataSource={order?.items}
              columns={columns}
              summary={() =>
                TableSummary({
                  quantity: order?.totalProduct,
                  total: formatCurrency(order?.subTotal),
                })
              }
              scroll={{ x: 800, y: null }}
            />
          </div>

          <div className="order-common-info">
            <div className="sender-info card">
              <p className="card-title">{t('order.orderDetail.senderInfo')}</p>

              <div className="sender-info">
                <Avatar className="avatar" icon={<UserOutlined />} />
                <div className="sender-name">
                  <p>
                    {orderDetail.senderName} | {orderDetail.senderPhone}
                  </p>
                  <p>{orderDetail.senderAddress}</p>
                </div>
              </div>
            </div>

            <div className="note card">
              <p className="card-title">{t('order.orderDetail.note')}</p>
              <div className="note-content">
                <p className="label">{t('order.orderDetail.internalNote')}:</p>
                <p className="value">{orderDetail.internalNote || '- -'}</p>
                <p className="label">{t('order.orderDetail.orderNote')}:</p>
                <p className="value">{orderDetail.note || '- -'}</p>
              </div>
            </div>

            <div className="sender-info card">
              <p className="card-title">{t('order.orderDetail.receiverInfo')}</p>

              <div className="sender-info">
                <Avatar className="avatar" icon={<UserOutlined />} />
                <div className="sender-name">
                  <p>
                    {orderDetail.receiverName} | {orderDetail.receiverPhone}
                  </p>
                  <p>{orderDetail.receiverAddress}</p>
                </div>
              </div>
            </div>

            <div className="other-setting card">
              <p className="card-title">{t('order.orderDetail.anotherSetting')}</p>

              <div className="setting-content">
                <p className="title">
                  {t('order.orderDetail.processingPriority')}:
                  <span>{orderDetail.processingPriority}</span>
                </p>
                <p className="title">
                  {t('order.orderDetail.deliveryDeadline')}:{' '}
                  <span>{orderDetail.deliveryDeadline}</span>
                </p>
              </div>

              <p className="allow-shipping">
                {orderDetail.allowToOrder ? (
                  <CheckCircleFilled className="checkIcon" />
                ) : (
                  <CloseCircleFilled className="closeIcon" />
                )}
                {t('order.orderDetail.allowToOrder')}
              </p>
            </div>
          </div>

          <div
            className={`bill-payment ${orderDetail.exportVat ? 'export-vat' : 'not-export-vat'}`}
          >
            <div className="pay-method card">
              <p className="card-title">
                {t('order.orderDetail.paymentMethod')}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style={{ color: '#052987', fontWeight: '400' }}>
                  {orderDetail.paymentMethod}
                </span>
              </p>
              <div className="pay-method-content">
                <p className="label">{t('order.orderDetail.paymentByVirtualWallet')}:</p>
                <p className="value">{orderDetail.paymentByVirtualWallet}</p>
                <p className="label">{t('order.orderDetail.virtualWalletBalance')}:</p>
                <p className="value">{orderDetail.virtualWalletBalance}</p>

                <p className="label">{t('order.orderDetail.paymentByDebt')}:</p>
                <p className="value">{orderDetail.paymentByDebt}</p>
                <p className="label">{t('order.orderDetail.debtLimit')}:</p>
                <p className="value">{orderDetail.debtLimit}</p>

                <p></p>
                <p></p>
                <p className="label">{t('order.orderDetail.availabilityLimit')}:</p>
                <p className="value availability-limit">{orderDetail.availabilityLimit}</p>
                <p></p>
                <p></p>
                <p className="label not-enough">
                  {t('order.orderDetail.availabilityLimitIsNotEnough')}
                </p>
              </div>
            </div>

            <div className="shipping-method card">
              <p className="card-title">{t('order.orderDetail.shippingMethod')}</p>
              <div className="shipping-method-by">
                <p>{t('order.orderDetail.shippingBy')}:</p>
                <p>{orderDetail.shippingMethod}</p>
              </div>
              {order?.shippingType === SHIPPING_TYPE.BUS && (
                <div className="bus-info">
                  <p className="label">{t('order.orderDetail.busName')}:</p>
                  <p className="value">{orderDetail.busName}</p>
                  <p className="label">{t('order.orderDetail.busPhone')}:</p>
                  <p className="value">{orderDetail.busPhone}</p>
                  <p className="label">{t('order.orderDetail.parkedAt')}:</p>
                  <p className="value">{orderDetail.parkedAt || '- -'}</p>
                  <p className="label">{t('order.orderDetail.busStation')}:</p>
                  <p className="value">{orderDetail.busStation || '- -'}</p>
                </div>
              )}
              {order?.shippingType === SHIPPING_TYPE.DELIVER_3PARTY && (
                <div className="bus-info">
                  <p className="label">{t('order.orderDetail.providerName')}:</p>
                  <p className="value">{orderDetail.providerName || '- -'}</p>
                </div>
              )}
            </div>

            <div className="vat-info card">
              <p className="card-title">{t('order.orderDetail.exportVatBill')}</p>

              <div className="vat-export">
                <p>
                  {orderDetail.exportVat ? (
                    <CheckCircleFilled className="checkIcon" />
                  ) : (
                    <CloseCircleFilled className="closeIcon" />
                  )}
                  {t('order.orderDetail.exportVat')}
                </p>

                {orderDetail.exportVat && (
                  <p>
                    {orderDetail.exportVatForAllOrders ? (
                      <CheckCircleFilled className="checkIcon" />
                    ) : (
                      <CloseCircleFilled className="closeIcon" />
                    )}
                    {t('order.orderDetail.exportVatForAllOrders')}
                  </p>
                )}
              </div>

              {orderDetail.exportVat && (
                <div className="vat-content">
                  <p>{t('order.orderDetail.taxCode')}:</p>
                  <p>{orderDetail.vatTaxIDNumber || '- -'}</p>
                  <p>{t('order.orderDetail.companyName')}:</p>
                  <p>{orderDetail.vatCompanyName || '- -'}</p>
                  <p>{t('order.orderDetail.companyEmail')}:</p>
                  <p>{orderDetail.vatEmail || '- -'}</p>
                  <p>{t('order.orderDetail.billAddress')}:</p>
                  <p>{orderDetail.vatAddress || '- -'}</p>
                </div>
              )}
            </div>

            <div className="bill-info card">
              <p className="card-title">{t('order.orderDetail.bill')}</p>

              <div className="bill-content">
                <p>{t('order.orderDetail.totalAmount')}:</p>
                <p>{orderDetail.subTotal}</p>
                <p>{t('order.orderDetail.shippingFee')}:</p>
                <p>{orderDetail.shippingFee}</p>
                <p>{t('order.orderDetail.serviceFee')}:</p>
                <p>{orderDetail.serviceFee}</p>
                <p>{t('order.orderDetail.saleOff')}:</p>
                <p>{orderDetail.discount}</p>
                <p>{t('order.orderDetail.totalPayment')}:</p>
                <p id="total-amount">{orderDetail.totalPayment}</p>
              </div>

              <div className="bill-content">
                <p>{t('order.orderDetail.paymentBy')}:</p>
                <p>{orderDetail.paymentByCashOrBankTransfer}</p>
                <p>{t('order.orderDetail.paymentByDebt')}:</p>
                <p>{orderDetail.totalPaymentByDebt}</p>
              </div>
            </div>
          </div>

          <div className="images-shipping">
            <p className="card-title">{t('order.orderDetail.imageShipping')}</p>
            <div className="images">
              {orderDetail?.fileURLs.map((item, index) => (
                <Image key={index} width={100} src={item} alt="" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Page403 />
      )}
    </>
  );
};

export default OrderDetail;
