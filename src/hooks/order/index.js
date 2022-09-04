import { useMutation, useQuery } from '@apollo/client';
import {
  convertGetAllOrder,
  convertGetCreatedBy,
  convertGetWarehouse,
  convertPagination,
} from './converter';

import {
  GET_CREATED_BY,
  GET_WAREHOUSES,
  GET_ORDERS_QUERY,
  GET_SUMMARY_TABS,
  GET_ORDER_DETAIL_QUERY,
  GET_WAREHOUSES_WITH_IDS,
  GET_CREATED_BY_WITH_IDS,
} from 'graphql/order/query';
import {
  APPROVE_STOCK,
  CANCEL_ORDER,
  COMPLETED_ORDER,
  CONFIRM_DELIVER,
  CONFIRM_EXPORT_ORDER,
  CONFIRM_PAYMENT,
  CREATE_ORDER,
  DENY_STOCK,
  EXPORT_ORDER,
  UPDATE_STATUS,
  WAITING_FOR_ENOUGH_STOCK,
} from 'graphql/order/mutation';
import { GET_ME_QUERY } from 'graphql/auth/query';
import { useGetUserPermissions } from 'hooks/user/user';
import { hasPermission } from 'utils/helperFuncs';
import { USER_PERMISSIONS } from 'config/constants';

export const useGetOrders = (params) => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_ORDERS_QUERY, {
    variables: params,
  });
  return {
    loading,
    data: convertGetAllOrder(data?.order?.pagination?.orders) || [],
    paginationData: data?.order?.pagination?.paginationData,
    refetch,
    fetchMore,
  };
};

export const useGetWarehouses = () => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_WAREHOUSES);
  return {
    loading,
    data: convertGetWarehouse(data?.warehouse?.list?.warehouses),
    refetch,
    fetchMore,
  };
};

export const useGetCreatedBy = (params) => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_CREATED_BY, {
    variables: params,
  });
  return {
    loading,
    data: convertGetCreatedBy(data?.user?.pagination?.users) || [],
    paginationData: convertPagination(data?.user?.pagination?.paginationData),
    refetch,
    fetchMore,
  };
};

export const useGetSummaryTabs = () => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_SUMMARY_TABS);
  return {
    loading,
    data: data?.order?.totalByStatus,
    refetch,
    fetchMore,
  };
};

export const useCreateOrder = () => {
  const [createOrder, { loading, error }] = useMutation(CREATE_ORDER);
  const handleCreateOrder = async ({ id }) => {
    return await createOrder({
      variables: { cartID: id },
      refetchQueries: [GET_ME_QUERY],
    });
  };
  return {
    handleCreateOrder,
    loading,
    error,
  };
};

export const useGetOrderDetail = ({ id }) => {
  const { loading, data, refetch } = useQuery(GET_ORDER_DETAIL_QUERY, {
    variables: {
      id,
    },
  });
  return {
    loading,
    order: data?.order?.get,
    refetch,
  };
};

