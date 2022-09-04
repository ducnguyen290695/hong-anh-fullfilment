import { useMutation, useQuery } from '@apollo/client';
import { GET_PERMISSIONS } from 'graphql/permisson/query';

export const useGetPermissions = () => {
  const { loading, data, refetch } = useQuery(GET_PERMISSIONS);

  return {
    permissions: data?.permission?.list,
    loading,
    refetch,
  };
};
