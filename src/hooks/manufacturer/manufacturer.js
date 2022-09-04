import { useQuery } from '@apollo/client';
import { MANUFACTURES } from 'graphql/manufacturer/query';

export const useGetManufacturers = () => {
  const { loading, data, refetch } = useQuery(MANUFACTURES);

  const convertData = data?.manufacturer?.list.map(({ id, name }) => {
    return {
      label: name,
      value: id,
    };
  });

  return {
    loadingManufactures: loading,
    dataManufactures: convertData,
    refetch,
  };
};
