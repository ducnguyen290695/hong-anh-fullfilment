import { useGetUserPermissions } from 'hooks/user/user';
import _ from 'lodash';

export const getFilterRouters = (appRoutes) => {
  const { permissions } = useGetUserPermissions();
  // return no children routes or has at least one child has permission
  function filterParentRoutesByPermission(routers, permissions) {
    return filterRouterByPermissions(routers, permissions)?.filter((item) => {
      if (!item.children) {
        return true;
      }
      const notRequiredPermissionChildren = item.children.filter((child) => !child.permissions);
      if (notRequiredPermissionChildren.length > 0) {
        return true;
      }
      const allRequiredPermissions = _.reduce(
        item.children,
        function (arg, item) {
          return arg.concat(item.permissions || []);
        },
        []
      );

      const intersection = _.intersection(allRequiredPermissions, permissions);

      return intersection.length > 0;
    });
  }

  // return only no permission or valid permission routers
  function filterRouterByPermissions(routers, permissions) {
    return routers?.filter((item) => {
      if (!item.permissions) {
        return true;
      }
      const intersection = _.intersection(item.permissions, permissions);
      return intersection.length >= 1;
    });
  }

  let filteredRouters = filterParentRoutesByPermission(appRoutes, permissions).map((item) => ({
    ...item,
    children: filterRouterByPermissions(item.children, permissions),
  }));
  return filteredRouters;
};
