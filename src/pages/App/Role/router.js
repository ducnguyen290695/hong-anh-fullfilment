import CreateRole from './Create';
import RoleDetail from './Detail';

const router = [
  {
    path: '/role/create',
    component: CreateRole,
    exact: true,
  },
  {
    path: '/role/detail/:id',
    component: RoleDetail,
    exact: true,
  },
];

export default router;
