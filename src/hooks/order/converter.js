import { SHIPPING_TYPE } from 'config/constants';
import { formatDateTime } from 'utils/dateTime';

export const convertGetAllOrder = (data) =>
  data?.map((item) => ({
    id: item?.id,
    createdAt: formatDateTime(item?.createdAt),
    number: item?.number,
    subTotal: item?.subTotal,
    exportedWarehouse: item?.exportedWarehouse?.name,
    receiverName: item?.receiverContactName,
    orderPriority: item?.orderPriority,
    shippingType: item?.shippingType,
    paymentMethod: item?.paymentMethod,
    status: item?.status,
    createdBy: item?.createdBy?.email,
    fullStockRequired: item?.fullStockRequired,
    remainingDeliverTime: item?.remainingDeliverTime,
    vat: item?.vat,
    receiverContactAddress: item?.receiverContactAddress,
    promisedDeliverTime: formatDateTime(item?.promisedDeliverTime),
    shippingUnit: convertShippingUnit(item?.shippingConfiguration, item?.shippingType),
    internalNote: item?.internalNote,
    inStockStatus: item?.stockStatus,
    completedAt: formatDateTime(item?.completedAt),
    fileURLs: item?.fileURLs,
    senderAddress: item?.senderAddress,
    shipperTelephone: item?.shipperTelephone,
    receiverContactPhone: item?.receiverContactPhone,
  }));

export const convertShippingUnit = (shippingConfiguration, shippingType) => {
  switch (shippingType) {
    case SHIPPING_TYPE.BUS:
      return shippingConfiguration?.busConfig?.busName;
    case SHIPPING_TYPE.DELIVER_3PARTY:
      return shippingConfiguration?.deliver3PartyConfig?.name;
    case SHIPPING_TYPE.URBAN_COD:
      return 'Nguyễn Văn A';
    case SHIPPING_TYPE.PICK_UP_COUNTER:
      return;
  }
};

export const convertGetWarehouse = (data) =>
  data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));

export const convertGetCreatedBy = (data) =>
  data?.map((item) => ({
    value: item?.id,
    label: item?.email,
  }));

export const convertPagination = (data) => {
  return {
    total: data?.total,
    pageSize: data?.limit,
    current: data?.offset / data?.limit + 1,
    showSizeChanger: false,
  };
};
