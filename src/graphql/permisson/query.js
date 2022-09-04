import { gql } from '@apollo/client';

export const GET_PERMISSIONS = gql`
  query GetPermissions {
    permission {
      list {
        id
        code
        name
        level
        parentId
      }
    }
  }
`;
