import {
  EXPORT_VAT,
  FULL_STOCK_REQUIRED,
  PAYMENT_METHOD,
  PRIORITY_LEVEL,
  SHIPPING_TYPE,
  STATUS_ORDER,
  STOCK_STATUS,
} from 'config/constants';
import { useTranslation } from 'react-i18next';
import { ORDER_STATUS } from './conts';

export const useOrder = () => {
  const { t } = useTranslation();

  const convertOrderStatus = (status) => {
    switch (status) {
      case ORDER_STATUS.WAITING_FOR_APPROVAL:
        return { title: t('order.orderStatus.waitingForApproval'), step: 0 };
      case ORDER_STATUS.WAITING_FOR_PAYMENT:
        return { title: t('order.orderStatus.waitingForPayment'), step: 1 };
      case ORDER_STATUS.WAITING_FOR_EXPORTING:
        return { title: t('order.orderStatus.waitingForExporting'), step: 2 };
      case ORDER_STATUS.WAITING_FOR_SHIPPING:
        return { title: t('order.orderStatus.waitingForDelivery'), step: 3 };
      case ORDER_STATUS.DELIVERING:
        return { title: t('order.orderStatus.delivering'), step: 4 };
      case ORDER_STATUS.COMPLETED:
        return { title: t('order.orderStatus.completed'), step: 5 };
      case ORDER_STATUS.CANCELED:
        return { title: t('order.orderStatus.cancel'), step: 6 };
      default:
        return '';
    }
  };

  const orderPriorityOptions = [
    { value: PRIORITY_LEVEL.LOW, label: t('order.orderList.low') },
    { value: PRIORITY_LEVEL.MEDIUM, label: t('order.orderList.medium') },
    { value: PRIORITY_LEVEL.HIGH, label: t('order.orderList.high') },
  ];

  const shippingOptions = [
    { value: SHIPPING_TYPE.BUS, label: t('order.orderList.bus') },
    { value: SHIPPING_TYPE.DELIVER_3PARTY, label: t('order.orderList.deliver3Party') },
    { value: SHIPPING_TYPE.PICK_UP_COUNTER, label: t('order.orderList.pickUpCounter') },
    { value: SHIPPING_TYPE.URBAN_COD, label: t('order.orderList.urbanCOD') },
  ];

  const paymentMethodOptions = [
    { value: PAYMENT_METHOD.Cash, label: t('order.orderList.cash') },
    { value: PAYMENT_METHOD.CashAndDebt, label: t('order.orderList.cashAndDebit') },
    { value: PAYMENT_METHOD.COD, label: t('order.orderList.COD') },
    { value: PAYMENT_METHOD.Debt, label: t('order.orderList.debt') },
  ];

  const statusOptions = [
    { value: STATUS_ORDER.WAITING_FOR_APPROVAL, label: t('order.orderStatus.waitingForApproval') },
    {
      value: STATUS_ORDER.WAITING_FOR_ENOUGH_STOCK,
      label: t('order.orderStatus.waitingForEnoughStock'),
    },
    { value: STATUS_ORDER.WAITING_FOR_PAYMENT, label: t('order.orderStatus.waitingForPayment') },
    {
      value: STATUS_ORDER.WAITING_FOR_EXPORTING,
      label: t('order.orderStatus.waitingForExporting'),
    },
    { value: STATUS_ORDER.WAITING_FOR_SHIPPING, label: t('order.orderStatus.waitingForDelivery') },
    { value: STATUS_ORDER.DELIVERING, label: t('order.orderStatus.delivering') },
    { value: STATUS_ORDER.COMPLETED, label: t('order.orderStatus.completed') },
    { value: STATUS_ORDER.CANCELED, label: t('order.orderStatus.cancel') },
  ];

  const fullStockRequiredOption = [
    { value: FULL_STOCK_REQUIRED.YES, label: t('common.yes') },
    { value: FULL_STOCK_REQUIRED.NO, label: t('common.no') },
  ];

  const vatOption = [
    { value: EXPORT_VAT.YES, label: t('common.yes') },
    { value: EXPORT_VAT.NO, label: t('common.no') },
  ];

  const stockStatusOption = [
    { value: STOCK_STATUS.FULL, label: t('common.full') },
    { value: STOCK_STATUS.LACK, label: t('common.lack') },
    { value: STOCK_STATUS.OUT_OF_STOCK, label: t('common.outOfStock') },
  ];

  return {
    convertOrderStatus,
    orderPriorityOptions,
    shippingOptions,
    paymentMethodOptions,
    statusOptions,
    fullStockRequiredOption,
    vatOption,
    stockStatusOption,
  };
};
