export const makePermissionsUnique = (data) => [...new Set(data)];

export const convertShipperList = (data) =>
  data?.map((record) => ({
    value: record?.id,
    selectionRender: record?.fullname,
    label: `${record?.id} - ${record?.fullname} - ${record?.telephone}`,
  }));
