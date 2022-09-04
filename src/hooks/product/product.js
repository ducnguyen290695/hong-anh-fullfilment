import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_QUERY, GET_PRODUCTS_QUERY } from 'graphql/product/query';
import { UPDATE_PRODUCT_MUTATION } from 'graphql/product/mutation';
import { useGetUserPermissions } from 'hooks/user/user';
import { hasPermission } from 'utils/helperFuncs';
import { USER_PERMISSIONS } from 'config/constants';

export const useGetProducts = (params) => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_PRODUCTS_QUERY, {
    variables: params,
  });
  return {
    loading,
    data: data?.product?.pagination.products,
    total: data?.product?.pagination?.paginationData?.total,
    refetch,
    fetchMore,
  };
};

export function useGetProduct(params) {
  const { loading, data } = useQuery(GET_PRODUCT_QUERY, {
    variables: params,
  });
  return {
    data: data?.product?.get,
    loading,
  };
}

export const useUpdateProduct = () => {
  const [updateProduct, { loading, error }] = useMutation(UPDATE_PRODUCT_MUTATION);

  const handleUpdateProduct = async ({ productID, shortCode, vat, prices }) => {
    return await updateProduct({
      variables: {
        productID,
        shortCode,
        vat,
        prices,
      },
    });
  };
  return {
    handleUpdateProduct,
    loading,
    error,
  };
};

export function useGetUpdatedProduct(params) {
  const { loading, data, refetch } = useQuery(GET_PRODUCT_QUERY, {
    variables: params,
    skip: !params?.id,
  });
  return {
    data: data?.product?.get,
    loading,
    refetch,
  };
}

export const useProductPermissions = () => {
  const { permissions = [] } = useGetUserPermissions();
  return {
    canViewProduct: hasPermission(permissions, [USER_PERMISSIONS.PRODUCT_VIEW]),
    canUpdate: hasPermission(permissions, [
      USER_PERMISSIONS.PRODUCT_UPDATE,
      USER_PERMISSIONS.PRODUCT_UPDATE_PRICE,
    ]),
    canUpdateInfo: hasPermission(permissions, [USER_PERMISSIONS.PRODUCT_UPDATE]),
    canUpdatePrice: hasPermission(permissions, [USER_PERMISSIONS.PRODUCT_UPDATE_PRICE]),
  };
};
