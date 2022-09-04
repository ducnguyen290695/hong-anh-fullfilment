import { gql } from '@apollo/client';

export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartments($departmentIDs: [ID!]) {
    department {
      delete(ids: $departmentIDs)
    }
  }
`;
export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($department: DepartmentInput!) {
    department {
      create(department: $department) {
        id
      }
    }
  }
`;
export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateDepartment($id: ID!, $department: DepartmentInput!) {
    department {
      update(id: $id, department: $department) {
        id
      }
    }
  }
`;
