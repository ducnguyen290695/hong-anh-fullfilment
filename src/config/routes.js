import App from 'pages/App';
//AppRouters
import departmentRouter from 'pages/App/Department/router';
import productRouter from 'pages/App/Product/router';
import roleRouter from 'pages/App/Role/router';
import settingRouter from 'pages/App/Setting/router';
import accountantRouter from 'pages/App/Accountant/router';
import accountRouter from 'pages/App/Acount/router';
import agentRouter from 'pages/App/Agent/router';
import cartRouter from 'pages/App/Cart/router';
import orderRouter from 'pages/App/Order/router';

import ChangePassword from 'pages/Auth/ChangePassword';
import ForgotPassword from 'pages/Auth/ForgotPassword';
import Login from 'pages/Auth/Login';
import NewPassword from 'pages/Auth/NewPassword';

const routes = [
  {
    path: '/login',
    component: Login,
    checkAuth: false,
    exact: true,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    checkAuth: false,
    exact: true,
  },
  {
    path: '/new-password',
    component: NewPassword,
    checkAuth: false,
    exact: true,
  },
  {
    path: '/change-password',
    component: ChangePassword,
    checkAuth: false,
    exact: true,
  },
  {
    path: '/',
    component: App,
    checkAuth: true,
    exact: false,
  },
];

export const appRoutes = [
  ...orderRouter,
  ...productRouter,
  ...settingRouter,
  ...accountRouter,
  ...departmentRouter,
  ...agentRouter,
  ...roleRouter,
  ...accountantRouter,
  ...cartRouter,
];

export function getAppRoutes() {
  let listRoutes = [];
  for (let item of appRoutes) {
    if (!item.children) {
      listRoutes.push(item);
    } else {
      item?.children?.map((child) => {
        listRoutes.push(child);
      });
    }
  }
  return listRoutes;
}

export default routes;
