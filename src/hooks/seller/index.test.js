import { GET_SELLERS } from 'graphql/seller/query';
import useGetHookWrapper from 'hooks/useGetHookWrapper';
import { useGetSeller } from './index';

const data = [
  {
    id: 67,
    code: 'CMT0039394884',
    idNumber: '0039394884',
    shortName: 'CAP1',
    sellerLevel: {
      level: 1,
      name: 'Cấp 1',
    },
    debtLimit: 10000000,
    debtAge: 10,
    vatInfoID: 68,
    isActive: true,
    address: 'Hồ Tùng Mậu, Nam Từ Liêm Hà Nội',
    warehouses: [
      {
        name: 'Hà Nội',
        id: 1,
        code: 'hn',
      },
      {
        name: 'Đà Nẵng',
        id: 2,
        code: 'dn',
      },
      {
        name: 'TP. Hồ Chí Minh',
        id: 3,
        code: 'hcm',
      },
      {
        name: 'KHO KH/NCC Ký Gửi',
        id: 4,
        code: 'HANGKYGUI',
      },
      {
        name: 'Kho Công ty',
        id: 5,
        code: 'KHO1',
      },
      {
        name: 'Kho Bảo Hành',
        id: 6,
        code: 'KHOBAOHANH',
      },
      {
        name: 'KHO HÀNG LỖI',
        id: 7,
        code: 'LOI',
      },
    ],
  },
  {
    id: 66,
    code: 'CMT111112',
    idNumber: '111112',
    shortName: 'HST',
    sellerLevel: {
      level: 1,
      name: 'Cấp 1',
    },
    debtLimit: 100,
    debtAge: 1,
    vatInfoID: 67,
    isActive: true,
    address: 'Quan Nhân',
    warehouses: [
      {
        name: 'Hà Nội',
        id: 1,
        code: 'hn',
      },
    ],
  },
  {
    id: 65,
    code: 'MST11111111',
    idNumber: '11111111',
    shortName: 'TDTT',
    sellerLevel: {
      level: 1,
      name: 'Cấp 1',
    },
    debtLimit: 100,
    debtAge: 1,
    vatInfoID: 66,
    isActive: true,
    address: null,
    warehouses: [
      {
        name: 'Hà Nội',
        id: 1,
        code: 'hn',
      },
    ],
  },
  {
    id: 64,
    code: 'MST01057720005',
    idNumber: '174544612',
    shortName: '¯\\_(ツ)_/¯',
    sellerLevel: {
      level: 4,
      name: 'Cấp 4',
    },
    debtLimit: 2,
    debtAge: 2,
    vatInfoID: 65,
    isActive: true,
    address: null,
    warehouses: [
      {
        name: 'Đà Nẵng',
        id: 2,
        code: 'dn',
      },
    ],
  },
  {
    id: 63,
    code: 'MST0105774099',
    idNumber: '14561537',
    shortName: '>.<',
    sellerLevel: {
      level: 2,
      name: 'Cấp 2',
    },
    debtLimit: 3,
    debtAge: 3,
    vatInfoID: 64,
    isActive: true,
    address: null,
    warehouses: [
      {
        name: 'Đà Nẵng',
        id: 2,
        code: 'dn',
      },
    ],
  },
  {
    id: 62,
    code: 'MST1105772099',
    idNumber: '174544713',
    shortName: 'HTC',
    sellerLevel: {
      level: 4,
      name: 'Cấp 4',
    },
    debtLimit: 10000,
    debtAge: 1,
    vatInfoID: 63,
    isActive: true,
    address: '234 Phúc Xá',
    warehouses: [
      {
        name: 'Hà Nội',
        id: 1,
        code: 'hn',
      },
    ],
  },
  {
    id: 61,
    code: 'MST1123321341312',
    idNumber: '4234234212',
    shortName: 'HAC',
    sellerLevel: {
      level: 2,
      name: 'Cấp 2',
    },
    debtLimit: 10000000,
    debtAge: 12,
    vatInfoID: 62,
    isActive: true,
    address: null,
    warehouses: [
      {
        name: 'TP. Hồ Chí Minh',
        id: 3,
        code: 'hcm',
      },
    ],
  },
  {
    id: 60,
    code: 'MST1123321312312',
    idNumber: '4234234212',
    shortName: 'HAC',
    sellerLevel: {
      level: 2,
      name: 'Cấp 2',
    },
    debtLimit: 10000000,
    debtAge: 12,
    vatInfoID: 61,
    isActive: true,
    address: null,
    warehouses: [
      {
        name: 'TP. Hồ Chí Minh',
        id: 3,
        code: 'hcm',
      },
    ],
  },
  {
    id: 59,
    code: 'MST1123321344234',
    idNumber: '42342342',
    shortName: 'HAC',
    sellerLevel: {
      level: 2,
      name: 'Cấp 2',
    },
    debtLimit: 10000000,
    debtAge: 12,
    vatInfoID: 60,
    isActive: true,
    address: null,
    warehouses: [
      {
        name: 'Đà Nẵng',
        id: 2,
        code: 'dn',
      },
    ],
  },
  {
    id: 58,
    code: 'MST1123321341321',
    idNumber: '4234234212',
    shortName: 'HAC',
    sellerLevel: {
      level: 1,
      name: 'Cấp 1',
    },
    debtLimit: 10000000,
    debtAge: 12,
    vatInfoID: 59,
    isActive: true,
    address: null,
    warehouses: [
      {
        name: 'TP. Hồ Chí Minh',
        id: 3,
        code: 'hcm',
      },
    ],
  },
];

