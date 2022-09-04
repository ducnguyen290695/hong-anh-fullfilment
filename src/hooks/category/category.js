import { useQuery } from '@apollo/client';
import {
  GET_CATEGORIES_QUERY,
  GET_CATEGORY_QUERY,
  GET_CATEGORY_QUERY_LEVEL,
} from 'graphql/category/query';

export const useGetCategories = (params) => {
  const { loading, data, refetch } = useQuery(GET_CATEGORIES_QUERY, {
    variables: params,
  });
  return {
    loading,
    data: data?.category?.pagination,
    refetch,
  };
};

export const useGetCategoriesLevel = ({ levels }) => {
  const { loading, data, refetch } = useQuery(GET_CATEGORY_QUERY_LEVEL, {
    variables: {
      levels,
    },
  });

  return {
    loading,
    categories: data?.category?.pagination?.categories,
    refetch,
  };
};

export const useGetCategory = (params) => {
  const { loading, data } = useQuery(GET_CATEGORY_QUERY, {
    variables: params,
  });
  return {
    loading,
    data: data?.category?.get,
  };
};
