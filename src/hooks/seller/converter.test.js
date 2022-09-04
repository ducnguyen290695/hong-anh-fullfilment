import { convertCreateCartSeller } from './converter';

const mockData1 = [
  {
    id: 64,
    fullName: '(ˉ﹃ˉ)',
    code: 'MST01057720005',
    telephone: '0325555555',
  },
];

const mockData2 = [
  {
    value: 64,
    inputRender: '(ˉ﹃ˉ)',
    label: 'MST01057720005 - (ˉ﹃ˉ) - 0325555555',
  },
];

// eslint-disable-next-line no-undef
test('Convert create cart seller', () => {
  // eslint-disable-next-line no-undef
  expect(convertCreateCartSeller(mockData1)).toEqual(mockData2);
});
