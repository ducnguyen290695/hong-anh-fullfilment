import { gql } from '@apollo/client';

export const GET_WAREHOUSES = gql`
  query {
    warehouse {
      list {
        warehouses {
          name
          code
          id
        }
      }
    }
  }
`;
