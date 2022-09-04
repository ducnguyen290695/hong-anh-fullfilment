import { convertAddress, convertGetContact } from './converter';

const mockDataAddress1 = {
  address: 'Số 5, ngõ 315',
  ward: 'đường Nguyễn Khang',
  district: 'quận Cầu Giấy',
  city: 'thành phố Hà Nội',
};

const expectAddress1 = 'Số 5, ngõ 315, đường Nguyễn Khang, quận Cầu Giấy, thành phố Hà Nội';

const expectAddress2 = 'đường Nguyễn Khang, quận Cầu Giấy, thành phố Hà Nội';

// eslint-disable-next-line no-undef
test('Convert address has address', () => {
  // eslint-disable-next-line no-undef
  expect(
    convertAddress(
      mockDataAddress1.address,
      mockDataAddress1.ward,
      mockDataAddress1.district,
      mockDataAddress1.city
    )
  ).toMatch(expectAddress1);
});

// eslint-disable-next-line no-undef
test('Convert address has not address', () => {
  // eslint-disable-next-line no-undef
  expect(
    convertAddress(mockDataAddress1.ward, mockDataAddress1.district, mockDataAddress1.city)
  ).toMatch(expectAddress2);
});

const mockDataContact1 = [
  {
    id: '1',
    fullName: 'Nguyễn Hoàng Tùng',
    telephone: '0123456789',
    address: mockDataAddress1.address,
    ward: {
      name: mockDataAddress1.ward,
    },
    district: {
      name: mockDataAddress1.district,
    },
    city: {
      name: mockDataAddress1.city,
    },
    isDefault: true,
  },
];

const expectContact2 = [
  {
    id: '1',
    fullName: 'Nguyễn Hoàng Tùng',
    telephone: '0123456789',
    address: expectAddress1,
    isDefault: true,
  },
];

// eslint-disable-next-line no-undef
test('Convert contact', () => {
  // eslint-disable-next-line no-undef
  expect(convertGetContact(mockDataContact1)).toEqual(expectContact2);
});
