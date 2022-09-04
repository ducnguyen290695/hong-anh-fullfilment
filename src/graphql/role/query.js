import { gql } from '@apollo/client';

export const GET_ROLES = gql`
  query GetRoles($offset: Int64, $query: String) {
    role {
      pagination(filters: { query: $query }, pagination: { limit: 10, offset: $offset }) {
        roles {
          id
          code
          name
          description
          permissions {
            id
            parentId
            level
          }
        }
        paginationData {
          total
        }
      }
    }
  }
`;

export const GET_ROLE_DETAIL = gql`
  query GetRoleDeatil($id: ID!) {
    role {
      get(id: $id) {
        code
        name
        description
        permissions {
          name
          code
          id
          level
          parentId
        }
        fullPermissions {
          id
          code
          name
          parentId
          level
          isChecked
        }
      }
    }
  }
`;
