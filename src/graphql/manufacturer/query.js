import { gql } from '@apollo/client';

export const MANUFACTURES = gql`
  query {
    manufacturer {
      list {
        id
        name
      }
    }
  }
`;
