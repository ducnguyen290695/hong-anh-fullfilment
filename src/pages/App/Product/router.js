import ProductList from './Product/List';
import ProductDetail from './Product/Detail';
import ProductGroupList from './ProductGroup/List';
import CreateProductGroup from './ProductGroup/Create';
import ProductGroupDetail from './ProductGroup/Detail';
import { Icon, FontAwesomeIcon } from 'assets/icons';
import { USER_PERMISSIONS } from 'config/constants';

const defaultKey = 'product';

const router = [
  {
    key: defaultKey,
    title: 'Sản phẩm',
    icon: <FontAwesomeIcon icon={Icon.faBox} />,
    permissions: [USER_PERMISSIONS.PRODUCT_VIEW],
    children: [
      {
        key: defaultKey,
        title: 'Danh sách sản phẩm',
        path: '/product',
        component: ProductList,
        exact: true,
        permissions: [USER_PERMISSIONS.PRODUCT_VIEW],
      },
      {
        key: 'product-group-list',
        title: 'Loại sản phẩm',
        path: '/product-group',
        component: ProductGroupList,
        exact: true,
        permissions: [USER_PERMISSIONS.PRODUCT_VIEW],
      },
    ],
  },
  { key: defaultKey, path: '/product/detail/:id', component: ProductDetail, exact: true },
  {
    key: 'product-group-list',
    path: '/product-group/create',
    component: CreateProductGroup,
    exact: true,
  },
  {
    key: 'product-group-list',
    path: '/product-group/detail/:id',
    component: ProductGroupDetail,
    exact: true,
  },
];

export default router;
