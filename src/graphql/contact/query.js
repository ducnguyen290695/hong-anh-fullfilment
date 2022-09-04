import { gql } from '@apollo/client';

export const GET_CONTACTS = gql`
  query GetContacts($sellerID: ID) {
    contact {
      list(sellerID: $sellerID) {
        id
        sellerID
        fullName
        telephone
        address
        ward {
          name
        }
        district {
          name
        }
        city {
          name
        }
        isDefault
      }
    }
  }
`;
