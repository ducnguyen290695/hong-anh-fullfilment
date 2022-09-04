import { useQuery } from '@apollo/client';
import { GET_WAREHOUSES } from 'graphql/ware-house/query';

export const useWarehouse = () => {
  const { data, loading } = useQuery(GET_WAREHOUSES);

  return {
    warehouses: data?.warehouse?.list?.warehouses,
    loading,
  };
};
