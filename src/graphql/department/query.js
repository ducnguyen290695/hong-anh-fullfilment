import { gql } from '@apollo/client';

export const DEPARTMENTS_QUERY = gql`
  query Departments($pagination: PaginationRequest, $filters: DepartmentsFilters) {
    department {
      pagination(pagination: $pagination, filters: $filters) {
        departments {
          id
          code
          name
          updatedAt
          description
        }

        paginationData {
          total
          offset
          limit
        }
      }
    }
  }
`;

export const GET_DEPARTMENT_QUERY = gql`
  query getDepartment($departmentID: ID!) {
    department {
      get(id: $departmentID) {
        id
        code
        name
        description
        updatedAt
      }
    }
  }
`;
