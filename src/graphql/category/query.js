import { gql } from '@apollo/client';

export const GET_CATEGORIES_QUERY = gql`
  query GetCategories($filters: CategoriesFilters, $pagination: PaginationRequest) {
    category {
      pagination(filters: $filters, pagination: $pagination) {
        categories {
          id
          code
          name
          level
          isActive
          parent {
            id
            name
            level
          }
        }
        paginationData {
          offset
          total
        }
      }
    }
  }
`;

export const GET_CATEGORY_QUERY = gql`
  query GetCategory($id: ID!) {
    category {
      get(id: $id) {
        id
        code
        name
        isActive
        level
        parent {
          id
          code
          name
        }
      }
    }
  }
`;

export const GET_CATEGORY_QUERY_LEVEL = gql`
  query GetCategory($levels: [ID!]) {
    category {
      pagination(filters: { levels: $levels }) {
        categories {
          name
          id
          code
          children {
            name
            id
            code
            children {
              name
              id
              code
              children {
                name
                id
                code
                children {
                  name
                  id
                  code
                }
              }
            }
          }
        }
      }
    }
  }
`;
