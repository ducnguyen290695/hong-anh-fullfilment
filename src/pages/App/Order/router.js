import OrderList from './List';
import OrderDetail from './Detail';
import { Icon } from 'assets/icons';
import { USER_PERMISSIONS } from 'config/constants';

const orderPermissionList = [
  USER_PERMISSIONS.ORDER_CREATE,
  USER_PERMISSIONS.ORDER_VIEW,
  USER_PERMISSIONS.ORDER_APPROVE_STOCK,
  USER_PERMISSIONS.ORDER_WAIT_STOCK,
  USER_PERMISSIONS.ORDER_DENY_STOCK,
  USER_PERMISSIONS.ORDER_CONFIRM_PAYMENT,
  USER_PERMISSIONS.ORDER_EXPORT_STOCK,
  USER_PERMISSIONS.ORDER_ASSIGN_SHIPPER,
  USER_PERMISSIONS.ORDER_COMPLETE,
  USER_PERMISSIONS.ORDER_RECREATE_CART,
  USER_PERMISSIONS.ORDER_CANCEL,
];

const router = [
  {
    key: 'order',
    title: 'Đơn hàng',
    icon: <Icon.CustomIcon icon={Icon.faShoppingCart} />,
    permissions: orderPermissionList,
    children: [
      {
        key: 'order',
        title: 'Danh sách đơn hàng',
        path: '/order',
        component: OrderList,
        exact: true,
      },
    ],
  },
  {
    key: 'order',
    path: '/order/:id',
    component: OrderDetail,
    exact: true,
  },
];

export default router;