const sellerQueryMock = {
  request: {
    query: GET_SELLERS,
    variables: {
      filters: {},
      pagination: {
        offset: 0,
        limit: 10,
      },
    },
  },
  result: {
    data: {
      seller: {
        pagination: {
          sellers: [
            {
              id: 67,
              code: 'CMT0039394884',
              idNumber: '0039394884',
              shortName: 'CAP1',
              sellerLevel: {
                level: 1,
                name: 'Cấp 1',
              },
              debtLimit: 10000000,
              debtAge: 10,
              vatInfoID: 68,
              isActive: true,
              address: 'Hồ Tùng Mậu, Nam Từ Liêm Hà Nội',
              warehouses: [
                {
                  name: 'Hà Nội',
                  id: 1,
                  code: 'hn',
                },
                {
                  name: 'Đà Nẵng',
                  id: 2,
                  code: 'dn',
                },
                {
                  name: 'TP. Hồ Chí Minh',
                  id: 3,
                  code: 'hcm',
                },
                {
                  name: 'KHO KH/NCC Ký Gửi',
                  id: 4,
                  code: 'HANGKYGUI',
                },
                {
                  name: 'Kho Công ty',
                  id: 5,
                  code: 'KHO1',
                },
                {
                  name: 'Kho Bảo Hành',
                  id: 6,
                  code: 'KHOBAOHANH',
                },
                {
                  name: 'KHO HÀNG LỖI',
                  id: 7,
                  code: 'LOI',
                },
              ],
            },
            {
              id: 66,
              code: 'CMT111112',
              idNumber: '111112',
              shortName: 'HST',
              sellerLevel: {
                level: 1,
                name: 'Cấp 1',
              },
              debtLimit: 100,
              debtAge: 1,
              vatInfoID: 67,
              isActive: true,
              address: 'Quan Nhân',
              warehouses: [
                {
                  name: 'Hà Nội',
                  id: 1,
                  code: 'hn',
                },
              ],
            },
            {
              id: 65,
              code: 'MST11111111',
              idNumber: '11111111',
              shortName: 'TDTT',
              sellerLevel: {
                level: 1,
                name: 'Cấp 1',
              },
              debtLimit: 100,
              debtAge: 1,
              vatInfoID: 66,
              isActive: true,
              address: null,
              warehouses: [
                {
                  name: 'Hà Nội',
                  id: 1,
                  code: 'hn',
                },
              ],
            },
            {
              id: 64,
              code: 'MST01057720005',
              idNumber: '174544612',
              shortName: '¯\\_(ツ)_/¯',
              sellerLevel: {
                level: 4,
                name: 'Cấp 4',
              },
              debtLimit: 2,
              debtAge: 2,
              vatInfoID: 65,
              isActive: true,
              address: null,
              warehouses: [
                {
                  name: 'Đà Nẵng',
                  id: 2,
                  code: 'dn',
                },
              ],
            },
            {
              id: 63,
              code: 'MST0105774099',
              idNumber: '14561537',
              shortName: '>.<',
              sellerLevel: {
                level: 2,
                name: 'Cấp 2',
              },
              debtLimit: 3,
              debtAge: 3,
              vatInfoID: 64,
              isActive: true,
              address: null,
              warehouses: [
                {
                  name: 'Đà Nẵng',
                  id: 2,
                  code: 'dn',
                },
              ],
            },
            {
              id: 62,
              code: 'MST1105772099',
              idNumber: '174544713',
              shortName: 'HTC',
              sellerLevel: {
                level: 4,
                name: 'Cấp 4',
              },
              debtLimit: 10000,
              debtAge: 1,
              vatInfoID: 63,
              isActive: true,
              address: '234 Phúc Xá',
              warehouses: [
                {
                  name: 'Hà Nội',
                  id: 1,
                  code: 'hn',
                },
              ],
            },
            {
              id: 61,
              code: 'MST1123321341312',
              idNumber: '4234234212',
              shortName: 'HAC',
              sellerLevel: {
                level: 2,
                name: 'Cấp 2',
              },
              debtLimit: 10000000,
              debtAge: 12,
              vatInfoID: 62,
              isActive: true,
              address: null,
              warehouses: [
                {
                  name: 'TP. Hồ Chí Minh',
                  id: 3,
                  code: 'hcm',
                },
              ],
            },
            {
              id: 60,
              code: 'MST1123321312312',
              idNumber: '4234234212',
              shortName: 'HAC',
              sellerLevel: {
                level: 2,
                name: 'Cấp 2',
              },
              debtLimit: 10000000,
              debtAge: 12,
              vatInfoID: 61,
              isActive: true,
              address: null,
              warehouses: [
                {
                  name: 'TP. Hồ Chí Minh',
                  id: 3,
                  code: 'hcm',
                },
              ],
            },
            {
              id: 59,
              code: 'MST1123321344234',
              idNumber: '42342342',
              shortName: 'HAC',
              sellerLevel: {
                level: 2,
                name: 'Cấp 2',
              },
              debtLimit: 10000000,
              debtAge: 12,
              vatInfoID: 60,
              isActive: true,
              address: null,
              warehouses: [
                {
                  name: 'Đà Nẵng',
                  id: 2,
                  code: 'dn',
                },
              ],
            },
            {
              id: 58,
              code: 'MST1123321341321',
              idNumber: '4234234212',
              shortName: 'HAC',
              sellerLevel: {
                level: 1,
                name: 'Cấp 1',
              },
              debtLimit: 10000000,
              debtAge: 12,
              vatInfoID: 59,
              isActive: true,
              address: null,
              warehouses: [
                {
                  name: 'TP. Hồ Chí Minh',
                  id: 3,
                  code: 'hcm',
                },
              ],
            },
          ],
          paginationData: {
            total: 18,
          },
        },
      },
    },
  },
};

// eslint-disable-next-line no-undef
describe('useGetSeller custom hook', () => {
  // eslint-disable-next-line no-undef
  it('should return an array of sellers', async () => {
    const params = {
      filters: {},
      pagination: {
        offset: 0,
        limit: 10,
      },
    };

    const { result, waitForNextUpdate } = useGetHookWrapper(
      [sellerQueryMock],
      useGetSeller,
      params
    );
    // Wait for the results
    await waitForNextUpdate();

    // We access the hook result using result.current
    // eslint-disable-next-line no-undef
    expect(result.current.loading).toBeFalsy();
    // eslint-disable-next-line no-undef
    expect(result.current.data).toEqual(data);
  });
});
