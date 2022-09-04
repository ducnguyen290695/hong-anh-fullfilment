import { gql } from '@apollo/client';

export const UPDATE_SELLER_STATUS = gql`
  mutation UpdateSellerStatus($id: ID!, $isActive: Boolean!) {
    seller {
      updateStatus(id: $id, isActive: $isActive)
    }
  }
`;

export const CREATE_SELLER_MUTATION = gql`
  mutation CreateSeller(
    $sellerInfo: CreateSellerInfoRequest!
    $vatInfo: CreateVatInfoRequest
    $warehouseIDs: [ID!]!
    $saleCategories: [SaleCategoryInput!]!
  ) {
    seller {
      create(
        sellerInfo: $sellerInfo
        vatInfo: $vatInfo
        warehouseIDs: $warehouseIDs
        saleCategories: $saleCategories
      ) {
        id
      }
    }
  }
`;

export const UPDATE_SELLER_MUTATION = gql`
  mutation UpdateSeller(
    $sellerInfo: CreateSellerInfoRequest!
    $vatInfo: CreateVatInfoRequest
    $warehouseIDs: [ID!]!
    $saleCategories: [SaleCategoryInput!]!
    $sellerID: ID!
  ) {
    seller {
      update(
        sellerInfo: $sellerInfo
        vatInfo: $vatInfo
        warehouseIDs: $warehouseIDs
        saleCategories: $saleCategories
        sellerID: $sellerID
      ) {
        id
      }
    }
  }
`;

export const UPDATE_SELLER_SALE_CATEGORIES = gql`
  mutation UpdateSellerSaleCategories($sellerID: ID!, $saleCategories: [SaleCategoryInput!]) {
    seller {
      updateSellerSaleCategories(sellerID: $sellerID, saleCategories: $saleCategories) {
        categoryID
      }
    }
  }
`;

export const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContact($contact: ContactInput) {
    contact {
      create(contact: $contact) {
        id
      }
    }
  }
`;

export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContact($id: ID!, $contact: ContactInput) {
    contact {
      update(contact: $contact, id: $id) {
        id
      }
    }
  }
`;

export const DELETE_CONTACT_MUTATION = gql`
  mutation DeleteContact($id: ID!) {
    contact {
      delete(id: $id)
    }
  }
`;
