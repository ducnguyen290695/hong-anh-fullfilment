import { gql } from '@apollo/client';

export const MONEY_TRANSFER_MUTATION = gql`
  mutation Transfer(
    $source: ID
    $target: ID!
    $amount: Int64!
    $description: String
    $fileUrls: [String!]
    $orderID: String
  ) {
    money {
      transfer(
        source: $source
        target: $target
        amount: $amount
        description: $description
        fileUrls: $fileUrls
        orderID: $orderID
      ) {
        sourceWalletID
      }
    }
  }
`;
