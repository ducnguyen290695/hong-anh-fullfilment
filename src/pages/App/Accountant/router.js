import AccountantList from './AccountantList';
import { Icon } from 'assets/icons';
import TransactionHistory from './TransactionHistory';
import { USER_PERMISSIONS } from 'config/constants';

const defaultKey = 'accountant';

const router = [
  {
    key: defaultKey,
    title: 'Kế toán',
    icon: <Icon.CustomIcon icon={Icon.faUsers} />,
    permissions: [
      USER_PERMISSIONS.ACCOUNTANT_VIEW_SELLER_LIST,
      USER_PERMISSIONS.ACCOUNTANT_VIEW_ACCOUNTANT_LIST,
      USER_PERMISSIONS.ACCOUNTANT_VIEW_SELLER_TX_HISTORY,
      USER_PERMISSIONS.ACCOUNTANT_VIEW_ACCOUNTANT_TX_HISTORY,
    ],
    children: [
      {
        key: defaultKey,
        title: 'Danh sách tài khoản',
        path: '/accountant-list',
        component: AccountantList,
        exact: true,
        permissions: [
          USER_PERMISSIONS.ACCOUNTANT_VIEW_SELLER_LIST,
          USER_PERMISSIONS.ACCOUNTANT_VIEW_ACCOUNTANT_LIST,
        ],
      },
      {
        key: 'transaction-history',
        title: 'Lịch sử giao dịch',
        path: '/transaction-history',
        component: TransactionHistory,
        exact: true,
        permissions: [
          USER_PERMISSIONS.ACCOUNTANT_VIEW_SELLER_TX_HISTORY,
          USER_PERMISSIONS.ACCOUNTANT_VIEW_ACCOUNTANT_TX_HISTORY,
        ],
      },
    ],
  },
];

export default router;
