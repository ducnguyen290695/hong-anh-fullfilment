import DepartmentList from './List';
import CreateDepartment from './Create';
import DepartmentDetail from './Detail';

const router = [
  {
    path: '/department',
    component: DepartmentList,
    exact: true,
  },
  {
    path: '/department/create',
    component: CreateDepartment,
    exact: true,
  },
  {
    path: '/department/detail/:id',
    component: DepartmentDetail,
    exact: true,
  },
];

export default router;
