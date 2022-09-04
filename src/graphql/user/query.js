import { gql } from '@apollo/client';

const USER_INFO = gql`
  fragment UserInfo on User {
    id
    fullname
    email
    status
  }
`;

export const GET_USERS = gql`
  ${USER_INFO}
  query GetUsers($filters: UsersFilters, $pagination: PaginationRequest, $hasRoleId: ID!) {
    user {
      pagination(filters: $filters, pagination: $pagination) {
        users {
          ...UserInfo
          departmentID
          roles {
            name
            id
          }
          hasRole(id: $hasRoleId)
          department {
            name
          }
        }
        paginationData {
          total
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user {
      get(id: $id) {
        id
        fullname
        email
        telephone
        status
        cityID
        districtID
        wardID
        address
        departmentID
        avatarURL
        department {
          id
          name
        }
        roles {
          name
          id
        }
      }
    }
  }
`;

export const GET_WAREHOUSE_ACCOUNTANTS = gql`
  ${USER_INFO}
  query GetWarehouseAccountants($filters: UsersFilters, $pagination: PaginationRequest) {
    user {
      pagination(filters: $filters, pagination: $pagination) {
        users {
          ...UserInfo
          wallet {
            id
            balance
          }
        }
        paginationData {
          total
        }
      }
    }
  }
`;

export const GET_USER_PERMISSIONS = gql`
  query {
    user {
      me {
        permissions
      }
    }
  }
`;

//for now
export const GET_SHIPPER = gql`
  ${USER_INFO}
  query GetUsers($filters: UsersFilters, $pagination: PaginationRequest) {
    user {
      pagination(filters: $filters, pagination: $pagination) {
        users {
          ...UserInfo
          telephone
        }
      }
    }
  }
`;
