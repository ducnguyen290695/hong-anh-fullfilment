import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USER,
  GET_USERS,
  GET_WAREHOUSE_ACCOUNTANTS,
  GET_USER_PERMISSIONS,
  GET_SHIPPER,
} from 'graphql/user/query';
import {
  UPDATE_USER_STATUS_MUTATION,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from 'graphql/user/mutation';
import { useGetMe } from 'hooks/auth/login';
import { useEffect, useState } from 'react';
import { hasPermission } from 'utils/helperFuncs';
import { USER_PERMISSIONS } from 'config/constants';
import { makePermissionsUnique } from './converter';
import { convertShipperList } from './converter';

const KEY_USER_INFO = 'userInfo';

export const useCurrentUser = () => {
  const cachedUser = JSON.parse(localStorage.getItem(KEY_USER_INFO));
  const [currentUser, setCurrentUser] = useState(cachedUser);
  const { me } = useGetMe();
  useEffect(() => {
    if (me) {
      setCurrentUser(me);
      setCurrentUserToCache(me);
    }
  }, [me]);

  const setCurrentUserToCache = (user) => {
    localStorage.setItem(
      KEY_USER_INFO,
      JSON.stringify({
        [KEY_USER_INFO]: user,
      })
    );
  };

  return { currentUser };
};

export const useGetUsers = ({ filters, pagination, hasRoleId }) => {
  const { data, loading, refetch } = useQuery(GET_USERS, {
    variables: {
      filters,
      pagination,
      hasRoleId,
    },
  });

  return {
    users: data?.user?.pagination?.users,
    total: data?.user?.pagination?.paginationData?.total,
    loading,
    refetch,
  };
};

export const useGetUser = (params) => {
  const { data, loading } = useQuery(GET_USER, {
    variables: params,
    skip: !params?.id,
  });

  return {
    user: data?.user?.get,
    loading,
  };
};

export const useUpdateUserStatus = () => {
  const [updateUserStatus, { loading }] = useMutation(UPDATE_USER_STATUS_MUTATION);

  const hanldeUpdateUserStatus = async ({ id, status }) => {
    return await updateUserStatus({
      variables: {
        id,
        status,
      },
    });
  };
  return {
    hanldeUpdateUserStatus,
    loading,
  };
};

export const useCreateUser = () => {
  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);

  const handleCreateUser = async ({ request }) => {
    return await createUser({
      variables: {
        request,
      },
    });
  };
  return {
    handleCreateUser,
    loading,
  };
};

export const useUpdateUser = () => {
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION);

  const handleUpdateUser = async ({ request }) => {
    return await updateUser({
      variables: {
        request,
      },
    });
  };
  return {
    handleUpdateUser,
    loading,
  };
};

export const useGetWarehouseAccountants = ({ filters, pagination }) => {
  const { data, loading, refetch } = useQuery(GET_WAREHOUSE_ACCOUNTANTS, {
    variables: {
      filters,
      pagination,
    },
  });

  return {
    warehouseAccountants: data?.user?.pagination?.users,
    total: data?.user?.pagination?.paginationData?.total,
    loading,
    refetch,
  };
};

export const useGetUserPermissions = () => {
  const { data, loading } = useQuery(GET_USER_PERMISSIONS);
  return {
    loading,
    permissions: makePermissionsUnique(data?.user?.me?.permissions),
  };
};

export const useStaffPermissions = () => {
  const { permissions = [] } = useGetUserPermissions();
  return {
    canCreate: hasPermission(permissions, [USER_PERMISSIONS.STAFF_CREATE]),
    canUpdate: hasPermission(permissions, [USER_PERMISSIONS.STAFF_UPDATE]),
    canAssignRole: hasPermission(permissions, [USER_PERMISSIONS.STAFF_ASSIGN_ROLE]),
    canView: hasPermission(permissions, [USER_PERMISSIONS.STAFF_VIEW]),
    canDeactivateStaff: hasPermission(permissions, [USER_PERMISSIONS.STAFF_DEACTIVE]),
  };
};

export const useAccountantPermissions = () => {
  const { permissions = [] } = useGetUserPermissions();
  return {
    displaySellerList: hasPermission(permissions, [USER_PERMISSIONS.ACCOUNTANT_VIEW_SELLER_LIST]),
    displayAccountantList: hasPermission(permissions, [
      USER_PERMISSIONS.ACCOUNTANT_VIEW_ACCOUNTANT_LIST,
    ]),
    displaySellerTxHistory: hasPermission(permissions, [
      USER_PERMISSIONS.ACCOUNTANT_VIEW_SELLER_TX_HISTORY,
    ]),
    displayAccountantTxHistory: hasPermission(permissions, [
      USER_PERMISSIONS.ACCOUNTANT_VIEW_ACCOUNTANT_TX_HISTORY,
    ]),
    canRechargeWarehouseAccountant: hasPermission(permissions, [USER_PERMISSIONS.ACCOUNTANT_BANK]),
    canRechargeFromBank: hasPermission(permissions, [USER_PERMISSIONS.ACCOUNTANT_BANK]),
    canRechargeFromVirtualWallet: hasPermission(permissions, [
      USER_PERMISSIONS.WAREHOUSE_ACCOUNTANT,
    ]),
  };
};

//for now
export const useGetShipper = ({ filters, pagination }) => {
  const { data, loading } = useQuery(GET_SHIPPER, {
    variables: {
      filters,
      pagination,
    },
  });

  return {
    shippers: convertShipperList(data?.user?.pagination?.users),
    loading,
  };
};
