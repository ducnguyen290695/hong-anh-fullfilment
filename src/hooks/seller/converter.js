export const convertCreateCartSeller = (data) =>
  data?.map((record) => ({
    value: record?.id,
    inputRender: record?.fullName,
    label: `${record?.code} - ${record?.fullName} - ${record?.telephone}`,
  }));
