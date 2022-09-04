import { gql } from '@apollo/client';

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct(
    $productID: ID!
    $shortCode: String!
    $vat: Boolean!
    $prices: ProductPriceInput!
  ) {
    product {
      setShortCode(id: $productID, shortCode: $shortCode) {
        id
      }
      setVat(id: $productID, vat: $vat) {
        id
      }
      setPrices(id: $productID, prices: $prices) {
        id
      }
    }
  }
`;
