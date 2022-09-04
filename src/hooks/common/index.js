import { useQuery } from '@apollo/client';
import {
  GET_CITIES,
  GET_DISTRICTS_OF_CITY,
  GET_WARDS_OF_DISTRICT,
  GET_BANKS,
} from 'graphql/common/query';

export const useCities = (ids) => {
  const { data, loading } = useQuery(GET_CITIES, { variables: { ids } });
  return {
    cities: data?.city.list,
    loading,
  };
};

export const useDistricts = (cityId) => {
  const { data, loading, refetch } = useQuery(GET_DISTRICTS_OF_CITY, {
    variables: { cityID: cityId },
    skip: !cityId,
  });
  return {
    districts: data?.district?.listOfCity,
    loading,
    refetch,
  };
};

export const useWards = (districtId) => {
  const { data, loading, refetch } = useQuery(GET_WARDS_OF_DISTRICT, {
    variables: { districtID: districtId },
    skip: !districtId,
  });
  return {
    wards: data?.ward?.listOfDistrict,
    loading,
    refetch,
  };
};

export const useBanks = () => {
  const { data, loading } = useQuery(GET_BANKS);
  return {
    banks: data?.bank?.pagination?.banks,
    loading,
  };
};
