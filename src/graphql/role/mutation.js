import { gql } from '@apollo/client';

export const CREATE_ROLE = gql`
  mutation CreateRole($role: CreateRoleRequest!) {
    role {
      create(role: $role) {
        id
        name
      }
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $role: UpdateRoleRequest!) {
    role {
      update(id: $id, role: $role) {
        id
        name
      }
    }
  }
`;

export const ASSIGN_USERS_TO_ROLE_MUTATION = gql`
  mutation AssignUsersToRole($roleID: ID!, $removedUserIDs: [ID!], $addUserIDs: [ID!]) {
    role {
      addUsers(roleID: $roleID, userIDs: $addUserIDs)
      removeUsers(roleID: $roleID, userIDs: $removedUserIDs)
    }
  }
`;

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($roleID: ID!) {
    role {
      delete(roleID: $roleID)
    }
  }
`;
