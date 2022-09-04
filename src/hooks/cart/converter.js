import { parseIsoDateStringToMoment } from 'utils/helperFuncs';

export const convertGetAllCarts = (data) =>
  data?.map((record) => ({
    tab: `Giỏ hàng #${record.id}`,
    closable: true,
    key: `${record.id}`,
  }));

const convertAddress = (address, ward, district, city) => {
  return address ? [address, ward, district, city].join(', ') : [ward, district, city].join(', ');
};

const convertShippingConfig = (data) => {
  const defaultShippingConfig = {
    busConfig: {
      busName: '',
      telephone: '',
      location: '',
      busStation: '',
      fee: null,
    },
    deliver3PartyConfig: {
      weight: null,
      length: null,
      width: null,
      height: null,
      fee: null,
      name: '',
      providerID: null,
    },
    urbanCODConfig: {
      fee: null,
    },
  };
  const dataShippingConfig = {
    busConfig: {
      busName: data?.busConfig?.busName,
      telephone: data?.busConfig?.telephone,
      location: data?.busConfig?.location,
      busStation: data?.busConfig?.busStation,
      fee: data?.busConfig?.fee,
    },
    deliver3PartyConfig: {
      id:
        data?.deliver3PartyConfig?.serviceCode || data?.deliver3PartyConfig?.providerID
          ? `${data?.deliver3PartyConfig?.serviceCode}${data?.deliver3PartyConfig?.providerID}`.toString()
          : null,
      weight: data?.deliver3PartyConfig?.weight,
      length: data?.deliver3PartyConfig?.length,
      width: data?.deliver3PartyConfig?.width,
      height: data?.deliver3PartyConfig?.height,
      fee: data?.deliver3PartyConfig?.fee,
      name: data?.deliver3PartyConfig?.name,
      serviceCode: data?.deliver3PartyConfig?.serviceCode,
      customFeeEnabled: data?.deliver3PartyConfig?.customFeeEnabled,
      customFee: data?.deliver3PartyConfig?.customFee,
      providerID: data?.deliver3PartyConfig?.providerID,
    },
    urbanCODConfig: {
      fee: data?.urbanConfig?.fee,
    },
  };
  return {
    ...defaultShippingConfig,
    ...dataShippingConfig,
  };
};

export const convertGetCart = (data) => ({
  sellerID: data?.sellerID,
  seller: {
    id: data?.seller?.id,
    fullName: data?.seller?.fullName,
    telephone: data?.seller?.telephone,
    code: data?.seller?.code,
    address: convertAddress(
      data?.seller?.address,
      data?.seller?.ward?.name,
      data?.seller?.district?.name,
      data?.seller?.city?.name
    ),
    debtLimit: data?.seller?.debtLimit,
    companyWalletBalance: data?.seller?.companyWallet?.balance,
  },
  exportedWarehouse: data?.exportedWarehouse?.id,
  promisedDeliverTime: parseIsoDateStringToMoment(data?.promisedDeliverTime),
  promisedDeliverDate: parseIsoDateStringToMoment(data?.promisedDeliverTime),
  listProducts: data?.items,
  totalProduct: data?.totalProduct,
  temporaryTotal: data?.subTotal,
  sender: {
    id: `${data?.senderName}${data?.senderPhone}`,
    fullName: data?.senderName,
    telephone: data?.senderPhone,
    address: data?.senderAddress,
  },
  shippingContact: {
    id: data?.shippingContact?.id,
    fullName: data?.shippingContact?.fullName,
    telephone: data?.shippingContact?.telephone,
    address: convertAddress(
      data?.shippingContact?.address,
      data?.shippingContact?.ward?.name,
      data?.shippingContact?.district?.name,
      data?.shippingContact?.city?.name
    ),
    wardID: data?.shippingContact?.wardID,
    districtID: data?.shippingContact?.districtID,
    cityID: data?.shippingContact?.cityID,
  },
  note: data?.note,
  internalNote: data?.internalNote,
  shippingType: data?.shippingType,
  shippingConfig: convertShippingConfig(data?.shippingConfiguration),
  orderPriority: data?.orderPriority,
  fullStockRequired: data?.fullStockRequired,
  paymentMethod: data?.paymentMethod,
  vat: data?.vat,
  vatAllOrder: data?.vatAllOrder,
  vatTaxIDNumber: data?.vatTaxIDNumber,
  vatCompanyName: data?.vatCompanyName,
  vatEmail: data?.vatEmail,
  vatAddress: data?.vatAddress,
  shippingFee: data?.shippingFee,
  serviceFee: data?.serviceFee,
  total: data?.total,
  discountAmount: data?.discountAmount,
  paymentByCash: 0,
  paymentByDebit: 0,
  sendingAddress: {
    wardID: data?.sendingWard?.id,
    districtID: data?.sendingWard?.district?.id,
    cityID: data?.sendingWard?.district?.cityID,
  },
  allSenders: convertSender(data?.allSenders),
});

export const convertSender = (data) =>
  data?.map((item) => ({
    id: `${item?.fullName}${item?.telephone}`,
    fullName: item?.fullName,
    address: convertAddress(
      item?.address,
      item?.ward?.name,
      item?.district?.name,
      item?.city?.name
    ),
    telephone: item?.telephone,
    isDefault: item?.isDefault,
  }));

export const convertGetShippingProvider = (data) =>
  data
    ?.map((item) =>
      item.getServiceFee.length
        ? item.getServiceFee.map((service) => ({
            id: `${service.code}${item.id}`,
            providerID: item.id,
            name: item.name,
            fee: service.totalFee,
            serviceCode: service.code,
            serviceName: service.name,
          }))
        : {
            id: item.id,
            name: item.name,
          }
    )
    .flat();
