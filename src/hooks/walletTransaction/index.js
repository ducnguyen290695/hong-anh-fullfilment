import { useQuery } from '@apollo/client';
import { convertDataSeller, convertDataWarehouseAccountantTransaction } from './converter';
import {
  GET_SELLER_WALLETS_TRANSACTION,
  GET_WAREHOUSE_ACCOUNTANT_WALLETS_TRANSACTION,
} from 'graphql/walletTransaction/query';

export const useGetWalletTransaction = ({ filters, pagination }) => {
  const { loading, data, refetch } = useQuery(GET_SELLER_WALLETS_TRANSACTION, {
    variables: {
      filters,
      pagination,
    },
  });

  return {
    loading,
    transactions: convertDataSeller(data?.walletTransaction?.pagination?.transactions),
    total: data?.walletTransaction?.pagination?.paginationData?.total,
    refetch,
  };
};

export const useGetWalletWarehouseAccountantTransaction = ({ filters, pagination }) => {
  const { loading, data, refetch } = useQuery(GET_WAREHOUSE_ACCOUNTANT_WALLETS_TRANSACTION, {
    variables: {
      filters,
      pagination,
    },
  });

  return {
    loading,
    transactions: convertDataWarehouseAccountantTransaction(
      data?.walletTransaction?.pagination?.transactions
    ),
    total: data?.walletTransaction?.pagination?.paginationData?.total,
    refetch,
  };
};
