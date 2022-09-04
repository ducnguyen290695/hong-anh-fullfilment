import { gql } from '@apollo/client';
import { GET_MORE_PRODUCT_FRAGMENT } from './fragment';

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts(
    $filters: ProductsFilters
    $pagination: PaginationRequest
    $warehouseIDs: [ID!]
    $sellerID: ID
  ) {
    product {
      pagination(filters: $filters, pagination: $pagination) {
        paginationData {
          total
          limit
          offset
        }
        products {
          id
          name
          code
          inStock
          shortCode
          manufacturer {
            name
          }
          vat
          warranty
          productPrices {
            level1Price
            level2Price
            level3Price
            level4Price
          }
          priceOfSeller(sellerID: $sellerID) {
            price
            level
          }
          stocks(warehouseIDs: $warehouseIDs) {
            productID
            quantity
            warehouse {
              id
              code
              name
            }
          }
          updatedAt
        }
      }
    }
  }
`;
export const GET_PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    product {
      get(id: $id) {
        ...GetMoreProductFragment
      }
    }
  }
  ${GET_MORE_PRODUCT_FRAGMENT}
`;
