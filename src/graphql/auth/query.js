import { gql } from '@apollo/client';

export const GET_ME_QUERY = gql`
  {
    user {
      me {
        id
        fullname
        email
        roles {
          id
          code
          name
        }
        wallets {
          id
          balance
          type
        }
        wallet {
          id
          balance
          type
        }
        totalCart
      }
    }
  }
`;
