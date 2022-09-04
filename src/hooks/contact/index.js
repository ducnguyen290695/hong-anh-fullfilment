import { useQuery } from '@apollo/client';
import { GET_CONTACTS } from 'graphql/contact/query';
import { convertGetContact } from './converter';

export const useContacts = (params) => {
  const { data, loading, refetch } = useQuery(GET_CONTACTS, {
    variables: params,
    skip: params?.sellerID === undefined,
  });
  return {
    data: convertGetContact(data?.contact?.list),
    loading,
    refetch,
  };
};
