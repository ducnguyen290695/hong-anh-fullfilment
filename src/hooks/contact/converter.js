export const convertAddress = (address, ward, district, city) => {
  return address ? [address, ward, district, city].join(', ') : [ward, district, city].join(', ');
};

export const convertGetContact = (data) =>
  data?.map((item) => ({
    id: item?.id,
    fullName: item?.fullName,
    telephone: item?.telephone,
    address: convertAddress(
      item?.address,
      item?.ward?.name,
      item?.district?.name,
      item?.city?.name
    ),
    isDefault: item?.isDefault,
  }));