export const useUpdateStatus = () => {
  const [updateStatus, { loading, error }] = useMutation(UPDATE_STATUS);
  const handleUpdateStatus = async (params) => {
    return await updateStatus({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleUpdateStatus,
    loading,
    error,
  };
};

export const useApproveStock = () => {
  const [approveStock, { loading, error }] = useMutation(APPROVE_STOCK);
  const handleApproveStock = async (params) => {
    return await approveStock({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleApproveStock,
    loading,
    error,
  };
};

export const useCancelOrder = () => {
  const [cancelOrder, { loading, error }] = useMutation(CANCEL_ORDER);
  const handleCancelOrder = async (params) => {
    return await cancelOrder({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleCancelOrder,
    loading,
    error,
  };
};

export const useConfirmPayment = () => {
  const [confirmPayment, { loading, error }] = useMutation(CONFIRM_PAYMENT);
  const handleConfirmPayment = async (params) => {
    return await confirmPayment({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleConfirmPayment,
    loading,
    error,
  };
};

export const useConfirmExportOrder = () => {
  const [confirmExportOrder, { loading, error }] = useMutation(CONFIRM_EXPORT_ORDER);
  const handleConfirmExportOrder = async (params) => {
    return await confirmExportOrder({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleConfirmExportOrder,
    loading,
    error,
  };
};

export const useCompletedOrder = () => {
  const [completedOrder, { loading, error }] = useMutation(COMPLETED_ORDER);
  const handleCompletedOrder = async (params) => {
    return await completedOrder({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleCompletedOrder,
    loading,
    error,
  };
};

export const useConfirmDeliver = () => {
  const [confirmDeliver, { loading, error }] = useMutation(CONFIRM_DELIVER);
  const handleConfirmDeliver = async (params) => {
    return await confirmDeliver({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleConfirmDeliver,
    loading,
    error,
  };
};

export const useWaitingStock = () => {
  const [waitingStock, { loading, error }] = useMutation(WAITING_FOR_ENOUGH_STOCK);
  const handleWaitingStock = async (params) => {
    return await waitingStock({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleWaitingStock,
    loading,
    error,
  };
};

export const useDenyStock = () => {
  const [denyStock, { loading, error }] = useMutation(DENY_STOCK);
  const handleDenyStock = async (params) => {
    return await denyStock({
      variables: params,
      refetchQueries: [GET_SUMMARY_TABS, GET_ORDER_DETAIL_QUERY, GET_ORDERS_QUERY],
    });
  };
  return {
    handleDenyStock,
    loading,
    error,
  };
};

export const useGetWarehousesWithIds = (params) => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_WAREHOUSES_WITH_IDS, {
    variables: params,
    skip: params?.request?.ids === undefined,
  });

  return {
    loading,
    data: convertGetWarehouse(data?.warehouse?.list?.warehouses),
    refetch,
    fetchMore,
  };
};

export const useGetCreatedByWithIds = (params) => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_CREATED_BY_WITH_IDS, {
    variables: { filters: { ...params } },
    skip: params?.ids === undefined,
  });

  return {
    loading,
    data: convertGetCreatedBy(data?.user?.pagination?.users) || [],
    refetch,
    fetchMore,
  };
};

export const useOrderPermissions = () => {
  const { permissions = [] } = useGetUserPermissions();
  return {
    canCreateOrder: hasPermission(permissions, [USER_PERMISSIONS.ORDER_CREATE]),
    canViewOrder: hasPermission(permissions, [USER_PERMISSIONS.ORDER_VIEW]),
    canApproveStock: hasPermission(permissions, [USER_PERMISSIONS.ORDER_APPROVE_STOCK]),
    canWaitStock: hasPermission(permissions, [USER_PERMISSIONS.ORDER_WAIT_STOCK]),
    canDenyStock: hasPermission(permissions, [USER_PERMISSIONS.ORDER_DENY_STOCK]),
    canConfirmPayment: hasPermission(permissions, [USER_PERMISSIONS.ORDER_CONFIRM_PAYMENT]),
    canExportStock: hasPermission(permissions, [USER_PERMISSIONS.ORDER_EXPORT_STOCK]),
    canAssignShipper: hasPermission(permissions, [USER_PERMISSIONS.ORDER_ASSIGN_SHIPPER]),
    canCompleteOrder: hasPermission(permissions, [USER_PERMISSIONS.ORDER_COMPLETE]),
    canRecreateCart: hasPermission(permissions, [USER_PERMISSIONS.ORDER_RECREATE_CART]),
    canCancelOrder: hasPermission(permissions, [USER_PERMISSIONS.ORDER_CANCEL]),
  };
};

export const useExportOrder = () => {
  const [exportOrder, { loading, error }] = useMutation(EXPORT_ORDER);

  const handleExportOrder = async ({ orderID, fileType }) => {
    return await exportOrder({
      variables: {
        orderID,
        fileType,
      },
    });
  };
  return {
    handleExportOrder,
    loading,
    error,
  };
};
