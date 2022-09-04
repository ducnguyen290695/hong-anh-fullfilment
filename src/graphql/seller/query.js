import { gql } from '@apollo/client';

export const GET_SELLERS = gql`
  query GetSellers($filters: SellersFilters, $pagination: PaginationRequest) {
    seller {
      pagination(filters: $filters, pagination: $pagination) {
        sellers {
          id
          code
          idNumber
          shortName
          sellerLevel {
            level
            name
          }
          debtLimit
          debtAge
          vatInfoID
          isActive
          address
          warehouses {
            name
            id
            code
          }
        }
        paginationData {
          total
        }
      }
    }
  }
`;

export const GET_SELLERS_WITH_WALLET = gql`
  query GetSellers($filters: SellersFilters, $pagination: PaginationRequest) {
    seller {
      pagination(filters: $filters, pagination: $pagination) {
        sellers {
          id
          code
          fullName
          shortName
          sellerLevel {
            id
            level
          }
          isActive
          companyWallet {
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

export const GET_SELLER_DETAIL = gql`
  query GetSeller($id: ID!) {
    seller {
      get(id: $id) {
        id
        code
        logoUrl
        type
        idNumber
        shortName
        sellerLevelID
        debtLimit
        debtAge
        isActive
        fullName
        email
        telephone
        address
        cityID
        districtID
        wardID
        vatInfo {
          id
          taxIDNumber
          businessName
          representative
          telephone
          address
          email
          bankID
          bankAccountNumber
          bankBranch
        }
        warehouses {
          id
        }
        fullSaleCategories {
          checked
          level
          category {
            name
            code
            id
          }
        }
      }
    }
  }
`;

export const SELLER_LEVERS = gql`
  query {
    sellerLevel {
      list {
        id
        name
        level
      }
    }
  }
`;

export const GET_SELLER_CONTACT = gql`
  query GetSellerAddress($sellerID: ID!, $query: String) {
    contact {
      list(sellerID: $sellerID, query: $query) {
        id
        fullName
        address
        telephone
        wardID
        districtID
        cityID
        isDefault
        email
      }
    }
  }
`;

export const GET_CREATE_CART_SELLERS = gql`
  query GetSellers($filters: SellersFilters, $pagination: PaginationRequest) {
    seller {
      pagination(filters: $filters, pagination: $pagination) {
        sellers {
          id
          code
          fullName
          telephone
        }
      }
    }
  }
`;
