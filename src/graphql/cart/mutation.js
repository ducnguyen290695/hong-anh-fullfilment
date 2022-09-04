import { gql } from '@apollo/client';

export const CREATE_CART_MUTATION = gql`
  mutation CreateCart($sellerID: ID!, $items: [CartItemCreateInput!]) {
    cart {
      create(cart: { sellerID: $sellerID, items: $items }) {
        id
      }
    }
  }
`;

export const DELETE_CART_MUTATION = gql`
  mutation DeleteCart($id: ID!) {
    cart {
      delete(id: $id)
    }
  }
`;

export const UPDATE_CART_ITEMS_MUTATION = gql`
  mutation updateCartItem($cartID: Int64!, $request: CartItemUpdateRequestInput) {
    cart {
      updateCartItem(cartID: $cartID, request: $request)
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UpdateCart($cartID: Int64!, $request: UpdateCartInput) {
    cart {
      updateCart(cartID: $cartID, request: $request)
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($cartID: Int64!, $request: CartItemUpdateRequestInput) {
    cart {
      updateCartItem(cartID: $cartID, request: $request)
    }
  }
`;

export const UPDATE_CART_SELLER = gql`
  mutation updateCartSeller($cartID: Int64!, $newSellerID: Int64!) {
    cart {
      updateCartSeller(cartID: $cartID, newSellerID: $newSellerID)
    }
  }
`;

export const CLONE_CART = gql`
  mutation cloneCart($cloneCartID: Int64!) {
    cart {
      clone(cloneCartID: $cloneCartID) {
        id
      }
    }
  }
`;

export const EXPORT_CART = gql`
  mutation exportCart($cartID: Int64!, $fileType: ExportFileType!) {
    cart {
      exportFile(cartID: $cartID, fileType: $fileType) {
        path
        url
      }
    }
  }
`;
