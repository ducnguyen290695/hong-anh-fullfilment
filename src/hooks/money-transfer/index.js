import { useMutation, useQuery } from '@apollo/client';
import { GET_ME_QUERY } from 'graphql/auth/query';
import { MONEY_TRANSFER_MUTATION } from 'graphql/money-transfer/mutation';

export const useTransferMoney = () => {
  const [transfer, { loading }] = useMutation(MONEY_TRANSFER_MUTATION);

  const handleTransferMoney = async ({
    source,
    target,
    amount,
    description,
    fileUrls,
    orderID,
    transferType,
  }) => {
    return await transfer({
      variables: {
        source,
        target,
        amount,
        description,
        fileUrls,
        orderID,
        transferType,
      },
      refetchQueries: [GET_ME_QUERY],
    });
  };

  return {
    loading,
    handleTransferMoney,
  };
};
