import { gql } from '@apollo/client';

export const GET_MORE_PRODUCT_FRAGMENT = gql`
  fragment GetMoreProductFragment on Product {
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
    stocks {
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
`;
