import SellerList from './List';
import CreateSeller from './Create';
import SellerDetail from './Detail';
import { Icon, FontAwesomeIcon } from 'assets/icons';
import { USER_PERMISSIONS } from 'config/constants';

const defaultKey = 'seller';

const router = [
  {
    key: defaultKey,
    title: 'Đại lý',
    icon: <FontAwesomeIcon icon={Icon.faUserFriends} />,
    permissions: [USER_PERMISSIONS.SELLER_VIEW],
    children: [
      {
        key: defaultKey,
        title: 'Danh sách đại lý',
        path: '/seller',
        component: SellerList,
        exact: true,
      },
    ],
  },
  {
    key: defaultKey,
    path: '/seller/create',
    component: CreateSeller,
    exact: true,
  },
  {
    key: defaultKey,
    path: '/seller/detail/:id',
    component: SellerDetail,
    exact: true,
  },
];

export default router;
