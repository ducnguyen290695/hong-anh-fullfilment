import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SELLERS,
  GET_SELLERS_WITH_WALLET,
  GET_SELLER_DETAIL,
  SELLER_LEVERS,
  GET_SELLER_CONTACT,
  GET_CREATE_CART_SELLERS,
} from 'graphql/seller/query';
import {
  CREATE_SELLER_MUTATION,
  UPDATE_SELLER_MUTATION,
  UPDATE_SELLER_SALE_CATEGORIES,
  UPDATE_SELLER_STATUS,
  CREATE_CONTACT_MUTATION,
  UPDATE_CONTACT_MUTATION,
  DELETE_CONTACT_MUTATION,
} from 'graphql/seller/mutation';
import { convertCreateCartSeller } from './converter';
import { useGetUserPermissions } from 'hooks/user/user';
import { USER_PERMISSIONS } from 'config/constants';
import { hasPermission } from 'utils/helperFuncs';

export const useGetSeller = ({ filters, pagination }) => {
  const { loading, data, refetch } = useQuery(GET_SELLERS, {
    variables: {
      filters,
      pagination,
    },
  });

  return {
    loading,
    data: data?.seller?.pagination?.sellers,
    total: data?.seller?.pagination?.paginationData?.total,
    refetch,
  };
};

export const useGetSellerWithWallet = ({ filters, pagination }) => {
  const { loading, data, refetch } = useQuery(GET_SELLERS_WITH_WALLET, {
    variables: {
      filters,
      pagination,
    },
  });

  return {
    loading,
    data: data?.seller?.pagination?.sellers,
    total: data?.seller?.pagination?.paginationData?.total,
    refetch,
  };
};

export const useGetSellerDetail = ({ id }) => {
  const { loading, data } = useQuery(GET_SELLER_DETAIL, {
    variables: {
      id,
    },
    skip: !id,
  });

  return {
    loading,
    seller: data?.seller?.get,
  };
};

export const useUpdateSellerStatus = ({ id, isActive }) => {
  const [updateSellerStatus, { loading }] = useMutation(UPDATE_SELLER_STATUS);

  const hanldeUpdateSellerStatus = async () => {
    return await updateSellerStatus({
      variables: {
        id,
        isActive,
      },
    });
  };

  return {
    hanldeUpdateSellerStatus,
    loading,
  };
};

export const useCreateSeller = () => {
  const [createSeller, { loading }] = useMutation(CREATE_SELLER_MUTATION);

  const handleCreateSeller = async ({ sellerInfo, warehouseIDs, saleCategories, vatInfo }) => {
    await createSeller({ variables: { sellerInfo, warehouseIDs, saleCategories, vatInfo } });
  };

  return {
    handleCreateSeller,
    loading,
  };
};

export const useUpdateSeller = () => {
  const [updateSeller, { loading }] = useMutation(UPDATE_SELLER_MUTATION);

  const handleUpdateSeller = async ({
    sellerInfo,
    warehouseIDs,
    saleCategories,
    vatInfo,
    sellerID,
  }) => {
    await updateSeller({
      variables: { sellerInfo, warehouseIDs, saleCategories, vatInfo, sellerID },
    });
  };

  return {
    handleUpdateSeller,
    loading,
  };
};

export const useUpdateSellerSaleCategories = () => {
  const [updateSellerSaleCategories, { loading }] = useMutation(UPDATE_SELLER_SALE_CATEGORIES);

  const handleUpdateSellerSaleCategories = async ({ sellerID, saleCategories }) => {
    await updateSellerSaleCategories({ variables: { sellerID, saleCategories } });
  };

  return {
    handleUpdateSellerSaleCategories,
    loading,
  };
};

export const useGetSellerLevels = () => {
  const { data, loading } = useQuery(SELLER_LEVERS);

  return {
    sellerLevels: data?.sellerLevel?.list,
    loading,
  };
};

export const useGetSellerContact = ({ sellerID, query }) => {
  const { data, loading, refetch } = useQuery(GET_SELLER_CONTACT, {
    variables: {
      sellerID,
      query,
    },
  });

  return {
    sellerContacts: data?.contact?.list,
    loading,
    refetch,
  };
};

export const useCreateSellerContact = () => {
  const [create, { loading }] = useMutation(CREATE_CONTACT_MUTATION);

  const handleCreateContact = async ({ contact }) => {
    await create({ variables: { contact } });
  };

  return {
    handleCreateContact,
    loading,
  };
};

export const useUpdateSellerContact = () => {
  const [updateContact, { loading }] = useMutation(UPDATE_CONTACT_MUTATION);

  const handleUpdateContact = async ({ contact, id }) => {
    await updateContact({ variables: { contact, id } });
  };

  return {
    handleUpdateContact,
    loading,
  };
};

export const useDeleteSellerContact = () => {
  const [deleteContact, { loading }] = useMutation(DELETE_CONTACT_MUTATION);

  const handleDeleteContact = async ({ id }) => {
    await deleteContact({ variables: { id } });
  };

  return {
    handleDeleteContact,
    loading,
  };
};

export const useGetSellerCreateCart = ({ filters, pagination }) => {
  const { loading, data } = useQuery(GET_CREATE_CART_SELLERS, {
    variables: {
      filters,
      pagination,
    },
    skip: filters.query === '',
  });

  return {
    loading,
    sellers: convertCreateCartSeller(data?.seller?.pagination?.sellers),
  };
};

export const useSellerPermissions = () => {
  const { permissions = [] } = useGetUserPermissions();
  return {
    canView: hasPermission(permissions, [USER_PERMISSIONS.SELLER_VIEW]),
    canCreate: hasPermission(permissions, [USER_PERMISSIONS.SELLER_CREATE]),
    canUpdate: hasPermission(permissions, [USER_PERMISSIONS.SELLER_UPDATE]),
    canDeactivate: hasPermission(permissions, [USER_PERMISSIONS.SELLER_DEACTIVE]),
    canViewContact: hasPermission(permissions, [USER_PERMISSIONS.SELLER_CONTACT_VIEW]),
    canUpdateContact: hasPermission(permissions, [USER_PERMISSIONS.SELLER_CONTACT_UPDATE]),
    canDeleteContact: hasPermission(permissions, [USER_PERMISSIONS.SELLER_CONTACT_DELETE]),
  };
};
