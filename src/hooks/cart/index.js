import { useQuery, useMutation } from '@apollo/client';
import {
  CREATE_CART_MUTATION,
  DELETE_CART_MUTATION,
  UPDATE_CART,
  UPDATE_CART_ITEM,
  UPDATE_CART_SELLER,
  UPDATE_CART_ITEMS_MUTATION,
  CLONE_CART,
  EXPORT_CART,
} from 'graphql/cart/mutation';
import { GET_ALL_CARTS, GET_CART, GET_SENDER, GET_SHIPPING_PROVIDER } from 'graphql/cart/query';
import { GET_ME_QUERY } from 'graphql/auth/query';
import {
  convertGetAllCarts,
  convertGetCart,
  convertGetShippingProvider,
  convertSender,
} from './converter';

export const useCreateCart = () => {
  const [createCart, { loading, error }] = useMutation(CREATE_CART_MUTATION);

  const handleCreateCart = async ({ sellerID, items }) => {
    return await createCart({
      variables: {
        sellerID,
        items,
      },
      refetchQueries: [GET_ME_QUERY],
    });
  };
  return {
    handleCreateCart,
    loading,
    error,
  };
};

export const useGetAllCarts = () => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_ALL_CARTS);
  return {
    loading,
    data: convertGetAllCarts(data?.cart?.all),
    refetch,
    fetchMore,
  };
};

export const useGetCart = (params) => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_CART, {
    variables: params,
  });
  return {
    loading,
    data: convertGetCart(data?.cart?.get),
    refetch,
    fetchMore,
  };
};

export const useDeleteCart = () => {
  const [deleteCart, { loading, error }] = useMutation(DELETE_CART_MUTATION);

  const handleDeleteCart = async (id) => {
    return await deleteCart({
      variables: {
        id,
      },
      refetchQueries: [GET_ME_QUERY],
    });
  };
  return {
    handleDeleteCart,
    loading,
    error,
  };
};

export const useUpdateCartItem = () => {
  const [updateCartItem, { loading, error }] = useMutation(UPDATE_CART_ITEMS_MUTATION);

  const handleUpdateCartItem = async ({ cartID, request }) => {
    return await updateCartItem({
      variables: {
        cartID,
        request,
      },
    });
  };

  return {
    handleUpdateCartItem,
    loading,
    error,
  };
};

export const useUpdateCart = () => {
  const [updateCart, { loading, error }] = useMutation(UPDATE_CART);

  const handleUpdateCart = async (cartID, params) => {
    return await updateCart({
      variables: {
        cartID: cartID,
        request: { ...params },
      },
    });
  };
  return {
    handleUpdateCart,
    loading,
    error,
  };
};

export const useUpdateCartSeller = () => {
  const [updateCartSeller, { loading, error }] = useMutation(UPDATE_CART_SELLER);

  const handleUpdateCartSeller = async (cartID, newSellerID) => {
    return await updateCartSeller({
      variables: {
        cartID: cartID,
        newSellerID: newSellerID,
      },
    });
  };
  return {
    handleUpdateCartSeller,
    loading,
    error,
  };
};

export const useCartItems = () => {
  const [cartItems, { loading, error }] = useMutation(UPDATE_CART_ITEM);

  const handleCartItems = async (cartID, params) => {
    return await cartItems({
      variables: {
        cartID: cartID,
        request: {
          cartItems: {
            ...params,
          },
        },
      },
    });
  };
  return {
    handleCartItems,
    loading,
    error,
  };
};

export const useNewItems = () => {
  const [newItems, { loading, error }] = useMutation(UPDATE_CART_ITEM);

  const handleNewItems = async (params) => {
    return await newItems({
      variables: {
        cartItems: {
          ...params,
        },
      },
    });
  };
  return {
    handleNewItems,
    loading,
    error,
  };
};

export const useRemovedItemIDs = () => {
  const [removedItemIDs, { loading, error }] = useMutation(UPDATE_CART_ITEM);

  const handleRemovedItemIDs = async (cartID, IDs) => {
    return await removedItemIDs({
      variables: {
        cartID: cartID,
        request: {
          removedItemIDs: [IDs],
        },
      },
    });
  };
  return {
    handleRemovedItemIDs,
    loading,
    error,
  };
};

export const useGetSender = () => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_SENDER);
  return {
    loading,
    data: convertSender(data?.user?.me?.senderContacts),
    refetch,
    fetchMore,
  };
};

export const useCloneCart = () => {
  const [clone, { loading, error }] = useMutation(CLONE_CART);
  const handleCloneCart = async (cartID) => {
    return await clone({
      variables: {
        cloneCartID: cartID,
      },
      refetchQueries: [GET_ALL_CARTS, GET_ME_QUERY],
    });
  };
  return {
    handleCloneCart,
    loading,
    error,
  };
};

export const useGetShippingProvider = (params) => {
  const { loading, data, refetch, fetchMore } = useQuery(GET_SHIPPING_PROVIDER, {
    variables: { input: { ...params } },
    skip: params === undefined,
  });

  return {
    loading,
    data: convertGetShippingProvider(data?.shippingProvider?.list) || [],
    refetch,
    fetchMore,
  };
};

export const useExportCart = () => {
  const [exportCart, { loading, error }] = useMutation(EXPORT_CART);

  const handleExportCart = async ({ cartID, fileType }) => {
    return await exportCart({
      variables: {
        cartID,
        fileType,
      },
    });
  };
  return {
    handleExportCart,
    loading,
    error,
  };
};
