import CreateAccount from './Create';
import AccountDetail from './Detail';
import AccountList from './List';

const router = [
  {
    path: '/account',
    component: AccountList,
    exact: true,
  },
  {
    path: '/account/create',
    component: CreateAccount,
    exact: true,
  },
  {
    path: '/account/detail/:id',
    component: AccountDetail,
    exact: true,
  },
];

export default router;
