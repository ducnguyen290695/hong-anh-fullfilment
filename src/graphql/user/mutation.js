import { gql } from '@apollo/client';

export const UPDATE_USER_STATUS_MUTATION = gql`
  mutation UpdateUserStatus($id: ID!, $status: UserStatus!) {
    user {
      updateStatus(id: $id, status: $status)
    }
  }
`;

export const ASSIGN_USERS_TO_ROLE_MUTATION = gql`
  mutation AssignUsersToRole($roleID: ID!, $userIDs: [ID!]) {
    role {
      addUsers(roleID: $roleID, userIDs: $userIDs)
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($request: CreateUserRequest!) {
    user {
      create(request: $request) {
        id
      }
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($request: UpdateUserRequest!) {
    user {
      update(request: $request) {
        id
      }
    }
  }
`;
